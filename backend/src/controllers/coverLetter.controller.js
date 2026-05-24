import { asyncHandler } from '../utils/asyncHandler.js';
import Resume from '../models/Resume.js';
import Analysis from '../models/Analysis.js';
import { generateAIResponse } from '../services/ai.service.js';

// @desc    Generate cover letter
// @route   POST /api/cover-letter/generate
// @access  Private
export const generateCoverLetter = asyncHandler(async (req, res, next) => {
  const { resumeId, jobDescription, companyName, tone = 'Professional' } = req.body;

  if (!resumeId) {
    return res.status(400).json({ success: false, message: 'Please provide resumeId' });
  }

  const resume = await Resume.findById(resumeId);

  if (!resume || resume.userId.toString() !== req.user.id) {
    return res.status(404).json({ success: false, message: 'Resume not found or unauthorized' });
  }

  const prompt = `
  You are an expert career coach and copywriter.
  Write a ${tone} cover letter based on the candidate's resume and the target job description.
  Keep it concise, impactful, and under 300 words. Do not use generic fluff.
  
  Candidate's Resume:
  ${resume.parsedText}
  
  ${jobDescription ? `Target Job Description:\n${jobDescription}` : ''}
  ${companyName ? `Target Company:\n${companyName}` : ''}
  
  Output ONLY the cover letter text. Do not wrap it in JSON.
  `;

  const coverLetterText = await generateAIResponse(prompt);

  // Save analysis to database
  await Analysis.findOneAndUpdate(
    { userId: req.user.id, resumeId, type: 'cover-letter' },
    { 
      inputParams: { jobDescription, companyName, tone },
      generatedData: { coverLetter: coverLetterText }
    },
    { upsert: true, new: true }
  );

  res.status(200).json({
    success: true,
    data: {
      coverLetter: coverLetterText
    }
  });
});
