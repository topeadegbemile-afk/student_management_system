const Teacher = require("../models/Teacher");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

// =====================================
// CREATE TEACHER
// =====================================
const createTeacher = async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            email,
            password,
            employeeId,
            phone,
            subjects,
            classes
        } = req.body;

        // Validate required fields
        if (
            !firstName ||
            !lastName ||
            !email ||
            !password ||
            !employeeId
        ) {
            return res.status(400).json({
                message:
                    "First name, last name, email, password and employee ID are required"
            });
        }

        // Check email
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "Email already exists"
            });
        }

        // Check employee ID
        const existingTeacher = await Teacher.findOne({
            employeeId
        });

        if (existingTeacher) {
            return res.status(400).json({
                message: "Employee ID already exists"
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create teacher login
        const user = await User.create({
            name: `${firstName} ${lastName}`,
            email,
            password: hashedPassword,
            role: "teacher"
        });

        // Create teacher profile
        const teacher = await Teacher.create({
            user: user._id,
            employeeId,
            firstName,
            lastName,
            phone,
            subjects: subjects || [],
            classes: classes || []
        });

        res.status(201).json({
            message: "Teacher created successfully",

            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            },

            teacher
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


// =====================================
// GET ALL TEACHERS
// =====================================
const getTeachers = async (req, res) => {
    try {
        const teachers = await Teacher.find()
            .populate("user", "name email role")
            .populate("subjects", "name code")
            .populate("classes", "name");

        res.status(200).json({
            count: teachers.length,
            teachers
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


// =====================================
// GET SINGLE TEACHER
// =====================================
const getTeacherById = async (req, res) => {
    try {
        const teacher = await Teacher.findById(req.params.id)
            .populate("user", "name email role")
            .populate("subjects", "name code")
            .populate("classes", "name");

        if (!teacher) {
            return res.status(404).json({
                message: "Teacher not found"
            });
        }

        res.status(200).json(teacher);

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


// =====================================
// UPDATE TEACHER
// =====================================
const updateTeacher = async (req, res) => {
    try {
        const teacher = await Teacher.findById(req.params.id);

        if (!teacher) {
            return res.status(404).json({
                message: "Teacher not found"
            });
        }

        const {
            firstName,
            lastName,
            employeeId,
            phone,
            subjects,
            classes,
            isActive
        } = req.body;

        teacher.firstName =
            firstName || teacher.firstName;

        teacher.lastName =
            lastName || teacher.lastName;

        teacher.employeeId =
            employeeId || teacher.employeeId;

        teacher.phone =
            phone !== undefined
                ? phone
                : teacher.phone;

        teacher.subjects =
            subjects || teacher.subjects;

        teacher.classes =
            classes || teacher.classes;

        teacher.isActive =
            isActive !== undefined
                ? isActive
                : teacher.isActive;

        await teacher.save();

        res.status(200).json({
            message: "Teacher updated successfully",
            teacher
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


// =====================================
// DELETE TEACHER
// =====================================
const deleteTeacher = async (req, res) => {
    try {
        const teacher = await Teacher.findById(req.params.id);

        if (!teacher) {
            return res.status(404).json({
                message: "Teacher not found"
            });
        }

        // Delete login account
        await User.findByIdAndDelete(teacher.user);

        // Delete teacher profile
        await teacher.deleteOne();

        res.status(200).json({
            message: "Teacher deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


module.exports = {
    createTeacher,
    getTeachers,
    getTeacherById,
    updateTeacher,
    deleteTeacher
};