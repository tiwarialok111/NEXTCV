import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { errorHandler } from './middleware/error.middleware.js';

// Route imports will go here
import authRoutes from './routes/auth.routes.js';
import resumeRoutes from './routes/resume.routes.js';
import atsRoutes from './routes/ats.routes.js';
import skillsRoutes from './routes/skills.routes.js';
import interviewRoutes from './routes/interview.routes.js';
import coverLetterRoutes from './routes/coverLetter.routes.js';
import jobMatchRoutes from './routes/jobMatch.routes.js';
import suggestionsRoutes from './routes/suggestions.routes.js';
import analysisRoutes from './routes/analysis.routes.js';

const app = express();

// Security Middleware
app.use(helmet());

// CORS Configuration
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));

// Body Parsing Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Static folder for uploads
app.use('/uploads', express.static('uploads'));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/ats', atsRoutes);
app.use('/api/skills', skillsRoutes);
app.use('/api/interview', interviewRoutes);
app.use('/api/cover-letter', coverLetterRoutes);
app.use('/api/job-match', jobMatchRoutes);
app.use('/api/suggestions', suggestionsRoutes);
app.use('/api/analysis', analysisRoutes);

// Base route
app.get('/', (req, res) => {
  res.send('AI Resume Analyzer API is running');
});

// Error Handling Middleware
app.use(errorHandler);

export default app;
