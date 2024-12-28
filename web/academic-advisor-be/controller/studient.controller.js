// Import model
import { AverageSemesterScore } from "../models/semesterscores.model.js";
import { TrainingPoint } from "../models/trainingpoint.model.js";
import { StudentInfo } from "../models/studentinfo.model.js";

// Import library
// import fs from "fs";
// import path from "path";
// import { Parser } from "json2csv";

// Import helpder function
import { callingModelToPredict } from "../helper/callingModelToPredict.js";
import { convertInforStudientToCsv } from "../helper/convertInformationStudientToCsv.js";

// Get all studient
const getAllStudients = async (req, res) => {
    try {
        const students = await StudentInfo.aggregate([
            {
                $lookup: {
                    from: "averagesemesterscores",
                    localField: "studentId",
                    foreignField: "studentId",
                    as: "averageScores",
                },
            },
            {
                $lookup: {
                    from: "trainingpoints",
                    localField: "studentId",
                    foreignField: "studentId",
                    as: "trainingPoints",
                },
            },
            {
                $addFields: {
                    averageScores: {
                        $sortArray: {
                            input: "$averageScores",
                            sortBy: {
                                academicYear: 1, // sort by academicYear ascending
                                semester: 1, // sort by semester ascending
                            },
                        },
                    },
                    trainingPoints: {
                        $sortArray: {
                            input: "$trainingPoints",
                            sortBy: {
                                academicYear: 1, // sort by academicYear ascending
                                semester: 1, // sort by semester ascending
                            },
                        },
                    },
                },
            },
        ]);
        res.status(200).json(students);
    } catch (error) {
        res.status(500).json({ message: "Error fetching students' information", error });
    }
};

// Get detail information of a studient
const getDetailInforStudient = async (req, res) => {
    const { studentId } = req.params;
    try {
        const student = await StudentInfo.aggregate([
            {
                $match: { studentId },
            },
            {
                $lookup: {
                    from: "averagesemesterscores",
                    localField: "studentId",
                    foreignField: "studentId",
                    as: "averageScores",
                },
            },
            {
                $lookup: {
                    from: "trainingpoints",
                    localField: "studentId",
                    foreignField: "studentId",
                    as: "trainingPoints",
                },
            },
        ]);

        if (!student.length) {
            return res.status(404).json({ message: "Student not found" });
        }

        res.status(200).json(student[0]);
    } catch (error) {
        res.status(500).json({ message: "Error fetching student's information", error });
    }
};

// Get all studients' information and export to CSV file and train model
const predictGraduationAllStudent = async (req, res) => {
    try {
        const students = await StudentInfo.aggregate([
            {
                $lookup: {
                    from: "averagesemesterscores",
                    localField: "studentId",
                    foreignField: "studentId",
                    as: "averageScores",
                },
            },
            {
                $lookup: {
                    from: "trainingpoints",
                    localField: "studentId",
                    foreignField: "studentId",
                    as: "trainingPoints",
                },
            },
            {
                $addFields: {
                    averageScores: {
                        $sortArray: {
                            input: "$averageScores",
                            sortBy: {
                                academicYear: 1,
                                semester: 1,
                            },
                        },
                    },
                    trainingPoints: {
                        $sortArray: {
                            input: "$trainingPoints",
                            sortBy: {
                                academicYear: 1,
                                semester: 1,
                            },
                        },
                    },
                },
            },
        ]);

        // Check if there is no student
        if (!students.length) {
            return res.status(404).json({ message: "No student found" });
        }

        const csv = await convertInforStudientToCsv(students); // convert student to csv
        const dataPredicted = await callingModelToPredict(csv); // call model to predict

        res.status(200).json({
            message: "File updated and processed successfully",
            data: dataPredicted,
        });
    } catch (error) {
        res.status(500).json({ message: "Error processing students' data", error });
    }
};

const predictGraduationOneStudent = async (req, res) => {
    const { studentId } = req.params;
    try {
        const student = await StudentInfo.aggregate([
            {
                $match: { studentId },
            },
            {
                $lookup: {
                    from: "averagesemesterscores",
                    localField: "studentId",
                    foreignField: "studentId",
                    as: "averageScores",
                },
            },
            {
                $lookup: {
                    from: "trainingpoints",
                    localField: "studentId",
                    foreignField: "studentId",
                    as: "trainingPoints",
                },
            },
            {
                $addFields: {
                    averageScores: {
                        $sortArray: {
                            input: "$averageScores",
                            sortBy: {
                                academicYear: 1, // sort by academicYear ascending
                                semester: 1, // sort by semester ascending
                            },
                        },
                    },
                    trainingPoints: {
                        $sortArray: {
                            input: "$trainingPoints",
                            sortBy: {
                                academicYear: 1, // sort by academicYear ascending
                                semester: 1, // sort by semester ascending
                            },
                        },
                    },
                },
            },
        ]);

        if (!student.length) {
            return res.status(404).json({ message: "Student not found" });
        }

        const csv = await convertInforStudientToCsv(student); // convert student to csv
        const dataPredicted = await callingModelToPredict(csv); // call model to predict

        res.status(200).json({
            message: "File updated and processed successfully",
            data: dataPredicted,
        });
    } catch (error) {
        res.status(500).json({ message: "Error processing students' data", error });
    }
};

// Export
export {
    getAllStudients,
    getDetailInforStudient,
    predictGraduationAllStudent,
    predictGraduationOneStudent,
};
