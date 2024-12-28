import { Schema, model } from "mongoose";

const classSchema = new Schema({
    name: {
        type: String,
        required: true, // Name class (VD: 18DTHD1)
    },
    year: {
        type: Number,
        required: true, // Student's year (VD: 1, 2, 3, 4)
    },
    advisorId: {
        type: Schema.Types.ObjectId,
        ref: "Teacher", // reference to Teacher table
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

export const Class = model("Class", classSchema);
