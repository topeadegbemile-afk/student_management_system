const express = require("express");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const {
    createTeacher,
    getTeachers,
    getTeacherById,
    updateTeacher,
    deleteTeacher
} = require("../controllers/teacherController");

const router = express.Router();

// Admin only
router.post(
    "/",
    protect,
    authorize("admin"),
    createTeacher
);

router.get(
    "/",
    protect,
    authorize("admin"),
    getTeachers
);

router.get(
    "/:id",
    protect,
    authorize("admin"),
    getTeacherById
);

router.put(
    "/:id",
    protect,
    authorize("admin"),
    updateTeacher
);

router.delete(
    "/:id",
    protect,
    authorize("admin"),
    deleteTeacher
);

module.exports = router;