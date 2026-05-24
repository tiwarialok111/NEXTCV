import { motion } from 'framer-motion';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { CheckCircle2, XCircle, AlertCircle, TrendingUp, Loader2 } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../api';

export function ATSAnalyzer() {
  const [resumes, setResumes] = useState([]);
  const [selectedResumeId, setSelectedResumeId] = useState('');
  const [analysisData, setAnalysisData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successToast, setSuccessToast] = useState('');
  const location = useLocation();

  useEffect(() => {
    if (location.state?.uploadSuccess) {
      setSuccessToast('Resume uploaded successfully! Ready for analysis.');
      // Clear the state so it doesn't persist on refresh
      window.history.replaceState({}, document.title);
    }

    const fetchResumes = async () => {
      try {
        const { data } = await api.get('/resume');
        setResumes(data.data || []);
        if (data.data?.length > 0) {
          if (location.state?.resumeId) {
            setSelectedResumeId(location.state.resumeId);
          } else {
            setSelectedResumeId(data.data[0]._id);
          }
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchResumes();
  }, [location.state]);

  useEffect(() => {
    const fetchExistingAnalysis = async () => {
      if (!selectedResumeId) return;
      try {
        const { data } = await api.get(`/analysis/${selectedResumeId}/ats`);
        if (data.data && data.data.generatedData) {
          setAnalysisData(data.data.generatedData);
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
    if (!selectedResumeId) return;
    setLoading(true);
    setError('');
    try {
      const { data } = await api.post('/ats/analyze', { resumeId: selectedResumeId });
      setAnalysisData(data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to analyze resume');
    } finally {
      setLoading(false);
    }
  };

  const scoreData = analysisData ? [
    { name: 'Score', value: analysisData.score },
    { name: 'Remaining', value: 100 - analysisData.score }
  ] : [];
  
  const COLORS = ['#10b981', '#27272a']; // Success Emerald and Zinc 800

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">ATS Analyzer</h1>
          <p className="text-content-muted">Deep dive into how Applicant Tracking Systems read your resume.</p>
        </div>
        <div className="flex gap-3">
          <select 
            value={selectedResumeId}
            onChange={(e) => setSelectedResumeId(e.target.value)}
            className="bg-surface-highlight border border-surface-border text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
          >
            {resumes.length === 0 && <option value="">No resumes found</option>}
            {resumes.map(r => (
              <option key={r._id} value={r._id}>{r.fileName || 'Resume'}</option>
            ))}
          </select>
          <Button onClick={handleAnalyze} disabled={!selectedResumeId || loading}>
            {loading ? <Loader2 className="animate-spin" size={18} /> : 'Analyze Now'}
          </Button>
        </div>
      </div>

      {successToast && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-success/10 border border-success/20 text-success rounded-xl flex items-center gap-2 mb-4"
        >
          <CheckCircle2 size={20} />
          {successToast}
        </motion.div>
      )}

      {error && (
        <div className="p-4 bg-error/10 border border-error/20 text-error rounded-xl mb-4">
          {error}
        </div>
      )}

      {analysisData ? (

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Score Meter */}
        <Card className="flex flex-col items-center justify-center text-center p-8">
          <div className="relative w-48 h-48 mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={scoreData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={90}
                  startAngle={90}
                  endAngle={-270}
                  dataKey="value"
                  stroke="none"
                  cornerRadius={10}
                >
                  {scoreData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-5xl font-bold">{analysisData.score}</span>
              <span className="text-sm text-content-muted">/ 100</span>
            </div>
          </div>
          <h3 className="text-xl font-bold mb-2">
            {analysisData.score >= 80 ? 'Excellent Match' : analysisData.score >= 60 ? 'Good Match' : 'Needs Work'}
          </h3>
          <p className="text-sm text-content-muted">Based on standard ATS readability checks.</p>
        </Card>

        {/* Section Scores */}
        <Card className="lg:col-span-2">
          <h3 className="text-lg font-semibold mb-6">Section Breakdown</h3>
          <div className="space-y-6">
            {analysisData.sectionScores?.map((section, idx) => (
              <div key={idx}>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium">{section.name}</span>
                  <span className="text-content-muted">{section.score}%</span>
                </div>
                <div className="w-full h-2 bg-surface-highlight rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${section.score}%` }}
                    transition={{ duration: 1, delay: idx * 0.1 }}
                    className={`h-full rounded-full ${section.score >= 80 ? 'bg-success' : section.score >= 60 ? 'bg-warning' : 'bg-error'}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Missing Keywords */}
        <Card className="lg:col-span-1">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <XCircle className="text-error mr-2" size={20} />
            Missing Keywords
          </h3>
          <div className="flex flex-wrap gap-2">
            {analysisData.missingKeywords?.map((kw, i) => (
              <Badge key={i} variant="error">{kw}</Badge>
            ))}
          </div>
        </Card>

        {/* Found Keywords */}
        <Card className="lg:col-span-1">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <CheckCircle2 className="text-success mr-2" size={20} />
            Found Keywords
          </h3>
          <div className="flex flex-wrap gap-2">
            {analysisData.foundKeywords?.map((kw, i) => (
              <Badge key={i} variant="success">{kw}</Badge>
            ))}
          </div>
        </Card>

        {/* Suggestions */}
        <Card className="lg:col-span-1">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <TrendingUp className="text-primary-light mr-2" size={20} />
            Actionable Tips
          </h3>
          <div className="space-y-4">
            {analysisData.suggestions?.map((sug, i) => (
              <div key={i} className="flex gap-3 text-sm">
                <AlertCircle size={16} className={`shrink-0 mt-0.5 ${sug.type === 'error' ? 'text-error' : sug.type === 'warning' ? 'text-warning' : 'text-success'}`} />
                <p className="text-content-muted">{sug.text}</p>
              </div>
            ))}
          </div>
        </Card>

      </div>
      ) : (
        !loading && (
          <div className="text-center py-12 text-zinc-500">
            Select a resume and click "Analyze Now" to see your ATS results.
          </div>
        )
      )}
    </motion.div>
  );
}
