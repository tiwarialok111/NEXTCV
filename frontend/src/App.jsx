import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { DashboardLayout } from './layouts/DashboardLayout';

import { Dashboard } from './pages/Dashboard';
import { ResumeUpload } from './pages/ResumeUpload';
import { ATSAnalyzer } from './pages/ATSAnalyzer';
import { SkillGap } from './pages/SkillGap';
import { JobMatch } from './pages/JobMatch';
import { AISuggestions } from './pages/AISuggestions';
import { History } from './pages/History';
import { InterviewPrep } from './pages/InterviewPrep';
import { CoverLetter } from './pages/CoverLetter';
import { Settings } from './pages/Settings';
import { Login } from './pages/Login';
import { Register } from './pages/Register';

import { ThemeProvider } from './context/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<DashboardLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="upload" element={<ResumeUpload />} />
                <Route path="ats-analyzer" element={<ATSAnalyzer />} />
                <Route path="skill-gap" element={<SkillGap />} />
                <Route path="job-match" element={<JobMatch />} />
                <Route path="ai-suggestions" element={<AISuggestions />} />
                <Route path="history" element={<History />} />
                <Route path="interview" element={<InterviewPrep />} />
                <Route path="cover-letter" element={<CoverLetter />} />
                <Route path="settings" element={<Settings />} />
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
