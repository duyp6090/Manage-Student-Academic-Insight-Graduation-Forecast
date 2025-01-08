import { Schema, model } from "mongoose";

const studientAndSubjectSchema = new Schema({
    studentId: {
        type: Schema.Types.ObjectId,
        ref: "StudentInfo",
    },
    subjectId: {
        type: Schema.Types.ObjectId,
        ref: "Subject",
    },
    semester: {
        type: String,
        required: true,
    },
    academicYear: {
        type: String,
        required: true,
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

export const StudientAndSubject = model("StudientAndSubject", studientAndSubjectSchema);
