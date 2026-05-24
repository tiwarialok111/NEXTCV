import { asyncHandler } from '../utils/asyncHandler.js';
import Resume from '../models/Resume.js';
import Analysis from '../models/Analysis.js';
import { parseAIJSON } from '../services/ai.service.js';

// @desc    Generate AI suggestions for resume
// @route   POST /api/suggestions/generate
// @access  Private
export const generateSuggestions = asyncHandler(async (req, res, next) => {
  const { resumeId } = req.body;

  if (!resumeId) {
    return res.status(400).json({ success: false, message: 'Please provide a resumeId' });
  }

  const resume = await Resume.findById(resumeId);

  if (!resume || resume.userId.toString() !== req.user.id) {
    return res.status(404).json({ success: false, message: 'Resume not found or unauthorized' });
  }

  const prompt = `
  You are an expert resume writer and career coach.
  Review the following resume and provide 5 highly actionable, specific suggestions to improve it.
  Focus on impactful bullet points, better action verbs, and formatting/structural advice.

  Resume Text:
  ${resume.parsedText}

  Provide a JSON output with the exact keys:
  {
    "suggestions": [
      {
        "type": "Action Verb OR Bullet Point OR Structure",
        "suggestion": "The specific suggestion",
        "before": "What it looks like now (optional)",
        "after": "What it should look like (optional)"
      }
    ]
  }
  `;

  const analysisData = await parseAIJSON(prompt);

  // Save analysis to database
  await Analysis.findOneAndUpdate(
    { userId: req.user.id, resumeId, type: 'ai-suggestions' },
    { 
      generatedData: analysisData.suggestions
    },
    { upsert: true, new: true }
  );

  res.status(200).json({
    success: true,
    data: analysisData.suggestions
  });
});
