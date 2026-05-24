import { asyncHandler } from '../utils/asyncHandler.js';
import Analysis from '../models/Analysis.js';

// @desc    Get analysis by resumeId and type
// @route   GET /api/analysis/:resumeId/:type
// @access  Private
export const getAnalysis = asyncHandler(async (req, res, next) => {
  const { resumeId, type } = req.params;

  const analysis = await Analysis.findOne({
    userId: req.user.id,
    resumeId,
    type
  });

  if (!analysis) {
    return res.status(200).json({
      success: true,
      data: null
    });
  }

  res.status(200).json({
    success: true,
    data: analysis
  });
});
