import pandas as pd
import matplotlib.pyplot as plt
import os
import time
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
import torch
import torch.nn as nn
import torch.nn.functional as F
from torchmetrics.classification import MulticlassF1Score, MulticlassPrecision, MulticlassRecall, MulticlassAccuracy
import pytorch_lightning as pl
import matplotlib.pyplot as plt
import joblib


base_columns = [
    "mssv", "diem_tt", "OTHER", "THPT", "ĐGNL","ƯT-Bộ",'ƯT-ĐHQG', "hedt_CLC", "hedt_CNTN", "hedt_CQUI",
    "hedt_CTTT","hedt_KSTN", "chuyennganh2_7340122_CLC", "chuyennganh2_7340122_CQ",
    "chuyennganh2_7480101_CLC", "chuyennganh2_7480101_CQ", "chuyennganh2_7480101_CTTN",
    "chuyennganh2_7480102_CLC", "chuyennganh2_7480102_CQ", "chuyennganh2_7480103_CLC",
    "chuyennganh2_7480103_CQ", "chuyennganh2_7480104_CLC", "chuyennganh2_7480104_CQ",
    "chuyennganh2_7480104_CTTT", "chuyennganh2_7480106_CLC", "chuyennganh2_7480106_CQ",
    "chuyennganh2_7480109_CQ", "chuyennganh2_7480201_CLC", "chuyennganh2_7480201_CQ",
    "chuyennganh2_7480202_CLC", "chuyennganh2_7480202_CQ", "chuyennganh2_7480202_CTTN",
]

# selected_cols_1_years = ['sem1','sem2','sem3','term1','term2']#6
# selected_cols_2_years = ['sem1','sem2','sem3','sem4','sem5','sem6','term1','term2','term3','term4']#11
# selected_cols_3_years = ['sem1','sem2','sem3','sem4','sem5','sem6','sem7','sem8','sem9','term1','term2','term3','term4','term5','term6']#16
# selected_cols_3_5_years = ['sem1','sem2','sem3','sem4','sem5','sem6','sem7','sem8','sem9','sem10','term1','term2','term3','term4','term5','term6','term7']#18

selected_cols_1_years = ['sem1','sem2','sem3','term 1','term 2','label']#6
selected_cols_2_years = ['sem1','sem2','sem3','sem4','sem5','sem6','term 1','term 2','term 3','term 4']#11
selected_cols_3_years = ['sem1','sem2','sem3','sem4','sem5','sem6','sem7','sem8','sem9','term 1','term 2','term 3','term 4','term 5','term 6']#16
selected_cols_3_5_years = ['sem1','sem2','sem3','sem4','sem5','sem6','sem7','sem8','sem9','sem10','term 1','term 2','term 3','term 4','term 5','term 6','term 7']#18

firstyear=base_columns+selected_cols_1_years
secondyear=base_columns+selected_cols_2_years
thirdyear=base_columns+selected_cols_3_years
thirdfiveyear=base_columns+selected_cols_3_5_years

