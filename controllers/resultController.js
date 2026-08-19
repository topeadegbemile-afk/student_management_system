const Result = require("../models/Result");
const Student = require("../models/Student");
const Subject = require("../models/Subject");
const Class = require("../models/Class");
const Session = require("../models/Session");


// =====================================
// HELPER FUNCTION
// CALCULATE GRADE AND REMARK
// =====================================

const calculateResult = (caScore, examScore) => {

    const totalScore =
        Number(caScore) + Number(examScore);

    let grade;
    let remark;

    if (totalScore >= 70) {
        grade = "A";
        remark = "Excellent";
    } else if (totalScore >= 60) {
        grade = "B";
        remark = "Very Good";
    } else if (totalScore >= 50) {
        grade = "C";
        remark = "Good";
    } else if (totalScore >= 45) {
        grade = "D";
        remark = "Fair";
    } else if (totalScore >= 40) {
        grade = "E";
        remark = "Pass";
    } else {
        grade = "F";
        remark = "Fail";
    }

    return {
        totalScore,
        grade,
        remark
    };
};


// =====================================
// CREATE RESULT
// =====================================

const createResult = async (req, res) => {

    try {

        const {
            student,
            class: classId,
            subject,
            session,
            term,
            caScore,
            examScore,
            teacherComment
        } = req.body;


        // =====================================
        // REQUIRED FIELDS
        // =====================================

        if (
            !student ||
            !classId ||
            !subject ||
            !session ||
            !term
        ) {
            return res.status(400).json({
                message: "Please provide all required fields"
            });
        }


        // =====================================
        // VALIDATE CA
        // =====================================

        if (
            caScore === undefined ||
            caScore === null ||
            Number(caScore) < 0 ||
            Number(caScore) > 30
        ) {
            return res.status(400).json({
                message: "CA score must be between 0 and 30"
            });
        }


        // =====================================
        // VALIDATE EXAM
        // =====================================

        if (
            examScore === undefined ||
            examScore === null ||
            Number(examScore) < 0 ||
            Number(examScore) > 70
        ) {
            return res.status(400).json({
                message: "Exam score must be between 0 and 70"
            });
        }


        // =====================================
        // CHECK STUDENT
        // =====================================

        const existingStudent =
            await Student.findById(student);

        if (!existingStudent) {

            return res.status(404).json({
                message: "Student not found"
            });

        }


        // =====================================
        // CHECK SUBJECT
        // =====================================

        const existingSubject =
            await Subject.findById(subject);

        if (!existingSubject) {

            return res.status(404).json({
                message: "Subject not found"
            });

        }


        // =====================================
        // CHECK CLASS
        // =====================================

        const existingClass =
            await Class.findById(classId);

        if (!existingClass) {

            return res.status(404).json({
                message: "Class not found"
            });

        }


        // =====================================
        // CHECK SESSION
        // =====================================

        const existingSession =
            await Session.findById(session);

        if (!existingSession) {

            return res.status(404).json({
                message: "Academic session not found"
            });

        }


        // =====================================
        // CHECK STUDENT CLASS
        // =====================================

        if (
            existingStudent.class &&
            existingStudent.class.toString() !==
            classId.toString()
        ) {

            return res.status(400).json({
                message:
                    "Student does not belong to this class"
            });

        }


        // =====================================
        // CHECK DUPLICATE RESULT
        // =====================================

        const duplicate =
            await Result.findOne({
                student,
                subject,
                session,
                term
            });

        if (duplicate) {

            return res.status(400).json({
                message:
                    "Result already exists for this student, subject, session and term"
            });

        }


        // =====================================
        // CALCULATE RESULT
        // =====================================

        const calculatedResult =
            calculateResult(
                caScore,
                examScore
            );


        // =====================================
        // CREATE RESULT
        // =====================================

        const result = await Result.create({

            student,

            class: classId,

            subject,

            session,

            term,

            caScore: Number(caScore),

            examScore: Number(examScore),

            totalScore:
                calculatedResult.totalScore,

            grade:
                calculatedResult.grade,

            remark:
                calculatedResult.remark,

            teacherComment:
                teacherComment || "",

            isPublished: false
        });


        // =====================================
        // SUCCESS RESPONSE
        // =====================================

        res.status(201).json({

            message:
                "Result created successfully",

            result

        });


    } catch (error) {

        console.error(
            "Create result error:",
            error
        );


        // Duplicate MongoDB index
        if (error.code === 11000) {

            return res.status(400).json({

                message:
                    "Result already exists for this student, subject, session and term"

            });

        }


        res.status(500).json({

            message:
                "Server error",

            error:
                error.message

        });

    }

};


