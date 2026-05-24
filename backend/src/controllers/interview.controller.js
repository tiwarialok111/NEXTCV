import { asyncHandler } from '../utils/asyncHandler.js';
import Resume from '../models/Resume.js';
import Analysis from '../models/Analysis.js';
import { parseAIJSON } from '../services/ai.service.js';

// @desc    Generate interview questions
// @route   POST /api/interview/generate
// @access  Private
export const generateQuestions = asyncHandler(async (req, res, next) => {
  const { resumeId, role } = req.body;

  if (!resumeId || !role) {
    return res.status(400).json({ success: false, message: 'Please provide resumeId and role' });
  }

  const resume = await Resume.findById(resumeId);

  if (!resume || resume.userId.toString() !== req.user.id) {
    return res.status(404).json({ success: false, message: 'Resume not found or unauthorized' });
  }

  const prompt = `
  You are an expert technical interviewer for the role of ${role}.
  Based on the following resume, generate 5 highly relevant interview questions.
  Include a mix of Technical and Behavioral questions.

  Resume Text:
  ${resume.parsedText}

  Provide a JSON output with the exact keys:
  {
    "questions": [
      {
        "id": 1,
        "category": "Technical or Behavioral",
        "difficulty": "Hard, Medium, or Easy",
        "question": "The interview question text"
      }
    ]
  }
  `;

  const analysisData = await parseAIJSON(prompt);

  // Save analysis to database
  await Analysis.findOneAndUpdate(
    { userId: req.user.id, resumeId, type: 'interview-prep' },
    { 
      inputParams: { role },
      generatedData: analysisData.questions
    },
    { upsert: true, new: true }
  );

  res.status(200).json({
    success: true,
    data: analysisData.questions
  });
});

// @desc    Evaluate interview answer
// @route   POST /api/interview/evaluate
// @access  Private
export const evaluateAnswer = asyncHandler(async (req, res, next) => {
  const { question, answer } = req.body;

  if (!question || !answer) {
    return res.status(400).json({ success: false, message: 'Please provide question and answer' });
  }

  const prompt = `
  You are an expert technical interviewer.
  The candidate was asked the following question:
  "${question}"

  The candidate provided the following answer:
  "${answer}"

  Evaluate the candidate's answer. Provide constructive feedback on what they did well and what could be improved.
  Be concise but thorough.

  Provide a JSON output with the exact keys:
  {
    "score": <number 0-10>,
    "feedback": "Your detailed feedback string here",
    "strengths": ["array of what they did right"],
    "weaknesses": ["array of areas to improve"],
    "idealAnswer": "A brief example of a great answer"
  }
  `;

  const evaluation = await parseAIJSON(prompt);

  res.status(200).json({
    success: true,
    data: evaluation
  });
});
