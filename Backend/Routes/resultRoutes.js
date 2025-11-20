import express from 'express';
const router = express.Router();
import { getResultsByExam, checkExamStatus } from '../controllers/resultController.js';
import { protect, isTeacher, isStudent } from '../middleware/authMiddleware.js';

router.route('/:examId').get(protect, isTeacher, getResultsByExam);


router.route('/:examId/status').get(protect, isStudent, checkExamStatus);

export default router;

