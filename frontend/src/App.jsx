import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { initializeStorage } from './services/storage';
import ProtectedRoute from './components/common/ProtectedRoute';
import Layout from './components/common/Layout';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Clients from './pages/Clients';
import Guards from './pages/Guards';
import Equipment from './pages/Equipment';
import Attendance from './pages/Attendance';
import Salary from './pages/Salary';
import Chat from './pages/Chat';

function App() {
  useEffect(() => {
    initializeStorage();
  }, []);

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="clients" element={<Clients />} />
            <Route path="guards" element={<Guards />} />
            <Route path="equipment" element={<Equipment />} />
            <Route path="attendance" element={<Attendance />} />
            <Route path="salary" element={<Salary />} />
            <Route path="chat" element={<Chat />} />
          </Route>

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
