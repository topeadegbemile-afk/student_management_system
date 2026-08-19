const Student = require("../models/Student");
const User = require("../models/User");
const Parent = require("../models/Parent");
const bcrypt = require("bcryptjs");

// =====================================
// CREATE STUDENT
// =====================================
const createStudent = async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            middleName,
            email,
            password,
            admissionNumber,
            gender,
            dateOfBirth,
            class: classId,
            parent,
            address,
            phone
        } = req.body;

        // Required fields
        if (
            !firstName ||
            !lastName ||
            !email ||
            !password ||
            !admissionNumber ||
            !gender ||
            !classId ||
            !parent
        ) {
            return res.status(400).json({
                message: "Please provide all required fields"
            });
        }

        // Check email
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "Email already exists"
            });
        }

        // Check admission number
        const existingStudent = await Student.findOne({
            admissionNumber
        });

        if (existingStudent) {
            return res.status(400).json({
                message: "Admission number already exists"
            });
        }

        // Check parent
        const existingParent = await Parent.findById(parent);

        if (!existingParent) {
            return res.status(404).json({
                message: "Parent not found"
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user account
        const user = await User.create({
            name: `${firstName} ${lastName}`,
            email,
            password: hashedPassword,
            role: "student"
        });

        try {
            // Create student profile
            const student = await Student.create({
                user: user._id,
                firstName,
                lastName,
                middleName,
                admissionNumber,
                gender,
                dateOfBirth,
                class: classId,
                parent: existingParent._id,
                address,
                phone
            });

            // Add student to parent's children
            existingParent.children.push(student._id);

            await existingParent.save();

            res.status(201).json({
                message: "Student created successfully",

                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                },

                student
            });

        } catch (studentError) {
            // If student creation fails,
            // remove the user account we just created
            await User.findByIdAndDelete(user._id);

            throw studentError;
        }

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


// =====================================
// GET ALL STUDENTS
// =====================================
const getStudents = async (req, res) => {
    try {
        const students = await Student.find()
            .populate("user", "name email role")
            .populate("class", "name")
            .populate(
                "parent",
                "user phone address occupation"
            );

        res.status(200).json({
            count: students.length,
            students
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


// =====================================
// GET SINGLE STUDENT
// =====================================
const getStudentById = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id)
            .populate("user", "name email role")
            .populate("class", "name")
            .populate(
                "parent",
                "user phone address occupation"
            );

        if (!student) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        res.status(200).json(student);

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


// =====================================
// UPDATE STUDENT
// =====================================
const updateStudent = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);

        if (!student) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        const {
            firstName,
            lastName,
            middleName,
            admissionNumber,
            gender,
            dateOfBirth,
            class: classId,
            parent,
            address,
            phone,
            isActive
        } = req.body;

        // If parent is being changed
        if (
            parent &&
            parent.toString() !== student.parent.toString()
        ) {
            const newParent = await Parent.findById(parent);

            if (!newParent) {
                return res.status(404).json({
                    message: "New parent not found"
                });
            }

            // Remove student from old parent
            await Parent.findByIdAndUpdate(
                student.parent,
                {
                    $pull: {
                        children: student._id
                    }
                }
            );

            // Add student to new parent
            await Parent.findByIdAndUpdate(
                parent,
                {
                    $addToSet: {
                        children: student._id
                    }
                }
            );

            student.parent = parent;
        }

        student.firstName =
            firstName || student.firstName;

        student.lastName =
            lastName || student.lastName;

        student.middleName =
            middleName !== undefined
                ? middleName
                : student.middleName;

        student.admissionNumber =
            admissionNumber || student.admissionNumber;

        student.gender =
            gender || student.gender;

        student.dateOfBirth =
            dateOfBirth || student.dateOfBirth;

        student.class =
            classId || student.class;

        student.address =
            address !== undefined
                ? address
                : student.address;

        student.phone =
            phone !== undefined
                ? phone
                : student.phone;

        student.isActive =
            isActive !== undefined
                ? isActive
                : student.isActive;

        await student.save();

        res.status(200).json({
            message: "Student updated successfully",
            student
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


// =====================================
// DELETE STUDENT
// =====================================
const deleteStudent = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);

        if (!student) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        // Remove student from parent's children
        await Parent.findByIdAndUpdate(
            student.parent,
            {
                $pull: {
                    children: student._id
                }
            }
        );

        // Delete student login account
        await User.findByIdAndDelete(student.user);

        // Delete student profile
        await student.deleteOne();

        res.status(200).json({
            message: "Student deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


module.exports = {
    createStudent,
    getStudents,
    getStudentById,
    updateStudent,
    deleteStudent
};