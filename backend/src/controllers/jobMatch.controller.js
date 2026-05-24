import { asyncHandler } from '../utils/asyncHandler.js';
import Resume from '../models/Resume.js';
import Analysis from '../models/Analysis.js';
import { parseAIJSON } from '../services/ai.service.js';

// @desc    Analyze job match
// @route   POST /api/job-match/analyze
// @access  Private
export const analyzeJobMatch = asyncHandler(async (req, res, next) => {
  const { resumeId, jobDescription, companyName, role } = req.body;

  if (!resumeId || !jobDescription) {
    return res.status(400).json({ success: false, message: 'Please provide resumeId and jobDescription' });
  }

  const resume = await Resume.findById(resumeId);

  if (!resume || resume.userId.toString() !== req.user.id) {
    return res.status(404).json({ success: false, message: 'Resume not found or unauthorized' });
  }

  const prompt = `
  You are an expert AI recruiter system for ${companyName || 'a top tech company'}.
  Evaluate the following resume against the provided job description for the role of ${role || 'Candidate'}.

  Resume Text:
  ${resume.parsedText}
  
  Job Description:
  ${jobDescription}

  Provide a JSON output with the exact keys:
  {
    "matchScore": <number 0-100>,
    "requirements": [
      { "req": "String requirement from JD", "met": true/false }
    ],
    "recruiterInsights": ["Insight 1", "Insight 2"]
  }
  `;

  const analysisData = await parseAIJSON(prompt);

  // Save analysis to database
  await Analysis.findOneAndUpdate(
    { userId: req.user.id, resumeId, type: 'job-match' },
    { 
      inputParams: { jobDescription, companyName, role },
      generatedData: analysisData
    },
    { upsert: true, new: true }
  );

  res.status(200).json({
    success: true,
    data: analysisData
  });
});
