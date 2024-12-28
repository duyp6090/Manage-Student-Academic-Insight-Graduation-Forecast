// Import libraries
import crypto from "crypto";
import { base64Url, base64UrlDecode } from "./baseUrl64.js";

// Create a token
function createToken(user) {
    // Get the secret key
    const jwtSecret = process.env.JWT_SECRET;

    const header = {
        alg: "HS256",
        typ: "JWT",
    };

    const payload = {
        account: user.account,
        role: user.role,
        userId: user._id,
        exp: Date.now() + 60 * 60 * 1000,
    };

    // Encode the header and payload
    const headerEncode = base64Url(JSON.stringify(header));
    const payloadEncode = base64Url(JSON.stringify(payload));

    // Create token data
    const tokenData = `${headerEncode}.${payloadEncode}`;

    // Create hmac sha256 signature
    const signature = crypto.createHmac("sha256", jwtSecret).update(tokenData).digest("base64url");

    // Create token
    const token = `${tokenData}.${signature}`;

    // Return token
    return token;
}

// Verify token
function verifytoken(token) {
    // Check token
    if (!token) {
        return null;
    } else {
        // Verify token
        const [header, payload, signature] = token.split("."); // get info token

        // Create token data
        const tokenData = `${header}.${payload}`;

        // Decode payload signature
        const decodedPayload = JSON.parse(base64UrlDecode(payload));

        const jwtSecret = process.env.JWT_SECRET; // get secret key

        // Create signature check
        const signatureCheck = crypto
            .createHmac("sha256", jwtSecret)
            .update(tokenData)
            .digest("base64url");

        // Check signature is valid
        if (signature === signatureCheck && Date.now() <= decodedPayload.exp) {
            return decodedPayload;
        } else {
            return null;
        }
    }
}

export { createToken, verifytoken };
