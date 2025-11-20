import Result from '../models/resultModel.js';
import Exam from '../models/examModel.js';


export const getResultsByExam = async (req, res) => {
    try {
        const { examId } = req.params;
        const teacherId = req.user._id;

        const exam = await Exam.findById(examId);
        if (!exam) {
            return res.status(404).json({ message: 'Exam not found' });
        }
        if (exam.createdBy.toString() !== teacherId.toString()) {
            return res.status(403).json({ message: 'Not authorized to view results for this exam' });
        }

        const results = await Result.find({ exam: examId })
            .populate('student', 'name email')
            .populate('exam', 'title');

        res.status(200).json(results);
    } catch (error) {
        console.error('Error fetching results:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};


export const checkExamStatus = async (req, res) => {
    try {
        const { examId } = req.params;
        const studentId = req.user._id;

        const existingResult = await Result.findOne({ exam: examId, student: studentId });

        if (existingResult) {
            res.json({
                attempted: true,
                score: existingResult.score,
                totalMarks: existingResult.totalMarks
            });
        } else {
            res.json({ attempted: false });
        }
    } catch (error) {
        console.error('Error checking exam status:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

