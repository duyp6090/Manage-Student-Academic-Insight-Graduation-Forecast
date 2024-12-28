// Import models
import fs from "fs";
import path from "path";
import { Parser } from "json2csv";

import { AverageSemesterScore } from "../models/semesterscores.model.js";
import { TrainingPoint } from "../models/trainingpoint.model.js";
import { StudentInfo } from "../models/studentinfo.model.js";

// Import authenticate and authorize middleware
// import { authenticate, authorizeRoles } from "../../middleware/user/authentication.js";

// Import controller
import {
    getAllStudients,
    getDetailInforStudient,
    exportStudientsToCSV,
    exportStudientToCSV,
} from "../controller/studient.controller.js";

function webInitRouterStudent(app) {
    // API to get all students' information
    app.get("/api/students", getAllStudients);

    // API to get a single student's information by student ID
    app.get("/api/students/:studentId", getDetailInforStudient);

    // API to predict all student's graduation
    app.get("/api/students-to-csv", exportStudientsToCSV);

    // API to predict a single student's graduation
    app.get("/api/students-to-csv/:studentId", exportStudientToCSV);
}

export default webInitRouterStudent;
