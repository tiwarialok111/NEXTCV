import { motion } from 'framer-motion';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { BookOpen, ExternalLink, Zap, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import api from '../api';

export function SkillGap() {
  const [resumes, setResumes] = useState([]);
  const [selectedResumeId, setSelectedResumeId] = useState('');
  const [jobDescription, setJobDescription] = useState('');
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
        const { data } = await api.get(`/analysis/${selectedResumeId}/skill-gap`);
        if (data.data && data.data.generatedData) {
          setAnalysisData(data.data.generatedData);
          if (data.data.inputParams?.jobDescription) {
            setJobDescription(data.data.inputParams.jobDescription);
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
    if (!selectedResumeId || !jobDescription) return;
    setLoading(true);
    setError('');
    try {
      const { data } = await api.post('/skills/gap', { 
        resumeId: selectedResumeId,
        jobDescription
      });
      setAnalysisData(data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to analyze skill gap');
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
      <div className="flex flex-col mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Skill Gap Analysis</h1>
          <p className="text-content-muted">Compare your skills against the requirements for your target role.</p>
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
          <Button onClick={handleAnalyze} disabled={!selectedResumeId || !jobDescription || loading} className="w-full">
            {loading ? <Loader2 className="animate-spin mx-auto" size={20} /> : 'Analyze Skill Gap'}
          </Button>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        </div>
      </Card>

      {analysisData && (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Radar Chart */}
        <Card className="flex flex-col">
          <h3 className="text-lg font-semibold mb-4">Skill Coverage Map</h3>
          <div className="h-80 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={analysisData.radarData}>
                <PolarGrid stroke="#3f3f46" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar name="Your Skills" dataKey="A" stroke="#6366f1" fill="#6366f1" fillOpacity={0.4} />
                <Radar name="Job Requirement" dataKey="B" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.1} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#18181b', borderColor: '#3f3f46', borderRadius: '0.5rem' }}
                  itemStyle={{ color: '#f8fafc' }}
                />
              </RadarChart>
            </ResponsiveContainer>
            
            <div className="absolute bottom-0 w-full flex justify-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-primary/40 rounded-full border border-primary"></div>
                <span className="text-content-muted">Your Profile</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-secondary/10 rounded-full border border-secondary"></div>
                <span className="text-content-muted">Target Role</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Missing Skills Roadmap */}
        <Card>
          <h3 className="text-lg font-semibold mb-6 flex items-center">
            <Zap className="text-warning mr-2" size={20} />
            Learning Roadmap
          </h3>
          <div className="space-y-4">
            {analysisData.missingSkills?.map((skill, idx) => (
              <div key={idx} className="p-4 bg-surface-highlight border border-surface-border rounded-lg group">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-semibold text-content group-hover:text-primary-light transition-colors">{skill.name}</h4>
                    <p className="text-xs text-content-muted">{skill.category}</p>
                  </div>
                  <Badge variant={skill.importance === 'High' ? 'error' : 'warning'}>
                    {skill.importance} Priority
                  </Badge>
                </div>
                <div className="flex gap-3">
                  <Button variant="secondary" size="sm" icon={BookOpen} className="flex-1">
                    Study Guide
                  </Button>
                  <Button variant="outline" size="sm" icon={ExternalLink} className="px-3">
                    Courses
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
      )}
    </motion.div>
  );
}
