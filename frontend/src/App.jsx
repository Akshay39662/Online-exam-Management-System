import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import TeacherDashboard from './pages/TeacherDashboard';
import StudentDashboard from './pages/StudentDashboard';
import ExamPage from './pages/ExamPage'; 
import TeacherRoute from './components/TeacherRoute';
import StudentRoute from './components/StudentRoute';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        

        <Route element={<TeacherRoute />}>
          <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
        </Route>
        
        
        <Route element={<StudentRoute />}>
          <Route path="/student/dashboard" element={<StudentDashboard />} />
          <Route path="/student/exam/:id" element={<ExamPage />} /> 
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;

