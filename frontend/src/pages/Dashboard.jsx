import { motion } from 'framer-motion';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { dashboardMetrics, weeklyProgressData } from '../mock/data';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowUpRight, Upload, FileText, Target, Award, Rocket, Zap, MessageSquare } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';

export function Dashboard() {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const { data } = await api.get('/resume');
        setResumes(data.data || []);
      } catch (err) {
        console.error("Failed to fetch resumes", err);
      } finally {
        setLoading(false);
      }
    };
    fetchResumes();
  }, []);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // --- EMPTY STATE (ONBOARDING) ---
  if (resumes.length === 0) {
    return (
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-8"
      >
        <motion.div variants={item} className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 to-violet-800 p-10 text-white shadow-2xl text-center">
          <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center">
            <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mb-6 backdrop-blur-md border border-white/20">
              <Rocket size={40} className="text-white" />
            </div>
            <h1 className="text-4xl font-bold mb-4">Welcome to NEXTCV, {user?.name?.split(' ')[0] || 'User'}! 🚀</h1>
            <p className="text-white/80 text-xl mb-8 leading-relaxed max-w-2xl">
              Unlock the power of AI to land your dream job. Upload your resume to instantly get ATS analysis, identify skill gaps, and generate customized interview prep.
            </p>
            <Button 
              onClick={() => navigate('/upload')} 
              className="bg-white text-indigo-600 hover:bg-zinc-100 hover:scale-105 transition-all text-lg py-4 px-8 rounded-full font-bold shadow-xl flex items-center gap-2"
            >
              <Upload size={24} />
              Upload Your First Resume
            </Button>
          </div>
          {/* Abstract background shapes */}
          <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2" />
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-black/20 rounded-full blur-3xl translate-y-1/3 translate-x-1/3" />
        </motion.div>

        <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          <Card className="text-center p-8 bg-zinc-900/50 border-zinc-800/50 backdrop-blur-sm">
            <div className="mx-auto w-16 h-16 bg-indigo-500/10 rounded-2xl flex items-center justify-center mb-6 text-indigo-400">
              <Target size={32} />
            </div>
            <h3 className="text-xl font-bold mb-3 text-white">ATS Optimization</h3>
            <p className="text-zinc-400 leading-relaxed">
              Our AI analyzes your resume against industry standards to ensure it passes automated tracking systems perfectly.
            </p>
          </Card>

          <Card className="text-center p-8 bg-zinc-900/50 border-zinc-800/50 backdrop-blur-sm">
            <div className="mx-auto w-16 h-16 bg-violet-500/10 rounded-2xl flex items-center justify-center mb-6 text-violet-400">
              <Zap size={32} />
            </div>
            <h3 className="text-xl font-bold mb-3 text-white">Skill Gap Analysis</h3>
            <p className="text-zinc-400 leading-relaxed">
              Match your resume directly against specific job descriptions to instantly spot missing keywords and required skills.
            </p>
          </Card>

          <Card className="text-center p-8 bg-zinc-900/50 border-zinc-800/50 backdrop-blur-sm">
            <div className="mx-auto w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-6 text-emerald-400">
              <MessageSquare size={32} />
            </div>
            <h3 className="text-xl font-bold mb-3 text-white">Interview Prep</h3>
            <p className="text-zinc-400 leading-relaxed">
              Generate custom interview questions and mock scenarios tailored specifically to your exact experience and target role.
            </p>
          </Card>
        </motion.div>
      </motion.div>
    );
  }

  // --- POPULATED STATE (SAAS DASHBOARD) ---
  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* Header Banner */}
      <motion.div variants={item} className="relative overflow-hidden rounded-2xl bg-gradient-primary p-8 text-white shadow-xl shadow-primary/20">
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name?.split(' ')[0] || 'User'}! 👋</h1>
          <p className="text-white/80 text-lg mb-6">Your resume health score is in the top 15% of candidates. Keep optimizing to reach your dream role.</p>
          <Button onClick={() => navigate('/upload')} variant="secondary" className="bg-white text-primary hover:bg-white/90 border-none">
            <Upload size={18} className="mr-2" />
            Upload New Resume
          </Button>
        </div>
        {/* Abstract background shapes */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 right-32 w-48 h-48 bg-black/10 rounded-full blur-2xl translate-y-1/3" />
      </motion.div>

      {/* Metrics Grid */}
      <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Overall ATS Score', value: `${dashboardMetrics.overallScore}%`, icon: Target, trend: '+5%', color: 'text-primary-light' },
          { label: 'Resumes Analyzed', value: resumes.length, icon: FileText, trend: `+${resumes.length}`, color: 'text-success' },
          { label: 'Skill Match Avg', value: `${dashboardMetrics.skillMatch}%`, icon: Award, trend: '+8%', color: 'text-warning' },
          { label: 'Interviews Ready', value: dashboardMetrics.interviewsUnlocked, icon: ArrowUpRight, trend: 'New', color: 'text-secondary' },
        ].map((metric, i) => (
          <Card key={i} hover className="flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-2 rounded-lg bg-surface-highlight ${metric.color}`}>
                <metric.icon size={20} />
              </div>
              <Badge variant="success">{metric.trend}</Badge>
            </div>
            <h3 className="text-3xl font-bold mb-1">{metric.value}</h3>
            <p className="text-content-muted text-sm">{metric.label}</p>
          </Card>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <motion.div variants={item} className="lg:col-span-2">
          <Card className="h-full">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold">Weekly Progress</h3>
              <select className="bg-surface-highlight border border-surface-border text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary">
                <option>This Week</option>
                <option>Last Week</option>
              </select>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weeklyProgressData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#18181b', borderColor: '#3f3f46', borderRadius: '0.5rem' }}
                    itemStyle={{ color: '#f8fafc' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="score" 
                    stroke="#6366f1" 
                    strokeWidth={3}
                    dot={{ fill: '#18181b', stroke: '#6366f1', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, fill: '#6366f1' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </motion.div>

        {/* Recent Uploads */}
        <motion.div variants={item}>
          <Card className="h-full">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold">Recent Resumes</h3>
              <Button variant="outline" size="sm" onClick={() => navigate('/history')}>View All</Button>
            </div>
            <div className="space-y-4">
              {resumes.slice(0, 5).map(upload => (
                <div key={upload._id} className="group flex items-center justify-between p-3 rounded-lg hover:bg-surface-highlight transition-colors cursor-pointer border border-transparent hover:border-surface-border">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-surface-highlight rounded group-hover:bg-surface text-content-muted group-hover:text-primary-light transition-colors">
                      <FileText size={16} />
                    </div>
                    <div>
                      <p className="text-sm font-medium truncate w-32">{upload.fileName || 'Resume.pdf'}</p>
                      <p className="text-xs text-content-muted">{new Date(upload.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
