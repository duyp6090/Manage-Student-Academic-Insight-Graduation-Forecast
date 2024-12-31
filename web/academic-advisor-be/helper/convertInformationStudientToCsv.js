import { Parser } from "json2csv";

const convertInforStudientToCsv = async (students) => {
    // handle data csv
    const csvData = students.map((student) => {
        // create list averageScore and trainingPoint
        const averageScoresColumns = Array(22).fill(-1);
        const trainingPointsColumns = Array(16).fill(-1);

        // handle index of semester and term
        student.averageScores.forEach((score) => {
            const semesterIndex =
                (parseInt(score.academicYear.split("-")[0]) - 2022) * 3 +
                (parseInt(score.semester) - 1);
            if (semesterIndex >= 0 && semesterIndex < 22) {
                averageScoresColumns[semesterIndex] = (score.averageScore || 0) / 10;
            }
        });

        student.trainingPoints.forEach((point) => {
            const termIndex =
                (parseInt(point.academicYear.split("-")[0]) - 2022) * 2 +
                (parseInt(point.semester) - 1);
            if (termIndex >= 0 && termIndex < 16) {
                trainingPointsColumns[termIndex] = (point.trainingPoint || 0) / 100;
            }
        });

        const admissionMethodColumns = {
            THPT: student.admissionMethod === "THPT" ? 1 : 0,
            ĐGNL: student.admissionMethod === "ĐGNL" ? 1 : 0,
            OTHER: student.admissionMethod === "Khác" ? 1 : 0,
            "ƯT-Bộ": student.admissionMethod === "ƯT-Bộ" ? 1 : 0,
            "ƯT-ĐHQG": student.admissionMethod === "ƯT-ĐHQG" ? 1 : 0,
        };

        return {
            mssv: student.studentId,
            diem_tt: student.admissionScore || "N/A",
            OTHER: admissionMethodColumns.OTHER,
            THPT: admissionMethodColumns.THPT,
            ĐGNL: admissionMethodColumns["ĐGNL"],
            "ƯT-Bộ": admissionMethodColumns["ƯT-Bộ"],
            "ƯT-ĐHQG": admissionMethodColumns["ƯT-ĐHQG"],
            majorCode: student.majorCode || "N/A",
            educationSystem: student.educationSystem || "N/A",
            faculty: student.faculty || "N/A",
            placeOfBirth: student.placeOfBirth || "N/A",
            ...Object.fromEntries(averageScoresColumns.map((score, i) => [`sem${i + 1}`, score])),
            ...Object.fromEntries(trainingPointsColumns.map((point, i) => [`term${i + 1}`, point])),
        };
    });

    const fields = [
        "mssv",
        "diem_tt",
        "OTHER",
        "THPT",
        "ĐGNL",
        "ƯT-Bộ",
        "ƯT-ĐHQG",
        "majorCode",
        "educationSystem",
        "faculty",
        "placeOfBirth",
        ...Array.from({ length: 22 }, (_, i) => `sem${i + 1}`),
        ...Array.from({ length: 16 }, (_, i) => `term ${i + 1}`),
    ];

    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(csvData);

    return csv;
};

export { convertInforStudientToCsv };
