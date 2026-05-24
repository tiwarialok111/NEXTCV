import mongoose from 'mongoose';

const analysisSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.ObjectId, 
    ref: 'User', 
    required: true 
  },
  resumeId: { 
    type: mongoose.Schema.ObjectId, 
    ref: 'Resume', 
    required: true 
  },
  type: {
    type: String,
    enum: ['ats', 'skill-gap', 'job-match', 'ai-suggestions', 'interview-prep', 'cover-letter'],
    required: true
  },
  inputParams: { 
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  generatedData: { 
    type: mongoose.Schema.Types.Mixed, 
    required: true 
  },
}, { 
  timestamps: true 
});

// Ensure a user can only have one analysis per resume per type
analysisSchema.index({ userId: 1, resumeId: 1, type: 1 }, { unique: true });

export default mongoose.model('Analysis', analysisSchema);
