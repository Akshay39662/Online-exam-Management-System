import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import examService from '../services/examService';
import './ExamPage.css';

const ExamPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [exam, setExam] = useState(null);
    const [loading, setLoading] = useState(true);
    const [answers, setAnswers] = useState({});
    const [timeLeft, setTimeLeft] = useState(null);
    const [score, setScore] = useState(null);
    const [submitted, setSubmitted] = useState(false);

    const [examStarted, setExamStarted] = useState(false);
    const hasSubmittedRef = useRef(false);

    
    const triggerViolation = () => {
        if (hasSubmittedRef.current || !examStarted) return;
        
        alert('Violation detected. Exiting fullscreen or switching tabs is not allowed. Your exam will be submitted with a score of 0.');
        forceSubmit(0);
    };

 
    const handleStartExam = async () => {
        try {
            await document.documentElement.requestFullscreen();
            setExamStarted(true); 
        } catch (err) {
            console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
            alert("Fullscreen is required to take the exam. Please allow fullscreen to start.");
        }
    };

    
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden) {
                triggerViolation();
            }
        };

        const handleFullscreenChange = () => {
           
            if (examStarted && !document.fullscreenElement) {
                triggerViolation();
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        document.addEventListener('fullscreenchange', handleFullscreenChange);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
        };
    }, [examStarted]); 



    
    useEffect(() => {
        const fetchExam = async () => {
            try {
                const data = await examService.getExamById(id);
                setExam(data);
                setTimeLeft(data.duration * 60);
            } catch (error) {
                console.error("Failed to load exam", error);
            } finally {
                setLoading(false);
            }
        };
        fetchExam();
    }, [id]);


    useEffect(() => {
        if (!examStarted || timeLeft === null || submitted) return;
        if (timeLeft <= 0) {
            handleSubmit();
            return;
        }
        const timer = setInterval(() => {
            setTimeLeft((prevTime) => prevTime - 1);
        }, 1000);
        return () => clearInterval(timer);
    }, [timeLeft, submitted, examStarted]);


    const handleAnswerChange = (questionId, optionIndex) => {
        setAnswers({
            ...answers,
            [questionId]: optionIndex,
        });
    };

    const handleSubmit = async () => {
        if (hasSubmittedRef.current) return;
        hasSubmittedRef.current = true;
        
        try {
            const result = await examService.submitExam(id, answers);
            setScore(result);
            setSubmitted(true);
             if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        } catch (error) {
            console.error('Error submitting exam:', error);
        }
    };
    

    const forceSubmit = async (forcedScore) => {
        if (hasSubmittedRef.current) return;
        console.log('Forcing submission...');
        hasSubmittedRef.current = true;
        
         try {
            const result = await examService.submitExam(id, {});
            setScore({ score: forcedScore, totalMarks: result.totalMarks });
            setSubmitted(true);
             if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        } catch (error) {
            console.error('Error during forced submission:', error);
        }
    };


    if (loading) return <div>Loading exam...</div>;
    if (!exam) return <div>Exam not found.</div>;

    if (!examStarted) {
        return (
            <div className="exam-container result-container">
                <h2>{exam.title}</h2>
                <p style={{ margin: '1rem 0' }}>Duration: {exam.duration} minutes</p>
                <p style={{ marginBottom: '2rem' }}>Click the button below to start the exam in fullscreen mode.</p>
                <button onClick={handleStartExam} className="submit-btn">Start Exam</button>
            </div>
        );
    }
    
    if (submitted) {
        return (
            <div className="exam-container result-container">
                <h2>Exam Submitted!</h2>
                <p className="final-score">
                    Your Score: {score.score} / {score.totalMarks}
                </p>
                <button onClick={() => navigate('/student/dashboard')} className="back-btn">
                    Back to Dashboard
                </button>
            </div>
        );
    }
    
    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="exam-container">
            <div className="exam-header">
                <h1>{exam.title}</h1>
                <div className="timer">Time Left: {formatTime(timeLeft)}</div>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
                {exam.questions.map((q, index) => (
                    <div key={q._id} className="question-card">
                        <h3>Question {index + 1}</h3>
                        <p className="question-text">{q.questionText}</p>
                        <div className="options-container">
                            {q.options.map((option, i) => (
                                <label key={i} className="option-label">
                                    <input
                                        type="radio"
                                        name={q._id}
                                        value={i}
                                        onChange={() => handleAnswerChange(q._id, i)}
                                        checked={answers[q._id] === i}
                                    />
                                    {option}
                                </label>
                            ))}
                        </div>
                    </div>
                ))}
                <button type="submit" className="submit-btn">Submit Exam</button>
            </form>
        </div>
    );
};

export default ExamPage;

