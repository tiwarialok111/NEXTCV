import express from 'express';
import { generateCoverLetter } from '../controllers/coverLetter.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect);

router.post('/generate', generateCoverLetter);

export default router;
