import { BarChart } from "@mui/x-charts/BarChart";
import { PieChart } from "@mui/x-charts/PieChart";
import { LineChart, lineElementClasses } from "@mui/x-charts/LineChart";
import { FaPeopleLine } from "react-icons/fa6";
import Stack from "@mui/material/Stack";
import { Gauge } from "@mui/x-charts/Gauge";
import { useState, useEffect } from "react";
import { Student, statusData } from "~/type/student";
import axios, { AxiosResponse } from "axios";

// Hàm lấy điểm trung bình học kỳ gần nhất
const getLatestSemesterScores = (students: Student[]) => {
  return students.map((student) => {
    // Đảm bảo kiểu `reduce` chính xác bằng cách khai báo `initialValue` và chỉ định kiểu trả về rõ ràng
    const latestScores = student.averageScores.reduce<{
      semester: string;
      academicYear: string;
      averageScore: number;
    } | null>((latest, score) => {
      if (
        !latest ||
        score.academicYear > latest.academicYear ||
        (score.academicYear === latest.academicYear &&
          score.semester > latest.semester)
      ) {
        return score;
      }
      return latest;
    }, null);

    return latestScores?.averageScore || 0; // Trả về điểm của học kỳ gần nhất hoặc 0 nếu không có
  });
};

// Phân loại điểm
const classifyScores = (scores: number[]) => {
  const classification = {
    excellent: 0,
    good: 0,
    average: 0,
    fail: 0,
  };

  scores.forEach((score) => {
    if (score >= 8) classification.excellent += 1;
    else if (score >= 7) classification.good += 1;
    else if (score >= 5) classification.average += 1;
    else classification.fail += 1;
  });

  return classification;
};

function Dashboard() {
  const [students, setStudents] = useState<Student[]>([]); // State kiểu mảng các đối tượng Student
  const [data, setData] = useState<string[][]>([]); // State để lưu trữ dữ liệu cho bảng
  const [statusData, setStatusData] = useState<statusData>(); // State để lưu trữ dữ liệu trạng thái từ API

  const semesterScores: Record<string, number[]> = {};
  const semesterTrainingPoints: Record<string, number[]> = {};
  const averageScoreDistribution: { range: string; count: number }[] = [];

  const latestScores = getLatestSemesterScores(students); // Lấy điểm trung bình học kỳ gần nhất
  const classifications = classifyScores(latestScores); // Phân loại

  const pieData = [
    { id: 0, value: classifications.excellent, label: "Giỏi/Xuất sắc" },
    { id: 1, value: classifications.good, label: "Khá" },
    { id: 2, value: classifications.average, label: "Trung bình" },
    { id: 3, value: classifications.fail, label: "Không đạt" },
  ];

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
    axios
      .get<statusData>("http://localhost:3000/api/students-to-csv")
      .then((response: AxiosResponse<statusData>) => {
        setStatusData(response.data); // Lưu dữ liệu trạng thái
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

  students.forEach((student) => {
    student.averageScores.forEach((score) => {
      if (score.averageScore >= 0) {
        const key = `${score.academicYear} - ${score.semester}`;
        if (!semesterScores[key]) semesterScores[key] = [];
        semesterScores[key].push(score.averageScore);
      }
    });

    student.trainingPoints.forEach((point) => {
      const key = `${point.academicYear} - ${point.semester}`;
      if (!semesterTrainingPoints[key]) semesterTrainingPoints[key] = [];
      semesterTrainingPoints[key].push(point.trainingPoint);
    });

    student.averageScores.forEach((score) => {
      if (score.averageScore >= 0) {
        const range = `${Math.floor(score.averageScore)}-${
          Math.floor(score.averageScore) + 1
        }`;
        const existingRange = averageScoreDistribution.find(
          (item) => item.range === range
        );
        if (existingRange) {
          existingRange.count += 1;
        } else {
          averageScoreDistribution.push({ range, count: 1 });
        }
      }
    });
  });

  const averageSemesterScores = Object.entries(semesterScores).map(
    ([key, scores]) => ({
      semester: key,
      averageScore: scores.reduce((a, b) => a + b, 0) / scores.length,
    })
  );

  const averageTrainingPoints = Object.entries(semesterTrainingPoints).map(
    ([key, points]) => ({
      semester: key,
      averageTrainingPoint: points.reduce((a, b) => a + b, 0) / points.length,
    })
  );

  return (
    <div className="bg-slate-100 w-full px-10">
      <h2 className="font-bold text-xl text-black p-4">Bảng điều kiển</h2>
      <div className="flex p-4">
        <div className="w-64 h-24 bg-white flex items-center gap-x-2 rounded-md m-4">
          <div className="size-16 bg-green-200 rounded-full ml-3 flex items-center justify-center">
            <FaPeopleLine size={30} color="green" />
          </div>
          <hr className="border-t-2 border-red-600 w-2/12 rotate-90" />
          <div className="flex flex-col">
            <p className="text-black/30 text-xl">Sinh viên</p>
            <span className="font-bold text-xl">{students.length}</span>
          </div>
        </div>
      </div>
      <div className="flex justify-around items-center">
        <div className="w-full max-w-[800px] mx-auto">
          <BarChart
            series={[
              {
                data: averageSemesterScores.map((item) => item.averageScore),
                label: "Điểm trung bình học kỳ",
              },
            ]}
            xAxis={[
              {
                scaleType: "band",
                data: averageSemesterScores.map((item) => item.semester),
              },
            ]}
            yAxis={[
              {
                scaleType: "linear",
                min: 0, // Giá trị thấp nhất của Y-axis
                max: 10, // Giá trị cao nhất của Y-axis (tùy chỉnh dựa trên dữ liệu)
                label: "Average Score",
              },
            ]}
            height={300}
          />
        </div>
        <div className="w-full flex justify-center flex-col gap-4 max-w-[800px] mx-auto">
          <PieChart
            series={[
              {
                data: pieData.filter((item) => item.value > 0), // Chỉ hiển thị các loại có giá trị > 0
              },
            ]}
            width={400}
            height={200}
          ></PieChart>
          <text className="font-bold text-center mx-auto">
            Phân phối xếp hạng điểm trung bình của học kỳ trước
          </text>
        </div>
      </div>
      <div className="flex justify-center items-center mx-auto mt-10">
        <LineChart
          series={[
            {
              data: averageTrainingPoints.map(
                (item) => item.averageTrainingPoint
              ),
              label: "Điểm rèn luyện",
              color: "#8884d8", // Thay đổi màu sắc của đường
            },
          ]}
          xAxis={[
            {
              scaleType: "band",
              data: averageTrainingPoints.map((item) => item.semester),
            },
          ]}
          yAxis={[{ scaleType: "linear" }]}
          height={300}
        >
          {averageTrainingPoints.map((item, index) => (
            <text
              key={index}
              x={index * 162 + 120} // Điều chỉnh vị trí x của label
              y={item.averageTrainingPoint - 15} // Điều chỉnh vị trí y của label
              textAnchor="middle"
              fill="#8884d8"
              fontSize={12}
            >
              {item.averageTrainingPoint}
            </text>
          ))}
        </LineChart>
      </div>
    </div>
  );
}

export default Dashboard;
