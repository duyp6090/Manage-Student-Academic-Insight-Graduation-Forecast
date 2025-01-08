import { Schema, model } from "mongoose";

const studentInfoSchema = new Schema({
    studentId: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
    },
    admissionMethod: {
        type: String,
        required: true,
    },
    admissionScore: {
        type: Number,
        required: true,
        min: 0,
    },
    gender: {
        type: String,
        required: true,
        enum: ["Male", "Female"],
    },
    faculty: {
        type: String,
        required: true,
    },
    classOfFaculty: {
        type: Schema.Types.ObjectId,
        ref: "Class", // Reference to Account table
        required: true,
    },
    educationSystem: {
        type: String,
        required: true,
    },
    placeOfBirth: {
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
        match: /.+\@.+\..+/,
    },
});

export const StudentInfo = model("StudentInfo", studentInfoSchema);
