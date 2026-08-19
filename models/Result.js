const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema(
    {
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Student",
            required: true
        },

        class: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Class",
            required: true
        },

        subject: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Subject",
            required: true
        },

        session: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Session",
            required: true
        },

        term: {
            type: String,
            enum: [
                "First Term",
                "Second Term",
                "Third Term"
            ],
            required: true
        },

        caScore: {
            type: Number,
            min: 0,
            max: 30,
            required: true
        },

        examScore: {
            type: Number,
            min: 0,
            max: 70,
            required: true
        },

        totalScore: {
            type: Number,
            min: 0,
            max: 100,
            required: true
        },

        grade: {
            type: String,
            enum: ["A", "B", "C", "D", "E", "F"],
            required: true
        },

        remark: {
            type: String,
            default: ""
        },

        teacherComment: {
            type: String,
            default: ""
        },

        isPublished: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);


// Prevent duplicate result
resultSchema.index(
    {
        student: 1,
        subject: 1,
        session: 1,
        term: 1
    },
    {
        unique: true
    }
);


module.exports = mongoose.model("Result", resultSchema);