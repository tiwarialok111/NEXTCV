import { motion } from 'framer-motion';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { MessageSquare, PlayCircle, Clock, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import api from '../api';

export function InterviewPrep() {
  const [resumes, setResumes] = useState([]);
  const [selectedResumeId, setSelectedResumeId] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [questions, setQuestions] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activePracticeId, setActivePracticeId] = useState(null);
  const [practiceAnswer, setPracticeAnswer] = useState('');
  const [evaluatingId, setEvaluatingId] = useState(null);
  const [evaluations, setEvaluations] = useState({});

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
        const { data } = await api.get(`/analysis/${selectedResumeId}/interview-prep`);
        if (data.data && data.data.generatedData) {
          setQuestions(data.data.generatedData);
          if (data.data.inputParams?.role) {
            setJobDescription(data.data.inputParams.role);
          }
        } else {
          setQuestions(null);
        }
      } catch (err) {
        console.error('Failed to fetch existing analysis:', err);
        setQuestions(null);
      }
    };
    fetchExistingAnalysis();
  }, [selectedResumeId]);

  const handleGenerate = async () => {
    if (!selectedResumeId || !jobDescription) return;
    setLoading(true);
    setError('');
    try {
      const { data } = await api.post('/interview/generate', { 
        resumeId: selectedResumeId,
        role: jobDescription
      });
      setQuestions(data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate interview questions');
    } finally {
      setLoading(false);
    }
  };

  const handleEvaluate = async (question, idx) => {
    if (!practiceAnswer.trim()) return;
    setEvaluatingId(idx);
    try {
      const { data } = await api.post('/interview/evaluate', {
        question: question.question,
        answer: practiceAnswer
      });
      setEvaluations(prev => ({
        ...prev,
        [idx]: data.data
      }));
      setActivePracticeId(null);
      setPracticeAnswer('');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to evaluate answer');
    } finally {
      setEvaluatingId(null);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Interview Prep</h1>
          <p className="text-content-muted">Practice AI-generated questions tailored to your resume and target role.</p>
        </div>
      </div>

      <Card className="mb-6">
        <div className="space-y-4">
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
            <label className="block text-sm font-medium text-zinc-300 mb-2">Target Job Description</label>
            <textarea 
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              rows={4}
              placeholder="Paste the job description here..."
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 custom-scrollbar"
            />
          </div>
          <Button onClick={handleGenerate} disabled={!selectedResumeId || !jobDescription || loading} className="w-full">
            {loading ? <Loader2 className="animate-spin mx-auto" size={20} /> : 'Generate Questions'}
          </Button>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        </div>
      </Card>

      {questions && (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {questions.map((q, idx) => (
          <Card key={idx} hover className="flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <Badge variant={q.category === 'Technical' ? 'primary' : 'secondary'}>
                {q.category}
              </Badge>
              <Badge variant={q.difficulty === 'Hard' ? 'error' : 'warning'}>
                {q.difficulty}
              </Badge>
            </div>
            
            <p className="font-medium text-content mb-6 flex-1">
              "{q.question}"
            </p>

            <div className="flex items-center justify-between mt-auto pt-4 border-t border-surface-border">
              <span className="text-xs flex items-center text-content-muted">
                <Clock size={12} className="mr-1" />
                Est. 3-5 mins
              </span>
              <Button 
                variant="secondary" 
                size="sm"
                onClick={() => {
                  setActivePracticeId(activePracticeId === idx ? null : idx);
                  setPracticeAnswer('');
                }}
              >
                {activePracticeId === idx ? 'Cancel' : 'Practice'}
              </Button>
            </div>
            
            {activePracticeId === idx && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-4 pt-4 border-t border-surface-border"
              >
                <textarea 
                  value={practiceAnswer}
                  onChange={(e) => setPracticeAnswer(e.target.value)}
                  placeholder="Type your answer here to practice..."
                  rows={3}
                  className="w-full bg-surface-highlight border border-surface-border rounded-lg px-3 py-2 text-sm text-content mb-3 focus:outline-none focus:border-primary/50"
                />
                <Button 
                  size="sm" 
                  className="w-full"
                  disabled={evaluatingId === idx || !practiceAnswer.trim()}
                  onClick={() => handleEvaluate(q, idx)}
                >
                  {evaluatingId === idx ? <Loader2 className="animate-spin mx-auto" size={16} /> : 'Submit Answer'}
                </Button>
              </motion.div>
            )}

            {evaluations[idx] && activePracticeId !== idx && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4 p-4 bg-surface-highlight/40 rounded-xl border border-surface-border/50 text-sm space-y-3"
              >
                <div className="flex items-center justify-between font-semibold border-b border-surface-border/50 pb-2">
                  <span className="text-primary-light">Evaluation Feedback</span>
                  <span className={`px-2 py-0.5 rounded-md ${evaluations[idx].score >= 7 ? 'bg-success/20 text-success' : 'bg-warning/20 text-warning'}`}>
                    Score: {evaluations[idx].score}/10
                  </span>
                </div>
                <p className="text-content">{evaluations[idx].feedback}</p>
                
                {evaluations[idx].strengths?.length > 0 && (
                  <div>
                    <strong className="text-success text-xs uppercase tracking-wider block mb-1">What you did well:</strong>
                    <ul className="list-disc pl-4 text-content-muted space-y-1">
                      {evaluations[idx].strengths.map((s, i) => <li key={i}>{s}</li>)}
                    </ul>
                  </div>
                )}
                
                {evaluations[idx].weaknesses?.length > 0 && (
                  <div>
                    <strong className="text-error text-xs uppercase tracking-wider block mb-1">Areas to improve:</strong>
                    <ul className="list-disc pl-4 text-content-muted space-y-1">
                      {evaluations[idx].weaknesses.map((w, i) => <li key={i}>{w}</li>)}
                    </ul>
                  </div>
                )}
                
                {evaluations[idx].idealAnswer && (
                  <div className="pt-2 border-t border-surface-border/50">
                    <strong className="text-primary-light text-xs uppercase tracking-wider block mb-1">Example Answer:</strong>
                    <p className="text-content-muted italic">"{evaluations[idx].idealAnswer}"</p>
                  </div>
                )}
              </motion.div>
            )}

            {q.rationale && (
              <p className="text-xs text-content-muted mt-4 p-3 bg-surface-highlight rounded-lg">
                <span className="font-semibold text-primary-light">Why this?</span> {q.rationale}
              </p>
            )}
          </Card>
        ))}
      </div>
      )}
    </motion.div>
  );
}
