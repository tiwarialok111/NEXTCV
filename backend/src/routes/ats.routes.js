import express from 'express';
import { analyzeResume } from '../controllers/ats.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect);

router.post('/analyze', analyzeResume);

export default router;