def process_file():
    dataset_test = pd.read_csv('../data_input/students_data.csv')

    # handel one hot encoding majorCode
    major_columns = [
        "chuyennganh2_7340122_CLC", "chuyennganh2_7340122_CQ", "chuyennganh2_7480101_CLC",
        "chuyennganh2_7480101_CQ", "chuyennganh2_7480101_CTTN", "chuyennganh2_7480102_CLC",
        "chuyennganh2_7480102_CQ", "chuyennganh2_7480103_CLC", "chuyennganh2_7480103_CQ",
        "chuyennganh2_7480104_CLC", "chuyennganh2_7480104_CQ", "chuyennganh2_7480104_CTTT",
        "chuyennganh2_7480106_CLC", "chuyennganh2_7480106_CQ", "chuyennganh2_7480109_CQ",
        "chuyennganh2_7480201_CLC", "chuyennganh2_7480201_CQ", "chuyennganh2_7480202_CLC",
        "chuyennganh2_7480202_CQ", "chuyennganh2_7480202_CTTN"
    ]

    for col in major_columns:
        dataset_test[col] = 0

    for index, row in dataset_test.iterrows():
        major_code = row["majorCode"]
        if f"chuyennganh2_{major_code}" in major_columns:
            dataset_test.at[index, f"chuyennganh2_{major_code}"] = 1

    dataset_test.drop(columns=["majorCode"], inplace=True)

    # handel one hot encoding educationSystem
    education_columns = ["hedt_CLC", "hedt_CNTN", "hedt_CQUI", "hedt_CTTT", "hedt_KSTN"]

    for col in education_columns:
        dataset_test[col] = 0

    for index, row in dataset_test.iterrows():
        education_system = row["educationSystem"]
        if f"hedt_{education_system}" in education_columns:
            dataset_test.at[index, f"hedt_{education_system}"] = 1

    dataset_test.drop(columns=["educationSystem"], inplace=True)

    # handel one hot encoding faculty
    faculty_columns = ["khoa_CNPM", "khoa_HTTT", "khoa_KHMT", "khoa_KTMT", "khoa_KTTT", "khoa_MMT&TT"]
    for col in faculty_columns:
        dataset_test[col] = 0

    for index, row in dataset_test.iterrows():
        faculty = row["faculty"]
        if f"khoa_{faculty}" in faculty_columns:
            dataset_test.at[index, f"khoa_{faculty}"] = 1

    dataset_test.drop(columns=["faculty"], inplace=True)

    # handel one hot encoding placeOfBirth
    noisinh_groups = {
        "noisinh_0": ['Cộng hòa Séc', 'Liên Bang Nga', 'Australia', 'Campuchia'],
        "noisinh_1": ['Hà Giang', 'Cao Bằng', 'Lạng Sơn', 'Bắc Giang', 'Phú Thọ', 'Thái Nguyên', 'Bắc Kạn', 'Tuyên Quang', 'Lào Cai', 'Yên Bái', 'Lai Châu', 'Sơn La', 'Điện Biên', 'Hòa Bình'],
        "noisinh_2": ['Hà Nội', 'Hải Phòng', 'Hải Dương', 'Hưng Yên', 'Vĩnh Phúc', 'Bắc Ninh', 'Thái Bình', 'Nam Định', 'Hà Nam', 'Ninh Bình', 'Quảng Ninh'],
        "noisinh_3": ['Thanh Hóa', 'Nghệ An', 'Hà Tĩnh', 'Quảng Bình', 'Quảng Trị', 'Thừa Thiên - Huế', 'Đà Nẵng', 'Quảng Nam', 'Quảng Ngãi', 'Bình Định', 'Phú Yên', 'Khánh Hòa', 'Ninh Thuận', 'Bình Thuận'],
        "noisinh_4": ['Kon Tum', 'Gia Lai', 'Đắk Lắk', 'Đắk Nông', 'Lâm Đồng'],
        "noisinh_5": ['TP. Hồ Chí Minh', 'Đồng Nai', 'Bà Rịa-Vũng Tàu', 'Bình Dương', 'Bình Phước', 'Tây Ninh'],
        "noisinh_6": ['Cần Thơ', 'Long An', 'Tiền Giang', 'Bến Tre', 'Trà Vinh', 'Vĩnh Long', 'An Giang', 'Đồng Tháp', 'Kiên Giang', 'Hậu Giang', 'Sóc Trăng', 'Bạc Liêu', 'Cà Mau']
    }

    for col in noisinh_groups.keys():
        dataset_test[col] = 0

    for index, row in dataset_test.iterrows():
        place = row["placeOfBirth"]
        for col, locations in noisinh_groups.items():
            if place in locations:
                dataset_test.at[index, col] = 1
                break  

    dataset_test.drop(columns=["placeOfBirth"], inplace=True)

    # Reorder columns
    new_columns = major_columns + education_columns + faculty_columns + list(noisinh_groups.keys())

    # Get all columns
    all_columns = list(dataset_test.columns)

    dgnl_index = all_columns.index("ƯT-ĐHQG") # Get index of ƯT-ĐHQG
    sem1_index = all_columns.index("sem1") # Get index of sem1

    columns_before_dgnl = all_columns[:dgnl_index + 1]  # Include star to dgnl
    columns_after_sem1 = all_columns[sem1_index:]  # Star from sem1 to end
    reordered_columns = columns_before_dgnl + new_columns + columns_after_sem1 # Insert new columns after ĐGNL and before sem1

    # Reorder columns
    dataset_test = dataset_test[reordered_columns]

    # Drop columns that are not needed after term 16
    term16_index = dataset_test.columns.get_loc("term 16")
    columns_to_keep = dataset_test.columns[:term16_index + 1]
    dataset_test = dataset_test[columns_to_keep]
    dataset_test = dataset_test.loc[:, ~dataset_test.columns.duplicated()]

    # get 3,5 year data
    dataset_test = dataset_test[thirdfiveyear]
    model = joblib.load("../../../model/3.5year/xgb_model_fold_5.pkl")

    # split dataset
    x_test = dataset_test.drop(columns=['mssv'])

    predicted_class = model.predict(x_test)
    output_file = "../output/predicted_classes.txt"

    with open(output_file, "w") as file:
        for pred in predicted_class:
            file.write(f"{pred.item()}\n")

    print(f"Kết quả đã được ghi vào tệp: {output_file}")

class FileChangeHandler(FileSystemEventHandler):
    def on_modified(self, event):
        if event.src_path.endswith("students_data.csv"):
            process_file()

# Lắng nghe thay đổi của file
if __name__ == "__main__":
    path = "../data_input/"
    event_handler = FileChangeHandler()
    observer = Observer()
    observer.schedule(event_handler, path, recursive=False)
    observer.start()
    print("Đang lắng nghe thay đổi file...")

    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()
    observer.join()