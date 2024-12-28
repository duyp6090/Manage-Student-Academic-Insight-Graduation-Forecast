// Import model account
import { Account } from "../../models/account.model.js";

// Import helper function
import { createToken } from "../../helper/token.js";

const logIn = async (req, res) => {
    try {
        // Get account and password from request body
        const accountLogIn = req.body.account || "";
        const passwordLogIn = req.body.password || "";

        // Find account
        const account = await Account.findOne({ account: accountLogIn });

        if (!account) {
            return res.status(404).json({ msg: "Account does not exist" });
        }

        // Check password
        if (account.password !== passwordLogIn) {
            return res.status(401).json({ msg: "Password is incorrect" });
        }

        // Create token
        const token = createToken(account);

        return res
            .status(200)
            .cookie("token", token, { httpOnly: true, secure: true })
            .json({
                msg: "Log in success",
                success: true,
                user: { account: account.account, role: account.role, avatar: account.avatar },
            });
    } catch (error) {
        return res.status(500).json({ msg: error.message });
    }
};

const logOut = async (req, res) => {
    try {
        return res.status(200).clearCookie("token").json({ msg: "Log out success", success: true });
    } catch (error) {
        return res.status(500).json({ msg: error.message });
    }
};

export { logIn, logOut };
