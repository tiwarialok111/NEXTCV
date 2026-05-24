import { asyncHandler } from '../utils/asyncHandler.js';
import Resume from '../models/Resume.js';
import { parseResumeFile } from '../parsers/resumeParser.js';

// @desc    Upload & parse resume
// @route   POST /api/resume/upload
// @access  Private
export const uploadResume = asyncHandler(async (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'Please upload a file' });
  }

  const parsedText = await parseResumeFile(req.file.path);

  const resume = await Resume.create({
    userId: req.user.id,
    fileName: req.file.originalname,
    filePath: req.file.path,
    parsedText
  });

  res.status(201).json({
    success: true,
    data: resume
  });
});

// @desc    Get user resumes
// @route   GET /api/resume
// @access  Private
export const getResumes = asyncHandler(async (req, res, next) => {
  const resumes = await Resume.find({ userId: req.user.id }).sort('-createdAt');

  res.status(200).json({
    success: true,
    count: resumes.length,
    data: resumes
  });
});

// @desc    Get single resume
// @route   GET /api/resume/:id
// @access  Private
export const getResume = asyncHandler(async (req, res, next) => {
  const resume = await Resume.findById(req.params.id);

  if (!resume) {
    return res.status(404).json({ success: false, message: 'Resume not found' });
  }

  // Make sure user owns resume
  if (resume.userId.toString() !== req.user.id && req.user.role !== 'admin') {
    return res.status(401).json({ success: false, message: 'Not authorized to access this resume' });
  }

  res.status(200).json({
    success: true,
    data: resume
  });
});

// @desc    Delete a resume
// @route   DELETE /api/resume/:id
// @access  Private
export const deleteResume = asyncHandler(async (req, res, next) => {
  const resume = await Resume.findById(req.params.id);

  if (!resume) {
    return res.status(404).json({ success: false, message: 'Resume not found' });
  }

  // Make sure user owns resume
  if (resume.userId.toString() !== req.user.id && req.user.role !== 'admin') {
    return res.status(401).json({ success: false, message: 'Not authorized to delete this resume' });
  }

  // Import Analysis model to delete associated analyses
  const Analysis = (await import('../models/Analysis.js')).default;
  await Analysis.deleteMany({ resumeId: resume._id });

  await resume.deleteOne();

  res.status(200).json({
    success: true,
    data: {}
  });
});
