// =====================================
// GET STUDENT PUBLISHED RESULTS
// =====================================

const getStudentResults = async (req, res) => {
    try {
        const { studentId } = req.params;

        // Find published results for this student
        const results = await Result.find({
            student: studentId,
            isPublished: true
        })
            .populate(
                "student",
                "firstName lastName admissionNumber"
            )
            .populate(
                "subject",
                "name code"
            )
            .populate(
                "class",
                "name"
            )
            .populate(
                "session",
                "name"
            )
            .sort({
                session: -1,
                term: 1
            });

        if (!results || results.length === 0) {
            return res.status(404).json({
                message: "No published results found for this student"
            });
        }

        res.status(200).json({
            count: results.length,
            student: results[0].student,
            results
        });

    } catch (error) {
        console.error(
            "Get student results error:",
            error
        );

        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};