// =====================================
// GET ALL RESULTS
// =====================================

const getResults = async (req, res) => {

    try {

        const results = await Result.find()

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
            );


        res.status(200).json({

            count:
                results.length,

            results

        });


    } catch (error) {

        console.error(
            "Get results error:",
            error
        );


        res.status(500).json({

            message:
                "Server error",

            error:
                error.message

        });

    }

};


// =====================================
// GET SINGLE RESULT
// =====================================

const getResultById = async (req, res) => {

    try {

        const result =
            await Result.findById(
                req.params.id
            )

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
            );


        if (!result) {

            return res.status(404).json({

                message:
                    "Result not found"

            });

        }


        res.status(200).json(result);


    } catch (error) {

        console.error(
            "Get result error:",
            error
        );


        res.status(500).json({

            message:
                "Server error",

            error:
                error.message

        });

    }

};


// =====================================
// UPDATE RESULT
// =====================================

const updateResult = async (req, res) => {

    try {

        const result =
            await Result.findById(
                req.params.id
            );


        if (!result) {

            return res.status(404).json({

                message:
                    "Result not found"

            });

        }


        // =====================================
        // PREVENT EDITING PUBLISHED RESULT
        // =====================================

        if (result.isPublished) {

            return res.status(400).json({

                message:
                    "Published results cannot be edited"

            });

        }


        const {
            caScore,
            examScore,
            teacherComment
        } = req.body;


        // =====================================
        // VALIDATE CA
        // =====================================

        if (
            caScore !== undefined &&
            (
                Number(caScore) < 0 ||
                Number(caScore) > 30
            )
        ) {

            return res.status(400).json({

                message:
                    "CA score must be between 0 and 30"

            });

        }


        // =====================================
        // VALIDATE EXAM
        // =====================================

        if (
            examScore !== undefined &&
            (
                Number(examScore) < 0 ||
                Number(examScore) > 70
            )
        ) {

            return res.status(400).json({

                message:
                    "Exam score must be between 0 and 70"

            });

        }


        // =====================================
        // UPDATE SCORES
        // =====================================

        if (caScore !== undefined) {

            result.caScore =
                Number(caScore);

        }


        if (examScore !== undefined) {

            result.examScore =
                Number(examScore);

        }


        if (teacherComment !== undefined) {

            result.teacherComment =
                teacherComment;

        }


        // =====================================
        // RECALCULATE RESULT
        // =====================================

        const calculatedResult =
            calculateResult(
                result.caScore,
                result.examScore
            );


        result.totalScore =
            calculatedResult.totalScore;

        result.grade =
            calculatedResult.grade;

        result.remark =
            calculatedResult.remark;


        await result.save();


        res.status(200).json({

            message:
                "Result updated successfully",

            result

        });


    } catch (error) {

        console.error(
            "Update result error:",
            error
        );


        res.status(500).json({

            message:
                "Server error",

            error:
                error.message

        });

    }

};


// =====================================
// PUBLISH RESULT
// =====================================

const publishResult = async (req, res) => {

    try {

        const result =
            await Result.findById(
                req.params.id
            );


        if (!result) {

            return res.status(404).json({

                message:
                    "Result not found"

            });

        }


        if (result.isPublished) {

            return res.status(400).json({

                message:
                    "Result is already published"

            });

        }


        result.isPublished = true;


        await result.save();


        res.status(200).json({

            message:
                "Result published successfully",

            result

        });


    } catch (error) {

        console.error(
            "Publish result error:",
            error
        );


        res.status(500).json({

            message:
                "Server error",

            error:
                error.message

        });

    }

};


// =====================================
// DELETE RESULT
// =====================================

const deleteResult = async (req, res) => {

    try {

        const result =
            await Result.findById(
                req.params.id
            );


        if (!result) {

            return res.status(404).json({

                message:
                    "Result not found"

            });

        }


        // Published results cannot be deleted
        if (result.isPublished) {

            return res.status(400).json({

                message:
                    "Published results cannot be deleted"

            });

        }


        await result.deleteOne();


        res.status(200).json({

            message:
                "Result deleted successfully"

        });


    } catch (error) {

        console.error(
            "Delete result error:",
            error
        );


        res.status(500).json({

            message:
                "Server error",

            error:
                error.message

        });

    }

};


// =====================================
// EXPORT CONTROLLERS
// =====================================

module.exports = {

    createResult,

    getResults,

    getResultById,

    updateResult,

    publishResult,

    deleteResult

};