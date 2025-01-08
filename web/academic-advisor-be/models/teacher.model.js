import { Schema, model } from "mongoose";

const teacherSchema = new Schema({
    accountId: {
        type: Schema.Types.ObjectId,
        ref: "Account", // Reference to Account table
        required: true,
    },
    fullName: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true,
        match: /^\d{10,11}$/,
    },
    email: {
        type: String,
        required: true,
        match: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    },
    faculty: {
        type: String,
        required: true, // Specific faculty
    },
    officeHours: {
        type: String, // Time range to work with students
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

export const Teacher = model("Teacher", teacherSchema);
