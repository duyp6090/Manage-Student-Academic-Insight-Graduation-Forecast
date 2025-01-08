import { Schema, model } from "mongoose";

const subjectSchema = new Schema({
    subjectCode: {
        type: String,
        required: true,
    },
    subjectName: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    credit: {
        type: Number,
        required: true,
        min: 0,
        max: 10,
    },
    processScore: {
        type: Number,
        required: true,
        min: 0,
        max: 10,
    },
    practiceScore: {
        type: Number,
        required: true,
        min: 0,
        max: 10,
    },
    midTermScore: {
        type: Number,
        required: true,
        min: 0,
        max: 10,
    },
    finalScore: {
        type: Number,
        required: true,
        min: 0,
        max: 10,
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

export const Subject = model("Subject", subjectSchema);
