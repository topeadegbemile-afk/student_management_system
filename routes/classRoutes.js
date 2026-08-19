const express = require("express");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const {
    createClass,
    getClasses,
    updateClass
} = require("../controllers/classController");

const router = express.Router();


// CREATE CLASS
router.post(
    "/",
    protect,
    authorize("admin"),
    createClass
);


// GET ALL CLASSES
router.get(
    "/",
    protect,
    getClasses
);


// UPDATE CLASS
router.put(
    "/:id",
    protect,
    authorize("admin"),
    updateClass
);


module.exports = router;