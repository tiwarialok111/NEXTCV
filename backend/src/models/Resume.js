import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  fileName: {
    type: String,
    required: true
  },
  filePath: {
    type: String,
    required: true
  },
  parsedText: {
    type: String,
    required: true
  },
  extractedSkills: {
    type: [String],
    default: []
  },
  extractedProjects: [{
    title: String,
    description: String,
    technologies: [String]
  }],
  extractedEducation: [{
    institution: String,
    degree: String,
    year: String
  }],
  extractedExperience: [{
    company: String,
    role: String,
    duration: String,
    description: String
  }],
  atsScore: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

export default mongoose.model('Resume', resumeSchema);
