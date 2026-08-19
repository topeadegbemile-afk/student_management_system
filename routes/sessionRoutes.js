const express = require("express");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const {
    createSession,
    getSessions,
    activateSession
} = require("../controllers/sessionController");

const router = express.Router();

// Create session - ADMIN ONLY
router.post(
    "/",
    protect,
    authorize("admin"),
    createSession
);

// Get sessions - logged-in users
router.get(
    "/",
    protect,
    getSessions
);

// Activate session - ADMIN ONLY
router.put(
    "/:id/activate",
    protect,
    authorize("admin"),
    activateSession
);

module.exports = router;