import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Upload, 
  Target, 
  Briefcase, 
  History, 
  MessageSquare,
  FileText,
  Settings,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  LogOut
} from 'lucide-react';
import { useState } from 'react';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

const NAV_ITEMS = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/upload', label: 'Resume Upload', icon: Upload },
  { path: '/ats-analyzer', label: 'ATS Analyzer', icon: Target },
  { path: '/skill-gap', label: 'Skill Gap', icon: Briefcase },
  { path: '/job-match', label: 'Job Match', icon: Briefcase },
  { path: '/ai-suggestions', label: 'AI Suggestions', icon: Sparkles },
  { path: '/interview', label: 'Interview Prep', icon: MessageSquare },
  { path: '/cover-letter', label: 'Cover Letter', icon: FileText },
  { path: '/history', label: 'History', icon: History },
];

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { logout } = useAuth();

  return (
    <motion.aside 
      animate={{ width: isCollapsed ? 80 : 260 }}
      className="h-screen bg-surface border-r border-surface-border flex flex-col transition-all duration-300 relative z-20"
    >
      {/* Header */}
      <div className="h-16 flex items-center px-6 border-b border-surface-border">
        <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center font-bold text-white shrink-0">
          N
        </div>
        {!isCollapsed && (
          <motion.span 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="ml-3 font-semibold text-lg tracking-tight bg-gradient-to-r from-content to-content-muted bg-clip-text text-transparent"
          >
            NEXTCV
          </motion.span>
        )}
      </div>

      {/* Collapse Toggle */}
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-20 bg-surface-highlight border border-surface-border rounded-full p-1 text-content-muted hover:text-content hover:bg-surface-border transition-colors shadow-lg"
      >
        {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>

      {/* Nav Links */}
      <div className="flex-1 overflow-y-auto py-6 px-3 flex flex-col gap-1 custom-scrollbar">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => clsx(
              'flex items-center px-3 py-2.5 rounded-lg transition-all duration-200 group relative',
              isActive 
                ? 'bg-primary/10 text-primary-light' 
                : 'text-content-muted hover:bg-surface-highlight hover:text-content'
            )}
          >
            {({ isActive }) => (
              <>
                <item.icon 
                  size={20} 
                  className={clsx('shrink-0 transition-colors', isActive ? 'text-primary-light' : 'text-content-muted group-hover:text-content')} 
                />
                {!isCollapsed && (
                  <span className="ml-3 font-medium whitespace-nowrap">
                    {item.label}
                  </span>
                )}
                
                {/* Active Indicator Line */}
                {isActive && (
                  <motion.div 
                    layoutId="activeTab"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-primary rounded-r-full"
                  />
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>

      {/* Footer Settings & Logout */}
      <div className="p-3 border-t border-surface-border space-y-2">
        <NavLink
          to="/settings"
          className={({ isActive }) => clsx(
            'flex items-center px-3 py-2.5 rounded-lg transition-all duration-200 group',
            isActive 
              ? 'bg-primary/10 text-primary-light' 
              : 'text-content-muted hover:bg-surface-highlight hover:text-content'
          )}
        >
          <Settings size={20} className="shrink-0" />
          {!isCollapsed && <span className="ml-3 font-medium">Settings</span>}
        </NavLink>
        <button
          onClick={logout}
          className="w-full flex items-center px-3 py-2.5 rounded-lg transition-all duration-200 group text-content-muted hover:bg-red-500/10 hover:text-red-400"
        >
          <LogOut size={20} className="shrink-0" />
          {!isCollapsed && <span className="ml-3 font-medium">Logout</span>}
        </button>
      </div>
    </motion.aside>
  );
}
