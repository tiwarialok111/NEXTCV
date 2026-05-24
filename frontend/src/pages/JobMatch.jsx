import { motion } from 'framer-motion';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { CheckCircle2, XCircle, Briefcase, Building, MapPin, Loader2, Lightbulb } from 'lucide-react';
import { useState, useEffect } from 'react';
import api from '../api';

export function JobMatch() {
  const [resumes, setResumes] = useState([]);
  const [selectedResumeId, setSelectedResumeId] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [role, setRole] = useState('');
  const [analysisData, setAnalysisData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const { data } = await api.get('/resume');
        setResumes(data.data || []);
        if (data.data?.length > 0) {
          setSelectedResumeId(data.data[0]._id);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchResumes();
  }, []);

  useEffect(() => {
    const fetchExistingAnalysis = async () => {
      if (!selectedResumeId) return;
      try {
        const { data } = await api.get(`/analysis/${selectedResumeId}/job-match`);
        if (data.data && data.data.generatedData) {
          setAnalysisData(data.data.generatedData);
          if (data.data.inputParams) {
            if (data.data.inputParams.jobDescription) setJobDescription(data.data.inputParams.jobDescription);
            if (data.data.inputParams.companyName) setCompanyName(data.data.inputParams.companyName);
            if (data.data.inputParams.role) setRole(data.data.inputParams.role);
          }
        } else {
          setAnalysisData(null);
        }
      } catch (err) {
        console.error('Failed to fetch existing analysis:', err);
        setAnalysisData(null);
      }
    };
    fetchExistingAnalysis();
  }, [selectedResumeId]);

  const handleAnalyze = async () => {
    if (!selectedResumeId || !jobDescription || !role) return;
    setLoading(true);
    setError('');
    try {
      const { data } = await api.post('/job-match/analyze', { 
        resumeId: selectedResumeId,
        jobDescription,
        companyName,
        role
      });
      setAnalysisData(data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to analyze job match');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Job Description Match</h1>
        <p className="text-content-muted">See how well your resume aligns with a specific job posting.</p>
      </div>

      <Card className="mb-6">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Select Resume</label>
              <select 
                value={selectedResumeId}
                onChange={(e) => setSelectedResumeId(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              >
                {resumes.length === 0 && <option value="">No resumes found</option>}
                {resumes.map(r => (
                  <option key={r._id} value={r._id}>{r.fileName || 'Resume'}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Company Name (Optional)</label>
              <input 
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="e.g. Google, Stripe"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">Job Role Title</label>
            <input 
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g. Senior Frontend Engineer"
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">Target Job Description</label>
            <textarea 
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              rows={4}
              placeholder="Paste the full job description here..."
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 custom-scrollbar"
            />
          </div>
          <Button onClick={handleAnalyze} disabled={!selectedResumeId || !jobDescription || !role || loading} className="w-full">
            {loading ? <Loader2 className="animate-spin mx-auto" size={20} /> : 'Calculate Job Match'}
          </Button>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        </div>
      </Card>

      {analysisData && (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <Card className="lg:col-span-1 p-0 overflow-hidden flex flex-col">
          <div className="bg-surface-highlight p-6 border-b border-surface-border">
            <div className="w-16 h-16 bg-surface rounded-xl flex items-center justify-center mb-4 text-2xl border border-surface-border">
              🏢
            </div>
            <h2 className="text-xl font-bold">{role}</h2>
            <p className="text-primary-light font-medium mb-4">{companyName || 'Company'}</p>
          </div>
          
          <div className="p-6 flex flex-col items-center justify-center flex-1">
            <h3 className="text-sm text-content-muted mb-2">Overall Match Score</h3>
            <div className={`text-5xl font-bold mb-2 ${analysisData.matchScore >= 80 ? 'text-success' : analysisData.matchScore >= 60 ? 'text-warning' : 'text-error'}`}>
              {analysisData.matchScore}%
            </div>
            <Badge variant={analysisData.matchScore >= 80 ? 'success' : 'warning'}>
              {analysisData.matchScore >= 80 ? 'Strong Match' : 'Potential Match'}
            </Badge>
          </div>
        </Card>

        <div className="lg:col-span-2 space-y-6">
          <Card>
            <h3 className="text-lg font-semibold mb-6">Requirements Checklist</h3>
            <div className="space-y-4">
              {analysisData.requirements?.map((req, idx) => (
              <div key={idx} className={`p-4 rounded-lg border flex items-start gap-4 ${req.met ? 'bg-success/5 border-success/20' : 'bg-error/5 border-error/20'}`}>
                {req.met ? (
                  <CheckCircle2 className="text-success shrink-0 mt-0.5" size={20} />
                ) : (
                  <XCircle className="text-error shrink-0 mt-0.5" size={20} />
                )}
                <div>
                  <h4 className={`font-medium ${req.met ? 'text-content' : 'text-content'}`}>{req.req}</h4>
                  <p className="text-sm text-content-muted mt-1">
                    {req.met 
                      ? 'Found evidence in your experience section.' 
                      : 'Missing from your resume. Consider adding relevant projects or experience.'}
                  </p>
                </div>
              </div>
              ))}
            </div>
          </Card>

          {analysisData.recruiterInsights && analysisData.recruiterInsights.length > 0 && (
            <Card>
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Lightbulb className="text-warning mr-2" size={20} />
                Recruiter Insights
              </h3>
              <ul className="space-y-3">
                {analysisData.recruiterInsights.map((insight, idx) => (
                  <li key={idx} className="flex gap-3 text-sm text-content-muted">
                    <span className="text-primary-light">•</span>
                    {insight}
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </div>

      </div>
      )}
    </motion.div>
  );
}
