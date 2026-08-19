const mongoose = require("mongoose");

const parentSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true
        },

        phone: {
            type: String,
            required: true
        },

        address: {
            type: String,
            default: ""
        },

        occupation: {
            type: String,
            default: ""
        },

        children: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Student"
            }
        ],

        isActive: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Parent", parentSchema);