import { motion } from 'framer-motion';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Sparkles, Loader2, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import api from '../api';

export function AISuggestions() {
  const [resumes, setResumes] = useState([]);
  const [selectedResumeId, setSelectedResumeId] = useState('');
  const [suggestions, setSuggestions] = useState(null);
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
        const { data } = await api.get(`/analysis/${selectedResumeId}/ai-suggestions`);
        if (data.data && data.data.generatedData) {
          setSuggestions(data.data.generatedData);
        } else {
          setSuggestions(null);
        }
      } catch (err) {
        console.error('Failed to fetch existing analysis:', err);
        setSuggestions(null);
      }
    };
    fetchExistingAnalysis();
  }, [selectedResumeId]);

  const handleGenerate = async () => {
    if (!selectedResumeId) return;
    setLoading(true);
    setError('');
    try {
      const { data } = await api.post('/suggestions/generate', { 
        resumeId: selectedResumeId
      });
      setSuggestions(data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate suggestions');
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
        <h1 className="text-3xl font-bold mb-2">AI Resume Suggestions</h1>
        <p className="text-content-muted">Smart recommendations to make your resume stand out to recruiters.</p>
      </div>

      <Card className="mb-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-content-muted mb-2">Select Resume to Improve</label>
            <select 
              value={selectedResumeId}
              onChange={(e) => setSelectedResumeId(e.target.value)}
              className="w-full bg-surface-highlight border border-surface-border rounded-xl px-4 py-3 text-content focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              {resumes.length === 0 && <option value="">No resumes found</option>}
              {resumes.map(r => (
                <option key={r._id} value={r._id}>{r.fileName || 'Resume'}</option>
              ))}
            </select>
          </div>
          
          <Button onClick={handleGenerate} disabled={!selectedResumeId || loading} className="w-full">
            {loading ? <Loader2 className="animate-spin mx-auto" size={20} /> : 'Generate Suggestions'}
          </Button>
          {error && <p className="text-error text-sm text-center">{error}</p>}
        </div>
      </Card>

      {suggestions && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {suggestions.map((s, idx) => (
            <Card key={idx} hover className="flex flex-col border-l-4 border-l-primary">
              <div className="flex items-center gap-2 mb-4 text-primary-light font-semibold">
                <Sparkles size={18} />
                <span>{s.type}</span>
              </div>
              <p className="font-medium text-content mb-6 flex-1">
                {s.suggestion}
              </p>
              
              {(s.before || s.after) && (
                <div className="mt-auto bg-surface-highlight/50 p-4 rounded-lg text-sm border border-surface-border/50">
                  {s.before && (
                    <div className="mb-3 text-content-muted">
                      <span className="block text-xs font-semibold text-error/80 uppercase tracking-wider mb-1">Current</span>
                      "{s.before}"
                    </div>
                  )}
                  {s.after && (
                    <div className="text-content">
                      <span className="block text-xs font-semibold text-success/80 uppercase tracking-wider mb-1">Suggested</span>
                      "{s.after}"
                    </div>
                  )}
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </motion.div>
  );
}
