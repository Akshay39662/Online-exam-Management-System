import api from './api';

const getResultsByExam = async (examId) => {
    const response = await api.get(`/api/results/${examId}`);
    return response.data;
};


const checkExamStatus = async (examId) => {
    const response = await api.get(`/api/results/${examId}/status`);
    return response.data;
};

const resultService = {
    getResultsByExam,
    checkExamStatus,
};

export default resultService;

