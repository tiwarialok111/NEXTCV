import express from 'express';
import { analyzeJobMatch } from '../controllers/jobMatch.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect);

router.post('/analyze', analyzeJobMatch);

export default router;
