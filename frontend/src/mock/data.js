export const mockUser = {
  name: 'Alex Developer',
  email: 'alex@example.com',
  avatar: 'https://ui-avatars.com/api/?name=Alex+Developer&background=6366f1&color=fff',
  plan: 'Pro',
};

export const dashboardMetrics = {
  overallScore: 78,
  resumesAnalyzed: 12,
  interviewsUnlocked: 5,
  skillMatch: 82,
};

export const recentUploads = [
  { id: 1, name: 'Frontend_Dev_Resume_v2.pdf', date: '2026-05-20', score: 85, status: 'Analyzed' },
  { id: 2, name: 'Fullstack_Resume_Final.docx', date: '2026-05-18', score: 72, status: 'Analyzed' },
  { id: 3, name: 'React_Role_Resume.pdf', date: '2026-05-10', score: 91, status: 'Analyzed' },
];

export const atsAnalysisData = {
  score: 85,
  keywordMatch: 88,
  formatting: 95,
  impact: 75,
  brevity: 82,
  missingKeywords: ['GraphQL', 'Docker', 'CI/CD', 'Jest'],
  foundKeywords: ['React', 'JavaScript', 'TypeScript', 'Node.js', 'Tailwind CSS', 'Redux'],
  suggestions: [
    { type: 'error', text: 'Missing important keyword: GraphQL based on your target role.' },
    { type: 'warning', text: 'Action verbs are repetitive. Consider using "Spearheaded" instead of "Led".' },
    { type: 'success', text: 'Formatting is highly ATS-friendly.' },
  ],
  sectionScores: [
    { name: 'Experience', score: 80 },
    { name: 'Education', score: 100 },
    { name: 'Skills', score: 70 },
    { name: 'Summary', score: 90 },
  ]
};

export const skillGapData = {
  matchPercentage: 78,
  radarData: [
    { subject: 'Frontend', A: 90, B: 100, fullMark: 100 },
    { subject: 'Backend', A: 60, B: 80, fullMark: 100 },
    { subject: 'DevOps', A: 40, B: 70, fullMark: 100 },
    { subject: 'Testing', A: 50, B: 90, fullMark: 100 },
    { subject: 'System Design', A: 70, B: 85, fullMark: 100 },
    { subject: 'Soft Skills', A: 95, B: 80, fullMark: 100 },
  ],
  missingSkills: [
    { name: 'Docker', category: 'DevOps', importance: 'High' },
    { name: 'GraphQL', category: 'Backend', importance: 'Medium' },
    { name: 'Jest', category: 'Testing', importance: 'High' },
    { name: 'AWS', category: 'DevOps', importance: 'Medium' }
  ]
};

export const jobMatchData = {
  jobTitle: 'Senior Frontend Engineer',
  company: 'TechFlow Inc.',
  matchScore: 82,
  requirements: [
    { req: '5+ years React experience', met: true },
    { req: 'TypeScript proficiency', met: true },
    { req: 'Experience with CI/CD', met: false },
    { req: 'State management (Redux/Zustand)', met: true },
    { req: 'Testing (Jest/Cypress)', met: false },
  ]
};

export const aiSuggestions = [
  {
    id: 1,
    original: 'Responsible for making the website faster.',
    suggested: 'Optimized frontend performance, reducing load times by 40% and improving Core Web Vitals.',
    category: 'Impact'
  },
  {
    id: 2,
    original: 'Worked on a team of 5 to build features.',
    suggested: 'Collaborated in an agile team of 5 engineers to deliver 15+ complex features ahead of schedule.',
    category: 'Action Verbs'
  },
  {
    id: 3,
    original: 'Fixed bugs and issues.',
    suggested: 'Resolved over 50 critical production bugs, increasing application stability by 25%.',
    category: 'Quantifiable'
  }
];

export const interviewQuestions = [
  { id: 1, category: 'Technical', difficulty: 'Hard', question: 'Explain how React\'s Virtual DOM works and how reconciliation happens.', status: 'Pending' },
  { id: 2, category: 'Behavioral', difficulty: 'Medium', question: 'Tell me about a time you disagreed with a senior engineer on architecture.', status: 'Completed' },
  { id: 3, category: 'Technical', difficulty: 'Medium', question: 'How do you handle state management in a large React application?', status: 'Pending' },
];

export const weeklyProgressData = [
  { name: 'Mon', score: 65 },
  { name: 'Tue', score: 68 },
  { name: 'Wed', score: 72 },
  { name: 'Thu', score: 75 },
  { name: 'Fri', score: 78 },
  { name: 'Sat', score: 82 },
  { name: 'Sun', score: 85 },
];
