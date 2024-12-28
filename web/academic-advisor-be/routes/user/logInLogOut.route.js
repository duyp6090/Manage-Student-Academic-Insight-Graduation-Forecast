import express from "express";
const userRoute = express.Router();

import { logIn } from "../../controller/user/logInLogOut.controller.js";

userRoute.post("/login", logIn);

export default userRoute;
