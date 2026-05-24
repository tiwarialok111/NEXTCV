import { asyncHandler } from '../utils/asyncHandler.js';
import Resume from '../models/Resume.js';
import Analysis from '../models/Analysis.js';
import { parseAIJSON } from '../services/ai.service.js';

// @desc    Analyze skill gap
// @route   POST /api/skills/gap
// @access  Private
export const analyzeSkillGap = asyncHandler(async (req, res, next) => {
  const { resumeId, jobDescription } = req.body;

  if (!resumeId || !jobDescription) {
    return res.status(400).json({ success: false, message: 'Please provide resumeId and jobDescription' });
  }

  const resume = await Resume.findById(resumeId);

  if (!resume) {
    return res.status(404).json({ success: false, message: 'Resume not found' });
  }

  if (resume.userId.toString() !== req.user.id) {
    return res.status(401).json({ success: false, message: 'Not authorized' });
  }

  const prompt = `
  You are an expert technical recruiter and career coach.
  Analyze the following resume text against the provided Job Description.
  Identify the skill gap.

  Resume Text:
  ${resume.parsedText}
  
  Job Description:
  ${jobDescription}

  Provide a JSON output with the exact keys:
  {
    "matchPercentage": <number 0-100>,
    "missingSkills": [
      { "name": "Skill Name", "category": "Category Name", "importance": "High/Medium/Low" }
    ],
    "matchedSkills": ["Skill 1", "Skill 2"],
    "learningRoadmap": ["Step 1", "Step 2"],
    "radarData": [
      { "subject": "Skill Category", "A": <candidate score 0-100>, "B": <required score 0-100> }
    ]
  }
  `;

  const analysisData = await parseAIJSON(prompt);

  // Save analysis to database
  await Analysis.findOneAndUpdate(
    { userId: req.user.id, resumeId, type: 'skill-gap' },
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
