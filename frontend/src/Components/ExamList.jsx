import React from 'react';
import './ExamList.css';

const ExamList = ({ exams, onResultsClick }) => {
    if (!exams || exams.length === 0) {
        return <p className="no-exams-message">You have not created any exams yet.</p>;
    }

    return (
        <div className="exam-list-container">
            <h2>My Exams</h2>
            <ul className="exam-list">
                {exams.map((exam) => (
                    <li key={exam._id} className="exam-list-item">
                        <div className="exam-info">
                            <span className="exam-title">{exam.title}</span>
                            <span className="exam-details">
                                {exam.questions.length} Questions | {exam.duration} mins
                            </span>
                        </div>
                        <div className="exam-actions">
                            <button 
                                onClick={() => onResultsClick(exam._id, exam.title)} 
                                className="results-btn"
                            >
                                View Results
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ExamList;

