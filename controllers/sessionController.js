const Session = require("../models/Session");

// ===============================
// CREATE SESSION
// ===============================
const createSession = async (req, res) => {
    try {
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({
                message: "Session name is required"
            });
        }

        const existingSession = await Session.findOne({ name });

        if (existingSession) {
            return res.status(400).json({
                message: "Session already exists"
            });
        }

        const session = await Session.create({
            name
        });

        res.status(201).json({
            message: "Academic session created successfully",
            session
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


// ===============================
// GET ALL SESSIONS
// ===============================
const getSessions = async (req, res) => {
    try {
        const sessions = await Session.find()
            .sort({ createdAt: -1 });

        res.status(200).json({
            count: sessions.length,
            sessions
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


// ===============================
// ACTIVATE SESSION
// ===============================
const activateSession = async (req, res) => {
    try {
        const { id } = req.params;

        const session = await Session.findById(id);

        if (!session) {
            return res.status(404).json({
                message: "Session not found"
            });
        }

        // Deactivate all sessions
        await Session.updateMany(
            {},
            { isActive: false }
        );

        // Activate selected session
        session.isActive = true;

        await session.save();

        res.status(200).json({
            message: "Session activated successfully",
            session
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


module.exports = {
    createSession,
    getSessions,
    activateSession
};