import { motion } from 'framer-motion';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { FileText, Download, Trash2, Eye } from 'lucide-react';
import { useState, useEffect } from 'react';
import api from '../api';

export function History() {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const handleView = (resume) => {
    // Assuming backend serves static files from uploads folder
    const baseUrl = api.defaults.baseURL.replace('/api', '');
    // normalize windows paths to forward slash for URL
    const normalizedPath = resume.filePath.replace(/\\/g, '/');
    const url = `${baseUrl}/${normalizedPath}`;
    window.open(url, '_blank');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this resume? This will also delete all associated AI analysis data.')) {
      return;
    }
    try {
      await api.delete(`/resume/${id}`);
      setResumes(resumes.filter(r => r._id !== id));
    } catch (err) {
      console.error('Failed to delete resume', err);
      alert('Failed to delete resume');
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
          <h1 className="text-3xl font-bold mb-2">Resume History</h1>
          <p className="text-content-muted">Track your resume versions and their ATS performance over time.</p>
        </div>
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface-highlight border-b border-surface-border text-content-muted">
              <tr>
                <th className="px-6 py-4 font-medium">Document Name</th>
                <th className="px-6 py-4 font-medium">Upload Date</th>
                <th className="px-6 py-4 font-medium">ATS Score</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-zinc-500">Loading your resumes...</td>
                </tr>
              ) : resumes.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-zinc-500">No resumes uploaded yet.</td>
                </tr>
              ) : resumes.map((resume) => (
                <tr key={resume._id} className="hover:bg-surface/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 text-primary-light rounded">
                        <FileText size={16} />
                      </div>
                      <span className="font-medium">{resume.fileName || 'Resume.pdf'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-content-muted">{new Date(resume.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <Badge variant="success">Ready</Badge>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant="default">Parsed</Badge>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => handleView(resume)}
                        title="View Resume PDF"
                        className="p-2 text-content-muted hover:text-primary-light transition-colors rounded hover:bg-surface-highlight"
                      >
                        <Eye size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(resume._id)}
                        title="Delete Resume"
                        className="p-2 text-content-muted hover:text-error transition-colors rounded hover:bg-error/10"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </motion.div>
  );
}
