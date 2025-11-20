import Exam from '../models/examModel.js';
import User from '../models/userModel.js';
import Result from '../models/resultModel.js';


export const createExam = async (req, res) => {
    try {
        const { title, duration, questions } = req.body;

        if (!title || !duration || !questions || questions.length === 0) {
            return res.status(400).json({ message: 'provide all req fields for exam' });
        }

        const exam = new Exam({
            title,
            duration,
            questions,
            createdBy: req.user._id,
            scheduledAt: new Date(),
        });

        const createdExam = await exam.save();
        res.status(201).json(createdExam);
    } catch (error) {
        console.error('Error in createExam:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};


export const getExamsByTeacher = async (req, res) => {
    try {
        const exams = await Exam.find({ createdBy: req.user._id });
        res.status(200).json(exams);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};


export const getAvailableExams = async (req, res) => {
    try {
        const exams = await Exam.find({}).populate('createdBy', 'name');
        res.status(200).json(exams);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};


export const getExamById = async (req, res) => {
    try {
        const exam = await Exam.findById(req.params.id).select('-questions.correctAnswer');

        if (!exam) {
            return res.status(404).json({ message: 'Exam not found' });
        }
        res.status(200).json(exam);
    } catch (error) {
        console.error('Error fetching exam by ID:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};


export const submitExam = async (req, res) => {
    try {
        const { answers } = req.body;
        const studentId = req.user._id;

        const exam = await Exam.findById(req.params.id);
        if (!exam) {
            return res.status(404).json({ message: 'Exam not found' });
        }

        let score = 0;
        const totalMarks = exam.questions.length;

        exam.questions.forEach((question) => {
            const questionId = question._id.toString();
            const studentAnswerIndex = parseInt(answers[questionId]);
            const correctAnswerIndex = parseInt(question.correctAnswer);

            if (studentAnswerIndex === correctAnswerIndex) {
                score++;
            }
        });

        const result = new Result({
            student: studentId,
            exam: req.params.id,
            score,
            totalMarks,
        });
        await result.save();

        res.status(200).json({
            message: 'Exam submitted successfully!',
            score,
            totalMarks,
        });

    } catch (error) {
        console.error('Error submitting exam:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

