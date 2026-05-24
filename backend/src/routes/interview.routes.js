import express from 'express';
import { generateQuestions, evaluateAnswer } from '../controllers/interview.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/generate', protect, generateQuestions);
router.post('/evaluate', protect, evaluateAnswer);

export default router;
