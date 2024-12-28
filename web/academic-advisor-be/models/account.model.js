import { Schema, model } from "mongoose";

const accountSchema = new Schema({
    account: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    avatar: {
        url: {
            type: String,
            default: "",
        },
        publicId: {
            type: String,
            default: "",
        },
    },
    role: {
        type: String,
        required: true,
        enum: ["student", "admin", "teacher"],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

export const Account = model("Account", accountSchema);
