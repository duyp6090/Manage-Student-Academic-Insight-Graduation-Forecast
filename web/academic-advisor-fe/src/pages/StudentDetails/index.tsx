import MUIDataTable from "mui-datatables";
import { useEffect, useState } from "react";
import axios, { AxiosResponse } from "axios";
import { useParams } from "react-router-dom";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { toast } from "react-toastify";

import { BarChart, LineChart, PieChart, ScatterChart } from "@mui/x-charts";

import {
  Student,
  TrainingPoint,
  AverageScore,
  statusData,
} from "~/type/student";

function mapPerformanceLevel(value: number): string {
  const performanceMap = {
    0: "Giỏi/xuất sắc",
    1: "Khá",
    2: "Trung bình khá",
    3: "Trung bình",
    4: "Chưa đạt",
  };

  if (value in performanceMap) {
    return performanceMap[value as keyof typeof performanceMap];
  }

  return "Không xác định"; // Xử lý giá trị ngoài phạm vi
}

function StudentDetails(): JSX.Element {
  const [students, setStudents] = useState<Student>(); // State kiểu mảng các đối tượng Student
  const [data, setData] = useState<string[][]>([]); // State để lưu trữ dữ liệu cho bảng
  const [statusData, setStatusData] = useState<statusData>(); // State để lưu trữ dữ liệu trạng thái từ API
  const { id } = useParams();

  useEffect(() => {
    axios
      .get<Student>(`http://localhost:3000/api/students/${id}`)
      .then((response: AxiosResponse<Student>) => {
        setStudents(response.data);
      })
      .catch((error) => {
        console.error("Error fetching students:", error);
      });
  }, []);

  const fetchStatusData = () => {
    const apiCall = axios.get<statusData>(`http://localhost:3000/api/students-to-csv/${id}`);
  
    toast.promise(
      apiCall,
      {
        pending: "Đang dự đoán...",
        success: "Lấy dữ liệu dự đoán thành công!",
        error: "Đã có lỗi xảy ra.",
      },
    );
  
    apiCall
      .then((response: AxiosResponse<statusData>) => {
        setStatusData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching status data:", error);
      });
  };

  useEffect(() => {
    if (statusData && statusData.data.length > 0) {
      // Mảng các giá trị trạng thái
      const statusLabels = [
        "Giỏi/xuất sắc",
        "Khá",
        "Trung bình khá",
        "Trung bình",
        "Chưa đạt",
      ];

      // Ghép giá trị từ statusData vào phần tử cuối cùng của mỗi mảng con trong data
      const updatedData = data.map((row, index) => {
        if (index < statusData.data.length) {
          const statusIndex = statusData.data[index]; // Lấy giá trị trạng thái
          const statusLabel =
            statusLabels[Number(statusIndex)] || "Chưa xác định"; // Quy đổi thành nhãn
          return [...row, statusLabel]; // Thêm nhãn trạng thái vào mảng con
        }
        return row;
      });

      setData(updatedData); // Cập nhật lại dữ liệu bảng với trạng thái mới
    }
  }, [statusData]);

  useEffect(() => {
    console.log(statusData);
  }, [statusData]);

  return (
    <div className="mt-5 mx-auto pb-4 w-full px-4">
      {students && (
        <div className="rounded-xl shadow-lg px-6 py-10">
          <div className="grid grid-cols-4 justify-between font-semibold items-center">
            <div className="flex flex-col gap-3 justify-center">
              {statusData && (
                <div
                  className={`px-2 py-1 rounded-lg text-white mx-auto ${
                    statusData.data[0] === "4"
                      ? "bg-red-700"
                      : statusData.data[0] === "3"
                      ? "bg-orange-700"
                      : "bg-green-500"
                  }`}
                >
                  {mapPerformanceLevel(Number(statusData.data[0]))}
                </div>
              )}
              <AccountCircleIcon
                color="info"
                sx={{ fontSize: "120px", margin: "auto" }}
              />
              <button
                onClick={fetchStatusData}
                className="mb-4 p-2 bg-blue-500 text-white rounded max-w-48 mx-auto"
              >
                Lấy dữ liệu dự đoán
              </button>
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex gap-2">
                <p>MSSV:</p>
                <p className="font-normal">{students.studentId}</p>
              </div>

              <div className="flex gap-2">
                <p>Họ và tên:</p>
                <p className="font-normal">{students.name}</p>
              </div>

              <div className="flex gap-2">
                <p>Hệ đào tạo:</p>
                <p className="font-normal">{students.educationSystem}</p>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex gap-2">
                <p>Giới tính:</p>
                <p className="font-normal">
                  {students.gender === "Male" ? "Nam" : "Nữ"}
                </p>
              </div>

              <div className="flex gap-2">
                <p>Mã ngành:</p>
                <p className="font-normal">{students.majorCode}</p>
              </div>

              <div className="flex gap-2">
                <p>Email:</p>
                <p className="font-normal">{students.email}</p>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex gap-2">
                <p>Ngành học:</p>
                <p className="font-normal">{students.faculty}</p>
              </div>

              <div className="flex gap-2">
                <p>Nơi sinh:</p>
                <p className="font-normal">{students.placeOfBirth}</p>
              </div>

              <div className="flex gap-2">
                <p>Số điện thoại</p>
                <p className="font-normal">{students.phoneNumber}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* <button
        onClick={fetchStatusData}
        className="mb-4 p-2 bg-blue-500 text-white rounded"
      >
        Lấy dữ liệu dự đoán
      </button>
      <div className="flex justify-center">
        <MUIDataTable
          title={"Danh sách sinh viên"}
          data={data}
          columns={[...columns, "Trạng thái"]} // Thêm cột "Trạng thái"
          options={options}
        />
      </div> */}

      {students && (
        <div className="mt-10">
          <div style={{ marginBottom: "40px" }} className="flex flex-col gap-5 justify-center">
            <h3 className="font-bold">Điểm trung bình mỗi học kỳ</h3>
            <BarChart
              series={[
                {
                  data: students.averageScores
                    .filter((item) => item.averageScore >= 0) // Lọc bỏ giá trị -1
                    .map((item) => item.averageScore),
                  label: "Điểm trung bình học kỳ",
                },
              ]}
              xAxis={[
                {
                  scaleType: "band",
                  data: students.averageScores
                    .filter((item) => item.averageScore >= 0)
                    .map((item) => `${item.semester} (${item.academicYear})`),
                },
              ]}
              yAxis={[
                {
                  scaleType: "linear",
                  min: 0,
                  max: 10,
                  label: "Điểm trung bình",
                },
              ]}
              height={300}
            />
          </div>

          <div style={{ marginBottom: "40px" }} className="flex flex-col gap-5 justify-center">
            <h3 className="font-bold">Điểm rèn luyện qua từng học kỳ</h3>
            <LineChart
              series={[
                {
                  data: students.trainingPoints
                    .filter((item) => item.trainingPoint >= 0) // Lọc bỏ giá trị -1
                    .map((item) => item.trainingPoint),
                  label: "Điểm rèn luyện học kỳ",
                },
              ]}
              xAxis={[
                {
                  scaleType: "band",
                  data: students.trainingPoints
                    .filter((item) => item.trainingPoint >= 0)
                    .map((item) => `${item.semester} (${item.academicYear})`),
                },
              ]}
              yAxis={[
                {
                  scaleType: "linear",
                  min: 0,
                  max: 100,
                  label: "Điểm rèn luyện",
                },
              ]}
              height={300}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default StudentDetails;
