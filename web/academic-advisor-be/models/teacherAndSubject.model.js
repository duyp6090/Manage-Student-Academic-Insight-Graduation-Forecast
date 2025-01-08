import { Schema, model } from "mongoose";

const teacherAndSubjectSchema = new Schema({
    teacherId: {
        type: Schema.Types.ObjectId,
        ref: "Teacher",
        required: true,
    },
    subjectId: {
        type: Schema.Types.ObjectId,
        ref: "Subject",
        required: true,
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

export const TeacherAndSubject = model("TeacherAndSubject", teacherAndSubjectSchema);
