import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import AvailableExamList from '../components/AvailableExamList';
import examService from '../services/examService';

const StudentDashboard = () => {
    const [exams, setExams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchExams = async () => {
            try {
                const data = await examService.getAvailableExams();
                setExams(data);
            } catch (err) {
                setError('Failed to load exams. Please try again later.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchExams();
    }, []);

    return (
        <div>
            <Header />
            <main>
                {loading && <p>Loading exams...</p>}
                {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
                {!loading && !error && <AvailableExamList exams={exams} />}
            </main>
        </div>
    );
};

export default StudentDashboard;