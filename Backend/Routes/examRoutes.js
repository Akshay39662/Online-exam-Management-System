import express from 'express';
const router = express.Router();
import {
    createExam,
    getExamsByTeacher,
    getAvailableExams,
    getExamById,      
    submitExam,       
} from '../controllers/examController.js';
import { protect, isTeacher, isStudent } from '../middleware/authMiddleware.js';


router
    .route('/')
    .post(protect, isTeacher, createExam)
    .get(protect, isTeacher, getExamsByTeacher);


router.route('/available').get(protect, isStudent, getAvailableExams);


router.route('/:id').get(protect, isStudent, getExamById);


router.route('/:id/submit').post(protect, isStudent, submitExam);

export default router;

