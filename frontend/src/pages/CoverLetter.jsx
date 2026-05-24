import { motion } from 'framer-motion';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { FileText, Download, Copy, RefreshCw, Wand2, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import api from '../api';

export function CoverLetter() {
  const [resumes, setResumes] = useState([]);
  const [selectedResumeId, setSelectedResumeId] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [tone, setTone] = useState('Professional');
  const [isGenerating, setIsGenerating] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
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
        const { data } = await api.get(`/analysis/${selectedResumeId}/cover-letter`);
        if (data.data && data.data.generatedData) {
          setCoverLetter(data.data.generatedData.coverLetter);
          if (data.data.inputParams) {
            if (data.data.inputParams.jobDescription) setJobDescription(data.data.inputParams.jobDescription);
            if (data.data.inputParams.tone) setTone(data.data.inputParams.tone);
          }
        } else {
          setCoverLetter('');
        }
      } catch (err) {
        console.error('Failed to fetch existing analysis:', err);
        setCoverLetter('');
      }
    };
    fetchExistingAnalysis();
  }, [selectedResumeId]);

  const handleGenerate = async () => {
    if (!selectedResumeId || !jobDescription) return;
    setIsGenerating(true);
    setError('');
    try {
      const { data } = await api.post('/cover-letter/generate', { 
        resumeId: selectedResumeId,
        jobDescription,
        tone
      });
      setCoverLetter(data.data.coverLetter);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate cover letter');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    if (coverLetter) {
      navigator.clipboard.writeText(coverLetter);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Cover Letter Generator</h1>
          <p className="text-content-muted">Generate tailored cover letters based on your resume and target job.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Controls */}
        <Card className="lg:col-span-1 space-y-6 h-fit">
          <div>
            <label className="block text-sm font-medium mb-2">Select Resume</label>
            <select 
              value={selectedResumeId}
              onChange={(e) => setSelectedResumeId(e.target.value)}
              className="w-full bg-surface-highlight border border-surface-border text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-primary"
            >
              {resumes.length === 0 && <option value="">No resumes found</option>}
              {resumes.map(r => (
                <option key={r._id} value={r._id}>{r.fileName || 'Resume'}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Tone</label>
            <select 
              className="w-full bg-surface-highlight border border-surface-border text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-primary"
              value={tone}
              onChange={(e) => setTone(e.target.value)}
            >
              <option>Professional</option>
              <option>Enthusiastic</option>
              <option>Direct & Concise</option>
              <option>Creative</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Target Job Description</label>
            <textarea 
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              rows={4}
              placeholder="Paste the job description here..."
              className="w-full bg-surface-highlight border border-surface-border text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-primary custom-scrollbar"
            />
          </div>

          <Button 
            className="w-full" 
            disabled={!selectedResumeId || !jobDescription || isGenerating}
            onClick={handleGenerate}
          >
            {isGenerating ? <Loader2 className="animate-spin mx-auto" size={20} /> : 'Generate Letter'}
          </Button>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        </Card>

        {/* Editor/Preview */}
        <Card className="lg:col-span-3 flex flex-col">
          <div className="flex justify-between items-center mb-4 pb-4 border-b border-surface-border">
            <h3 className="font-semibold flex items-center">
              <FileText size={18} className="mr-2 text-primary-light" />
              Generated Cover Letter
            </h3>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" icon={Copy} onClick={copyToClipboard} disabled={!coverLetter}>Copy</Button>
            </div>
          </div>
          
          <div className="flex-1 bg-surface-highlight/30 rounded-lg border border-surface-border p-6 font-serif text-content leading-relaxed min-h-[400px]">
            {isGenerating ? (
              <div className="flex flex-col items-center justify-center h-full text-content-muted">
                <Wand2 size={32} className="animate-pulse mb-4 text-primary" />
                <p>Crafting your perfect cover letter...</p>
              </div>
            ) : coverLetter ? (
              <div className="whitespace-pre-line text-sm md:text-base">
                {coverLetter}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-zinc-500">
                <p>Select a resume, paste a job description, and hit generate!</p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </motion.div>
  );
}
