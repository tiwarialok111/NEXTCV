import express from 'express';
import { getAnalysis } from '../controllers/analysis.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/:resumeId/:type', protect, getAnalysis);

export default router;
