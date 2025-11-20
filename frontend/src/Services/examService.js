import api from './api';

const createExam = async (examData) => {
    const response = await api.post('/api/exams', examData);
    return response.data;
};

const getMyExams = async () => {
    const response = await api.get('/api/exams');
    return response.data;
};

const getAvailableExams = async () => {
    const response = await api.get('/api/exams/available');
    return response.data;
};

const getExamById = async (examId) => {
    const response = await api.get(`/api/exams/${examId}`);
    return response.data;
};

const submitExam = async (examId, answers) => {
    const response = await api.post(`/api/exams/${examId}/submit`, { answers });
    return response.data;
};

const examService = {
    createExam,
    getMyExams,
    getAvailableExams,
    getExamById,
    submitExam,
};

export default examService;

