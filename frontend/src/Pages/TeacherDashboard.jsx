import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import CreateExam from '../components/CreateExam';
import ExamList from '../components/ExamList';
import examService from '../services/examService';
import ResultsModal from '../components/ResultsModal';
import resultService from '../services/resultService';

const TeacherDashboard = () => {
    
    const [exams, setExams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [view, setView] = useState('list');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedExamTitle, setSelectedExamTitle] = useState('');
    const [results, setResults] = useState([]);
    const [resultsLoading, setResultsLoading] = useState(false);


    const fetchExams = async () => {
        
        try {
            setLoading(true);
            const data = await examService.getMyExams();
            setExams(data);
        } catch (err) {
            setError('Failed to load exams.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchExams();
    }, []);

    const onExamCreated = () => {
        
        fetchExams();
        setView('list');
    };

    const handleViewResults = async (examId, examTitle) => {

        console.log(`Frontend: Clicked 'View Results' for Exam ID: ${examId}, Title: ${examTitle}`);

        setSelectedExamTitle(examTitle);
        setIsModalOpen(true);
        setResultsLoading(true);
        try {
            const data = await resultService.getResultsByExam(examId);
            setResults(data);
        } catch (error) {
            console.error("Frontend Error: Failed to fetch results", error);
        } finally {
            setResultsLoading(false);
        }
    };

    const closeModal = () => {
        
        setIsModalOpen(false);
        setSelectedExamTitle('');
        setResults([]);
    };


    return (
        
        <div>
            <Header />
            <main>
                <div className="dashboard-controls">
                    <button onClick={() => setView('list')} className={view === 'list' ? 'active' : ''}>My Exams</button>
                    <button onClick={() => setView('create')} className={view === 'create' ? 'active' : ''}>Create New Exam</button>
                </div>

                {view === 'list' ? (
                    loading ? <p>Loading exams...</p> : error ? <p>{error}</p> : <ExamList exams={exams} onResultsClick={handleViewResults} />
                ) : (
                    <CreateExam onExamCreated={onExamCreated} />
                )}
            </main>

            {isModalOpen && (
                <ResultsModal
                    results={results}
                    examTitle={selectedExamTitle}
                    onClose={closeModal}
                    isLoading={resultsLoading}
                />
            )}
        </div>
    );
};

export default TeacherDashboard;

