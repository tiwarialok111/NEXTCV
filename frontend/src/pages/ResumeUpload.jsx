import { motion } from 'framer-motion';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Upload, FileText, CheckCircle, X } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

export function ResumeUpload() {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = async (selectedFile) => {
    setFile(selectedFile);
    setIsUploading(true);
    setError('');

    const formData = new FormData();
    formData.append('resume', selectedFile);

    try {
      const response = await api.post('/resume/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      // Handle success, maybe navigate or show success
      setIsUploading(false);
      navigate('/ats-analyzer', { 
        state: { 
          resumeId: response.data.data._id, 
          uploadSuccess: true 
        } 
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload resume');
      setIsUploading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto space-y-6"
    >
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Upload Resume</h1>
        <p className="text-content-muted">Upload your resume for AI-powered ATS analysis and optimization.</p>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>

      <Card>
        {!file ? (
          <div 
            className={`border-2 border-dashed rounded-xl p-12 text-center transition-all duration-200 ${isDragging ? 'border-primary bg-primary/5' : 'border-surface-border bg-surface-highlight/30 hover:border-primary/50'}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="w-16 h-16 bg-surface rounded-full flex items-center justify-center mx-auto mb-4 text-primary-light">
              <Upload size={28} />
            </div>
            <h3 className="text-xl font-semibold mb-2">Drag & Drop your resume</h3>
            <p className="text-content-muted text-sm mb-6">Supports PDF, DOCX (Max 5MB)</p>
            
            <input 
              type="file" 
              id="resume-upload" 
              className="hidden" 
              accept=".pdf,.docx"
              onChange={handleFileChange}
            />
            <Button onClick={() => document.getElementById('resume-upload').click()}>
              Browse Files
            </Button>
          </div>
        ) : (
          <div className="p-6">
            <div className="flex items-center justify-between bg-surface-highlight p-4 rounded-lg border border-surface-border">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-surface rounded-lg text-primary-light">
                  <FileText size={24} />
                </div>
                <div>
                  <h4 className="font-medium">{file.name}</h4>
                  <p className="text-xs text-content-muted">
                    {(file.size / 1024 / 1024).toFixed(2)} MB • {isUploading ? 'Uploading...' : 'Upload Complete'}
                  </p>
                </div>
              </div>
              {isUploading ? (
                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              ) : (
                <button onClick={() => setFile(null)} className="p-2 text-content-muted hover:text-error transition-colors">
                  <X size={20} />
                </button>
              )}
            </div>

            {!isUploading && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-6 flex justify-end gap-3"
              >
                <Button variant="outline" onClick={() => setFile(null)}>Cancel</Button>
                <Button icon={CheckCircle}>Analyze Resume</Button>
              </motion.div>
            )}
          </div>
        )}
      </Card>
    </motion.div>
  );
}
