import express from 'express';
import { generateSuggestions } from '../controllers/suggestions.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/generate', protect, generateSuggestions);

export default router;
