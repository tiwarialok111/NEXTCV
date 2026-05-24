import express from 'express';
import { analyzeSkillGap } from '../controllers/skills.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect);

router.post('/gap', analyzeSkillGap);

export default router;
