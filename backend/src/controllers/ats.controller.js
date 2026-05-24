import { asyncHandler } from '../utils/asyncHandler.js';
import Resume from '../models/Resume.js';
import Analysis from '../models/Analysis.js';
import { parseAIJSON } from '../services/ai.service.js';

// @desc    Analyze resume for ATS score
// @route   POST /api/ats/analyze
// @access  Private
export const analyzeResume = asyncHandler(async (req, res, next) => {
  const { resumeId, jobDescription } = req.body;

  if (!resumeId) {
    return res.status(400).json({ success: false, message: 'Please provide a resumeId' });
  }

  const resume = await Resume.findById(resumeId);

  if (!resume) {
    return res.status(404).json({ success: false, message: 'Resume not found' });
  }

  // Make sure user owns resume
  if (resume.userId.toString() !== req.user.id) {
    return res.status(401).json({ success: false, message: 'Not authorized' });
  }

  const prompt = `
  You are an expert ATS (Applicant Tracking System) software used by Fortune 500 companies.
  Analyze the following resume text against standard ATS algorithms. 
  ${jobDescription ? 'Also compare it against the following Job Description to determine relevance.' : ''}

  Resume Text:
  ${resume.parsedText}
  
  ${jobDescription ? `Job Description:\n${jobDescription}` : ''}

  Provide a JSON output with the exact keys:
  {
    "score": <number 0-100>,
    "missingKeywords": [<array of strings>],
    "strengths": [<array of strings>],
    "weaknesses": [<array of strings>],
    "recommendations": [<array of strings>]
  }
  `;

  const analysisData = await parseAIJSON(prompt);

  // Optionally update resume with ATS score
  resume.atsScore = analysisData.score;
  await resume.save();

  // Save analysis to database
  await Analysis.findOneAndUpdate(
    { userId: req.user.id, resumeId, type: 'ats' },
    { 
      inputParams: { jobDescription },
      generatedData: analysisData
    },
    { upsert: true, new: true }
  );

  res.status(200).json({
    success: true,
    data: analysisData
  });
});
