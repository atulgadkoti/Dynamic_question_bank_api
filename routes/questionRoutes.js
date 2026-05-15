const express = require("express");
const questions = require("../data/questions.json");
const { seenQuestions, studentStats } = require("../store/memoryStore");

const router = express.Router();

const levels = ["A", "B", "C"];

router.get("/questions", (req, res) => {

    const { skill, sub_skill, level, student_id, count } = req.query;

    if (!student_id) {
        return res.status(400).json({
            message: "student_id is required"
        });
    }

    if (!seenQuestions[student_id]) {
        seenQuestions[student_id] = new Set();
    }

    const skillQuestions = questions.filter((question) => {
        return (
            question.skill === skill &&
            question.sub_skill === sub_skill
        );
    });

    const unseenSkillQuestions = skillQuestions.filter((question) => {
        return !seenQuestions[student_id].has(question.id);
    });

    if (unseenSkillQuestions.length === 0) {
        return res.json({
            exhausted: true,
            message: "All questions seen. Generating adaptive question."
        });
    }

    const currentLevelIndex = levels.indexOf(level);

    let finalQuestions = [];

    let fallbackUsed = false;

    let fallbackReason = "";

    for (
        let i = currentLevelIndex;
        i < levels.length && finalQuestions.length < Number(count);
        i++
    ) {

        const currentLevel = levels[i];

        const levelQuestions = unseenSkillQuestions.filter((question) => {
            return question.level === currentLevel;
        });

        const remainingQuestionsNeeded =
            Number(count) - finalQuestions.length;

        const selectedQuestions =
            levelQuestions.slice(0, remainingQuestionsNeeded);

        finalQuestions = finalQuestions.concat(selectedQuestions);

        if (i > currentLevelIndex && selectedQuestions.length > 0) {

            fallbackUsed = true;

            fallbackReason =
                `Not enough unseen questions at level ${level}. ` +
                `Used level ${currentLevel} questions to complete count.`;
        }
    }

    const sanitizedQuestions = finalQuestions.map(({ answer, ...rest }) => rest);

    sanitizedQuestions.forEach((question) => {
        seenQuestions[student_id].add(question.id);
    });

    res.json({
        questions: sanitizedQuestions,
        served_count: sanitizedQuestions.length,
        fallback_used: fallbackUsed,
        fallback_reason: fallbackReason
    });

});

router.post("/questions/submit-answer", (req, res) => {

    const { student_id, question_id, selected_answer } = req.body;

    if (!student_id || !question_id) {
        return res.status(400).json({
            message: "student_id and question_id are required"
        });
    }

    const question = questions.find((q) => q.id === question_id);

    if (!question) {
        return res.status(404).json({
            message: "Question not found"
        });
    }

    const isCorrect = question.answer === selected_answer;

    if (!studentStats[student_id]) {
        studentStats[student_id] = {
            total_attempts: 0,
            correct_answers: 0,
            sub_skill_stats: {},
            trap_type_mistakes: {}
        };
    }

    const stats = studentStats[student_id];

    stats.total_attempts++;

    if (isCorrect) {
        stats.correct_answers++;
    }

    if (!stats.sub_skill_stats[question.sub_skill]) {
        stats.sub_skill_stats[question.sub_skill] = {
            attempts: 0,
            correct: 0
        };
    }

    stats.sub_skill_stats[question.sub_skill].attempts++;

    if (isCorrect) {
        stats.sub_skill_stats[question.sub_skill].correct++;
    }

    if (!isCorrect && question.trap_type) {

        if (!stats.trap_type_mistakes[question.trap_type]) {
            stats.trap_type_mistakes[question.trap_type] = 0;
        }

        stats.trap_type_mistakes[question.trap_type]++;
    }

    res.json({
        question_id,
        correct_answer: question.answer,
        selected_answer,
        is_correct: isCorrect
    });

});

router.get("/student/question-stats", (req, res) => {

    const { student_id } = req.query;

    if (!student_id) {
        return res.status(400).json({
            message: "student_id is required"
        });
    }

    const stats = studentStats[student_id];

    if (!stats) {
        return res.status(404).json({
            message: "No stats found for this student"
        });
    }

    const subSkillAccuracy = {};

    for (const subSkill in stats.sub_skill_stats) {

        const subSkillData = stats.sub_skill_stats[subSkill];

        const accuracy =
            (subSkillData.correct / subSkillData.attempts) * 100;

        subSkillAccuracy[subSkill] = {
            attempts: subSkillData.attempts,
            correct: subSkillData.correct,
            accuracy_percentage: accuracy.toFixed(2)
        };
    }

    res.json({
        student_id,

        total_attempts: stats.total_attempts,

        correct_answers: stats.correct_answers,

        overall_accuracy:
            (
                (stats.correct_answers / stats.total_attempts) * 100
            ).toFixed(2),

        sub_skill_accuracy: subSkillAccuracy,

        trap_type_mistakes: stats.trap_type_mistakes
    });

});

module.exports = router;