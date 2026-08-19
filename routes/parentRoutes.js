const express = require("express");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const {
    createParent,
    getParents,
    getParentById,
    updateParent,
    deleteParent
} = require("../controllers/parentController");

const router = express.Router();

// Admin only
router.post(
    "/",
    protect,
    authorize("admin"),
    createParent
);

// Admin only
router.get(
    "/",
    protect,
    authorize("admin"),
    getParents
);

// Admin only
router.get(
    "/:id",
    protect,
    authorize("admin"),
    getParentById
);

// Admin only
router.put(
    "/:id",
    protect,
    authorize("admin"),
    updateParent
);

// Admin only
router.delete(
    "/:id",
    protect,
    authorize("admin"),
    deleteParent
);

module.exports = router;