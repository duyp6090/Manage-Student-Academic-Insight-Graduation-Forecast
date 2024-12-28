import MUIDataTable from "mui-datatables";
import { useEffect, useState } from "react";
import axios, { AxiosResponse } from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { Student, TrainingPoint, AverageScore, statusData } from "~/type/student";

const columns = [
  "MSSV",
  "Họ tên",
  "Giới tính",
  "Nơi sinh",
  "Điện thoại",
  "Email",
];

function Students(): JSX.Element {
  const navigate = useNavigate()

  const [students, setStudents] = useState<Student[]>([]); // State kiểu mảng các đối tượng Student
  const [data, setData] = useState<string[][]>([]); // State để lưu trữ dữ liệu cho bảng
  const [statusData, setStatusData] = useState<statusData>(); // State để lưu trữ dữ liệu trạng thái từ API

  useEffect(() => {
    axios
      .get<Student[]>("http://localhost:3000/api/students") // Gọi API lấy thông tin sinh viên
      .then((response: AxiosResponse<Student[]>) => {
        setStudents(response.data); // Cập nhật danh sách sinh viên
      })
      .catch((error) => {
        console.error("Error fetching students:", error);
      });
  }, []);

  useEffect(() => {
    // Tạo dữ liệu cho bảng dựa trên danh sách students
    const formattedData = students.map((student) => [
      student.studentId, // MSSV
      student.name, // Họ tên
      student.gender, // Giới tính
      student.placeOfBirth, // Nơi sinh
      student.phoneNumber, // Điện thoại
      student.email, // Email
    ]);

    setData(formattedData); // Cập nhật lại dữ liệu bảng
  }, [students]);

  // Hàm gọi API để lấy điểm trạng thái của sinh viên
  const fetchStatusData = () => {
    const apiCall = axios.get<statusData>("http://localhost:3000/api/students-to-csv");
  
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
      const statusLabels = ["Giỏi/xuất sắc", "Khá", "Trung bình khá", "Trung bình", "Chưa đạt"];
  
      // Ghép giá trị từ statusData vào phần tử cuối cùng của mỗi mảng con trong data
      const updatedData = data.map((row, index) => {
        if (index < statusData.data.length) {
          const statusIndex = statusData.data[index]; // Lấy giá trị trạng thái
          const statusLabel = statusLabels[Number(statusIndex)] || "Chưa xác định"; // Quy đổi thành nhãn
          return [...row, statusLabel]; // Thêm nhãn trạng thái vào mảng con
        }
        return row;
      });
  
      setData(updatedData); // Cập nhật lại dữ liệu bảng với trạng thái mới
    }
  }, [statusData]);

  const options = {
    // filterType: "checkbox",
    onRowClick: (rowData: string[], rowMeta: { dataIndex: number }) => {
      const studentId = students[rowMeta.dataIndex]?.studentId; // Lấy MSSV từ danh sách sinh viên
      if (studentId) {
        navigate(`/students/${studentId}`); // Điều hướng tới trang chi tiết sinh viên
      }
    },
  };

  return (
    <div className="mt-10 mx-auto pb-4">
      <button
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
      </div>
    </div>
  );
}

export default Students;
