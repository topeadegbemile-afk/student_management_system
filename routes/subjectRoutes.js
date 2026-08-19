const express = require("express");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const {
    createSubject,
    getSubjects,
    updateSubject,
    deleteSubject
} = require("../controllers/subjectController");

const router = express.Router();

// Admin only
router.post(
    "/",
    protect,
    authorize("admin"),
    createSubject
);

// Logged-in users
router.get(
    "/",
    protect,
    getSubjects
);

// Admin only
router.put(
    "/:id",
    protect,
    authorize("admin"),
    updateSubject
);

// Admin only
router.delete(
    "/:id",
    protect,
    authorize("admin"),
    deleteSubject
);

module.exports = router;