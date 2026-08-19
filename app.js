const express = require("express");
const cors = require("cors");

const teacherRoutes = require("./routes/teacherRoutes");
const parentRoutes = require("./routes/parentRoutes");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const sessionRoutes = require("./routes/sessionRoutes");
const classRoutes = require("./routes/classRoutes");
const studentRoutes = require("./routes/studentRoutes");
const resultRoutes = require("./routes/resultRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());



// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/classes", classRoutes);
app.use("/api/parents", parentRoutes); // Use the correct route for parents
app.use("/api/teachers", teacherRoutes); // Use the correct route for teachers
app.use("/api/students", studentRoutes);
app.use("/api/results", resultRoutes); // Use the correct route for results




// Test route
app.get("/", (req, res) => {
    res.json({
        message: "School Management System API is running"
    });
});

module.exports = app;