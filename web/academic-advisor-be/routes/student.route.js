// Import authenticate and authorize middleware
// import { authenticate, authorizeRoles } from "../../middleware/user/authentication.js";

// Import controller
import {
    getAllStudients,
    getDetailInforStudient,
    predictGraduationAllStudent,
    predictGraduationOneStudent,
} from "../controller/studient.controller.js";

function webInitRouterStudent(app) {
    // API to get all students' information
    app.get("/api/students", getAllStudients);

    // API to get a single student's information by student ID
    app.get("/api/students/:studentId", getDetailInforStudient);

    // API to predict all student's graduation
    app.get("/api/students-to-csv", predictGraduationAllStudent);

    // API to predict a single student's graduation
    app.get("/api/students-to-csv/:studentId", predictGraduationOneStudent);
}

export default webInitRouterStudent;
