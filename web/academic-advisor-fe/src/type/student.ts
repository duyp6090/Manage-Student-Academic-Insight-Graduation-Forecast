export interface AverageScore {
  _id: string;
  studentId: string;
  averageScore: number; // Có thể là số âm, cần xử lý cẩn thận
  semester: string;
  academicYear: string;
}

// Kiểu dữ liệu cho điểm rèn luyện của sinh viên
export interface TrainingPoint {
  _id: string;
  studentId: string;
  trainingPoint: number; // Điểm rèn luyện (có thể là từ 0-100)
  semester: string;
  academicYear: string;
}

// Kiểu dữ liệu chính cho thông tin sinh viên
export interface Student {
  _id: string;
  studentId: string;
  name: string;
  admissionMethod: string;
  gender: "Male" | "Female" | string; // Giới tính có thể thêm các giá trị khác nếu cần
  faculty: string; // Khoa
  educationSystem: string; // Hệ đào tạo
  majorCode: string; // Mã ngành
  admissionScore: number; // Điểm xét tuyển
  placeOfBirth: string; // Nơi sinh
  phoneNumber: string; // Số điện thoại
  email: string; // Email liên lạc
  averageScores: AverageScore[]; // Danh sách điểm trung bình
  trainingPoints: TrainingPoint[]; // Danh sách điểm rèn luyện
}

export interface statusData {
  message: string;
  data: string[];
}
