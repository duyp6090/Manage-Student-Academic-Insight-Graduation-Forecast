import express from "express";
import cors from "cors";
import connect from "./config/database.js";
import cookieParser from "cookie-parser";
import http from "http";
import dotenv from "dotenv";
dotenv.config();
import webInitRouterStudent from "./routes/student.route.js";
import webInitRouterUser from "./routes/user/user.route.js";

// Create express app
const app = express();
const port = process.env.PORT || 3000;

//  middleware to handle given data from fe
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Create server
const server = http.createServer(app);

webInitRouterStudent(app);
webInitRouterUser(app);

// Kết nối với database
(async () => {
    try {
        await connect(process.env.URI);
        server.listen(port, () => {
            console.log("server is listening");
        });
    } catch (err) {
        console.error("Failed to start the server:", err);
    }
})();
