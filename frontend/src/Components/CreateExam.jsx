import React, { useState } from 'react';
import examService from '../services/examService';
import './CreateExam.css';

const CreateExam = ({ onExamCreated }) => {
    const [title, setTitle] = useState('');
    const [duration, setDuration] = useState(30); 
    const [questions, setQuestions] = useState([
        { questionText: '', options: ['', '', '', ''], correctAnswer: 0 },
    ]);
    const [message, setMessage] = useState('');

    const handleQuestionChange = (index, event) => {
        const newQuestions = [...questions];
        newQuestions[index].questionText = event.target.value;
        setQuestions(newQuestions);
    };

    const handleOptionChange = (qIndex, oIndex, event) => {
        const newQuestions = [...questions];
        newQuestions[qIndex].options[oIndex] = event.target.value;
        setQuestions(newQuestions);
    };

    const handleCorrectAnswerChange = (qIndex, event) => {
        const newQuestions = [...questions];
        newQuestions[qIndex].correctAnswer = parseInt(event.target.value, 10);
        setQuestions(newQuestions);
    };

    const addQuestion = () => {
        setQuestions([
            ...questions,
            { questionText: '', options: ['', '', '', ''], correctAnswer: 0 },
        ]);
    };

    const removeQuestion = (index) => {
        const newQuestions = questions.filter((_, qIndex) => qIndex !== index);
        setQuestions(newQuestions);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        try {
            const examData = { title, duration, questions };
            await examService.createExam(examData);
            setMessage('Exam created successfully!');
           
            setTitle('');
            setDuration(30);
            setQuestions([{ questionText: '', options: ['', '', '', ''], correctAnswer: 0 }]);
            
            if(onExamCreated) onExamCreated();
        } catch (error) {
            const errorMessage =
                (error.response?.data?.message) || error.message || 'Failed to create exam';
            setMessage(errorMessage);
        }
    };

    return (
        <div className="create-exam-container">
            <h2>Create New Exam</h2>
            {message && <p className="message">{message}</p>}
            <form onSubmit={handleSubmit} className="exam-form">
                <div className="form-group">
                    <label>Exam Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Duration (in minutes)</label>
                    <input
                        type="number"
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                        required
                        min="1"
                    />
                </div>

                <h3>Questions</h3>
                {questions.map((q, qIndex) => (
                    <div key={qIndex} className="question-card">
                        <h4>Question {qIndex + 1}</h4>
                        <textarea
                            placeholder="Enter question text"
                            value={q.questionText}
                            onChange={(e) => handleQuestionChange(qIndex, e)}
                            required
                        ></textarea>
                        {q.options.map((option, oIndex) => (
                            <div key={oIndex} className="option-input">
                                <input
                                    type="text"
                                    placeholder={`Option ${oIndex + 1}`}
                                    value={option}
                                    onChange={(e) => handleOptionChange(qIndex, oIndex, e)}
                                    required
                                />
                                <input
                                    type="radio"
                                    name={`correctAnswer_${qIndex}`}
                                    value={oIndex}
                                    checked={q.correctAnswer === oIndex}
                                    onChange={(e) => handleCorrectAnswerChange(qIndex, e)}
                                />
                                <label>Correct</label>
                            </div>
                        ))}
                        <button type="button" onClick={() => removeQuestion(qIndex)} className="remove-btn">
                            Remove Question
                        </button>
                    </div>
                ))}
                <div className="form-actions">
                    <button type="button" onClick={addQuestion} className="add-btn">
                        Add Another Question
                    </button>
                    <button type="submit" className="submit-btn">
                        Create Exam
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateExam;
