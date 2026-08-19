const express = require("express");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const {
    createResult,
    getResults,
    getResultById,
    updateResult,
    publishResult,
    deleteResult
} = require("../controllers/resultController");

const router = express.Router();

// Create result
router.post(
    "/",
    protect,
    authorize("admin", "teacher"),
    createResult
);

// Get all results
router.get(
    "/",
    protect,
    authorize("admin"),
    getResults
);

// Get single result
router.get(
    "/:id",
    protect,
    authorize("admin"),
    getResultById
);

// Update result
router.put(
    "/:id",
    protect,
    authorize("admin", "teacher"),
    updateResult
);

// Publish result
router.put(
    "/:id/publish",
    protect,
    authorize("admin"),
    publishResult
);

// Delete result
router.delete(
    "/:id",
    protect,
    authorize("admin"),
    deleteResult
);

module.exports = router;