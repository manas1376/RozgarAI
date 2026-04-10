import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import AppLayout from './components/layout/AppLayout';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import ResumeBuilderPage from './pages/ResumeBuilderPage';
import JobFinderPage from './pages/JobFinderPage';
import AutoApplyPage from './pages/AutoApplyPage';
import TrackerPage from './pages/TrackerPage';
import NotificationsPage from './pages/NotificationsPage';
import SkillGapPage from './pages/SkillGapPage';

function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}

function PublicRoute({ children }) {
  const { user } = useAuth();
  return user ? <Navigate to="/dashboard" replace /> : children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
      <Route path="/signup" element={<PublicRoute><SignupPage /></PublicRoute>} />
      <Route path="/forgot-password" element={<PublicRoute><ForgotPasswordPage /></PublicRoute>} />
      <Route path="/" element={<PrivateRoute><AppLayout /></PrivateRoute>}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="resume" element={<ResumeBuilderPage />} />
        <Route path="jobs" element={<JobFinderPage />} />
        <Route path="apply" element={<AutoApplyPage />} />
        <Route path="tracker" element={<TrackerPage />} />
        <Route path="notifications" element={<NotificationsPage />} />
        <Route path="skills" element={<SkillGapPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
