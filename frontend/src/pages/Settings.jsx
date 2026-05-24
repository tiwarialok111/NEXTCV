import { motion } from 'framer-motion';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { User, Bell, Shield, CreditCard, Palette } from 'lucide-react';
import { useState } from 'react';
import api from '../api';

export function Settings() {
  const { user } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('profile');
  
  // Security state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');
    
    if (!currentPassword || !newPassword) {
      return setPasswordError('Please fill in both fields');
    }
    
    if (newPassword.length < 6) {
      return setPasswordError('New password must be at least 6 characters');
    }

    try {
      setIsUpdatingPassword(true);
      await api.put('/auth/updatepassword', { currentPassword, newPassword });
      setPasswordSuccess('Password updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
    } catch (err) {
      setPasswordError(err.response?.data?.message || 'Failed to update password');
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Shield },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6 max-w-4xl"
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-content-muted">Manage your account, subscription, and preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Settings Navigation */}
        <div className="space-y-1">
          {tabs.map((item) => (
            <button 
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === item.id ? 'bg-primary/10 text-primary-light' : 'text-content-muted hover:bg-surface-highlight hover:text-content'}`}
            >
              <item.icon size={18} />
              {item.label}
            </button>
          ))}
        </div>

        {/* Settings Content */}
        <div className="md:col-span-3 space-y-6">
          
          {activeTab === 'profile' && (
            <>
              <Card>
                <h3 className="text-lg font-semibold mb-6">Profile Information</h3>
                <div className="flex items-center gap-6 mb-6">
                  <img src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=6366f1&color=fff`} alt="Profile" className="w-20 h-20 rounded-full border-2 border-surface-border" />
                  <div>
                    <Button variant="secondary" size="sm" className="mb-2">Change Avatar</Button>
                    <p className="text-xs text-content-muted">JPG, GIF or PNG. 1MB max.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-content-muted">Full Name</label>
                    <input 
                      type="text" 
                      defaultValue={user?.name || ''}
                      className="w-full bg-surface-highlight border border-surface-border rounded-lg px-3 py-2 text-content focus:outline-none focus:border-primary/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-content-muted">Email Address</label>
                    <input 
                      type="email" 
                      defaultValue={user?.email || ''}
                      className="w-full bg-surface-highlight border border-surface-border rounded-lg px-3 py-2 text-content focus:outline-none focus:border-primary/50"
                    />
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end">
                  <Button>Save Changes</Button>
                </div>
              </Card>

            </>
          )}

          {activeTab === 'security' && (
            <Card>
              <h3 className="text-lg font-semibold mb-4">Security Settings</h3>
              <p className="text-content-muted mb-6">Keep your account secure.</p>
              
              <form onSubmit={handleUpdatePassword} className="space-y-4 max-w-md">
                {passwordError && (
                  <div className="p-3 bg-error/10 border border-error/20 text-error rounded-lg text-sm">
                    {passwordError}
                  </div>
                )}
                {passwordSuccess && (
                  <div className="p-3 bg-success/10 border border-success/20 text-success rounded-lg text-sm">
                    {passwordSuccess}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium mb-1 text-content-muted">Current Password</label>
                  <input 
                    type="password" 
                    placeholder="••••••••" 
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full bg-surface-highlight border border-surface-border rounded-lg px-3 py-2 focus:outline-none focus:border-primary/50" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-content-muted">New Password</label>
                  <input 
                    type="password" 
                    placeholder="••••••••" 
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-surface-highlight border border-surface-border rounded-lg px-3 py-2 focus:outline-none focus:border-primary/50" 
                  />
                </div>
                <Button type="submit" disabled={isUpdatingPassword} className="mt-4">
                  {isUpdatingPassword ? 'Updating...' : 'Update Password'}
                </Button>
              </form>
            </Card>
          )}

        </div>
      </div>
    </motion.div>
  );
}
