const express = require("express");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const {
    createStudent,
    getStudents,
    getStudentById,
    updateStudent,
    deleteStudent
} = require("../controllers/studentController");

const router = express.Router();

router.post(
    "/",
    protect,
    authorize("admin"),
    createStudent
);

router.get(
    "/",
    protect,
    authorize("admin"),
    getStudents
);

router.get(
    "/:id",
    protect,
    authorize("admin"),
    getStudentById
);

router.put(
    "/:id",
    protect,
    authorize("admin"),
    updateStudent
);

router.delete(
    "/:id",
    protect,
    authorize("admin"),
    deleteStudent
);

module.exports = router;