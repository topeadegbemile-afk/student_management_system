const getProfile = async (req, res) => {
    res.status(200).json({
        message: "You are authorized to access this route.",
        user: req.user
    });
};

const getAdminDashboard = async (req, res) => {
    res.status(200).json({
        message: "Welcome to the Admin Dashboard.",
        user: req.user
    });
};

module.exports = {
    getProfile,
    getAdminDashboard
};