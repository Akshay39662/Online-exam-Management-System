import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import resultService from '../services/resultService';
import './AvailableExamList.css';

const AvailableExamList = ({ exams }) => {
    const navigate = useNavigate();
    const [attemptedStatus, setAttemptedStatus] = useState({});
    const [loadingStatus, setLoadingStatus] = useState(true);

    useEffect(() => {
        const checkStatuses = async () => {
            if (exams.length === 0) {
                setLoadingStatus(false);
                return;
            }

            setLoadingStatus(true);
            const statuses = {};
            const statusPromises = exams.map(async (exam) => {
                try {
                    const status = await resultService.checkExamStatus(exam._id);
                    statuses[exam._id] = status;
                } catch (error) {
                    console.error(`Failed to check status for exam ${exam._id}`, error);
                    statuses[exam._id] = { attempted: false }; 
                }
            });

            await Promise.all(statusPromises);
            setAttemptedStatus(statuses);
            setLoadingStatus(false);
        };

        checkStatuses();
    }, [exams]);


    if (!exams || exams.length === 0) {
        return <p>No exams are available at the moment.</p>;
    }

    return (
        <div className="available-exams-container">
            <h2>Available Exams</h2>
            <div className="exam-card-grid">
                {exams.map((exam) => {
                    const status = attemptedStatus[exam._id];
                    const isAttempted = status && status.attempted;

                    return (
                        <div key={exam._id} className={`exam-card ${isAttempted ? 'attempted' : ''}`}>
                            <h3>{exam.title}</h3>
                            <p className="teacher-name">Created by: {exam.createdBy.name}</p>
                            <div className="exam-meta">
                                <span>{exam.questions.length} Questions</span>
                                <span>{exam.duration} minutes</span>
                            </div>
                            {loadingStatus ? (
                                <div className="status-loader">Checking status...</div>
                            ) : isAttempted ? (
                                <div className="attempted-info">
                                    <p>Completed</p>
                                    <span>Score: {status.score}/{status.totalMarks}</span>
                                </div>
                            ) : (
                                <button className="start-exam-btn" onClick={() => navigate(`/exam/${exam._id}`)}>
                                    Start Exam
                                </button>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default AvailableExamList;

