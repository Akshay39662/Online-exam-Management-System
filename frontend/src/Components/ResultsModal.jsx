import React from 'react';
import './ResultsModal.css';

const ResultsModal = ({ results, examTitle, onClose, isLoading }) => {
    return (
        <div className="modal-backdrop">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>Results for: {examTitle}</h2>
                    <button onClick={onClose} className="close-btn">&times;</button>
                </div>
                <div className="modal-body">
                    {isLoading ? (
                        <p>Loading results...</p>
                    ) : results.length === 0 ? (
                        <p>No students have taken this exam yet.</p>
                    ) : (
                        <table className="results-table">
                            <thead>
                                <tr>
                                    <th>Student Name</th>
                                    <th>Student Email</th>
                                    <th>Score</th>
                                    <th>Percentage</th>
                                </tr>
                            </thead>
                            <tbody>
                                {results.map(result => (
                                    <tr key={result._id}>
                                        <td>{result.student.name}</td>
                                        <td>{result.student.email}</td>
                                        <td>{result.score} / {result.totalMarks}</td>
                                        <td>{((result.score / result.totalMarks) * 100).toFixed(2)}%</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ResultsModal;
