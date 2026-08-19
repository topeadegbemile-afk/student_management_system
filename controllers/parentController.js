const Parent = require("../models/Parent");
const User = require("../models/User");
const Student = require("../models/Student");
const bcrypt = require("bcryptjs");

// =====================================
// CREATE PARENT
// =====================================
const createParent = async (req, res) => {
    try {
        const {
            name,
            email,
            password,
            phone,
            address,
            occupation
        } = req.body;

        // Check required fields
        if (!name || !email || !password || !phone) {
            return res.status(400).json({
                message: "Name, email, password and phone are required"
            });
        }

        // Check if email already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "Email already exists"
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create parent login account
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: "parent"
        });

        // Create parent profile
        const parent = await Parent.create({
            user: user._id,
            phone,
            address,
            occupation,
            children: []
        });

        res.status(201).json({
            message: "Parent created successfully",

            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            },

            parent
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


// =====================================
// GET ALL PARENTS
// =====================================
const getParents = async (req, res) => {
    try {
        const parents = await Parent.find()
            .populate("user", "name email role")
            .populate(
                "children",
                "firstName lastName admissionNumber"
            );

        res.status(200).json({
            count: parents.length,
            parents
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


// =====================================
// GET SINGLE PARENT
// =====================================
const getParentById = async (req, res) => {
    try {
        const parent = await Parent.findById(req.params.id)
            .populate("user", "name email role")
            .populate(
                "children",
                "firstName lastName admissionNumber"
            );

        if (!parent) {
            return res.status(404).json({
                message: "Parent not found"
            });
        }

        res.status(200).json(parent);

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


// =====================================
// UPDATE PARENT
// =====================================
const updateParent = async (req, res) => {
    try {
        const parent = await Parent.findById(req.params.id);

        if (!parent) {
            return res.status(404).json({
                message: "Parent not found"
            });
        }

        const {
            phone,
            address,
            occupation,
            isActive
        } = req.body;

        parent.phone =
            phone !== undefined
                ? phone
                : parent.phone;

        parent.address =
            address !== undefined
                ? address
                : parent.address;

        parent.occupation =
            occupation !== undefined
                ? occupation
                : parent.occupation;

        parent.isActive =
            isActive !== undefined
                ? isActive
                : parent.isActive;

        await parent.save();

        res.status(200).json({
            message: "Parent updated successfully",
            parent
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


// =====================================
// DELETE PARENT
// =====================================
const deleteParent = async (req, res) => {
    try {
        const parent = await Parent.findById(req.params.id);

        if (!parent) {
            return res.status(404).json({
                message: "Parent not found"
            });
        }

        // Delete parent login account
        await User.findByIdAndDelete(parent.user);

        // Delete parent profile
        await parent.deleteOne();

        res.status(200).json({
            message: "Parent deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


module.exports = {
    createParent,
    getParents,
    getParentById,
    updateParent,
    deleteParent
};