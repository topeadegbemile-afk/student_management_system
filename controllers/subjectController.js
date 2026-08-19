const Subject = require("../models/Subject");

// ===============================
// CREATE SUBJECT
// ===============================
const createSubject = async (req, res) => {
    try {
        const {
            name,
            code,
            description
        } = req.body;

        if (!name || !code) {
            return res.status(400).json({
                message: "Subject name and code are required"
            });
        }

        const existingSubject = await Subject.findOne({
            $or: [
                { name },
                { code }
            ]
        });

        if (existingSubject) {
            return res.status(400).json({
                message: "Subject name or code already exists"
            });
        }

        const subject = await Subject.create({
            name,
            code,
            description
        });

        res.status(201).json({
            message: "Subject created successfully",
            subject
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


// ===============================
// GET ALL SUBJECTS
// ===============================
const getSubjects = async (req, res) => {
    try {
        const subjects = await Subject.find()
            .sort({ name: 1 });

        res.status(200).json({
            count: subjects.length,
            subjects
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


// ===============================
// UPDATE SUBJECT
// ===============================
const updateSubject = async (req, res) => {
    try {
        const { id } = req.params;

        const subject = await Subject.findById(id);

        if (!subject) {
            return res.status(404).json({
                message: "Subject not found"
            });
        }

        const {
            name,
            code,
            description,
            isActive
        } = req.body;

        subject.name = name || subject.name;
        subject.code = code || subject.code;
        subject.description =
            description !== undefined
                ? description
                : subject.description;

        subject.isActive =
            isActive !== undefined
                ? isActive
                : subject.isActive;

        await subject.save();

        res.status(200).json({
            message: "Subject updated successfully",
            subject
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


// ===============================
// DELETE SUBJECT
// ===============================
const deleteSubject = async (req, res) => {
    try {
        const { id } = req.params;

        const subject = await Subject.findById(id);

        if (!subject) {
            return res.status(404).json({
                message: "Subject not found"
            });
        }

        await subject.deleteOne();

        res.status(200).json({
            message: "Subject deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


module.exports = {
    createSubject,
    getSubjects,
    updateSubject,
    deleteSubject
};