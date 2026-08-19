const Class = require("../models/Class");

// =====================================
// CREATE CLASS
// =====================================
const createClass = async (req, res) => {
    try {
        const { name, description } = req.body;

        if (!name) {
            return res.status(400).json({
                message: "Class name is required"
            });
        }

        const existingClass = await Class.findOne({ name });

        if (existingClass) {
            return res.status(400).json({
                message: "Class already exists"
            });
        }

        const newClass = await Class.create({
            name,
            description
        });

        res.status(201).json({
            message: "Class created successfully",
            class: newClass
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


// =====================================
// GET ALL CLASSES
// =====================================
const getClasses = async (req, res) => {
    try {
        const classes = await Class.find()
            .sort({ name: 1 });

        res.status(200).json({
            count: classes.length,
            classes
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


// =====================================
// UPDATE CLASS
// =====================================
const updateClass = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;

        const existingClass = await Class.findById(id);

        if (!existingClass) {
            return res.status(404).json({
                message: "Class not found"
            });
        }

        // Update name if provided
        if (name) {
            existingClass.name = name;
        }

        // Update description if provided
        if (description !== undefined) {
            existingClass.description = description;
        }

        const updatedClass = await existingClass.save();

        res.status(200).json({
            message: "Class updated successfully",
            class: updatedClass
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


// =====================================
// EXPORT CONTROLLERS
// =====================================
module.exports = {
    createClass,
    getClasses,
    updateClass
};