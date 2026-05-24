import express from 'express';
import { uploadResume, getResumes, getResume, deleteResume } from '../controllers/resume.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { upload } from '../middleware/upload.middleware.js';

const router = express.Router();

// Apply auth middleware to all routes
router.use(protect);

router.post('/upload', upload.single('resume'), uploadResume);
router.get('/', getResumes);
router.get('/:id', getResume);
router.delete('/:id', deleteResume);

export default router;
