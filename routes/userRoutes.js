const express = require("express");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const {
    getProfile,
    getAdminDashboard
} = require("../controllers/userController");

const router = express.Router();

// Any logged-in user
router.get("/profile", protect, getProfile);

// Admin only
router.get(
    "/admin-dashboard",
    protect,
    authorize("admin"),
    getAdminDashboard
);

module.exports = router;