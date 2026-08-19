const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true
        },

        admissionNumber: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },

        firstName: {
            type: String,
            required: true,
            trim: true
        },

        lastName: {
            type: String,
            required: true,
            trim: true
        },

        middleName: {
            type: String,
            default: "",
            trim: true
        },

        gender: {
            type: String,
            enum: ["male", "female"],
            required: true
        },

        dateOfBirth: {
            type: Date
        },

        class: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Class",
            required: true
        },

        parent: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Parent",
            required: true
        },

        address: {
            type: String,
            default: ""
        },

        phone: {
            type: String,
            default: ""
        },

        isActive: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Student", studentSchema);