// Import sub-routers
import userRoute from "./logInLogOut.route.js";

function webInitRouterUser(app) {
    app.use("/api/user", userRoute);
}

export default webInitRouterUser;
