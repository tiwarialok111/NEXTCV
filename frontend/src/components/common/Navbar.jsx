import { Bell, Search } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export function Navbar() {
  const { user } = useAuth();
  const { toggleTheme } = useTheme();

  return (
    <header className="h-16 px-6 bg-surface/50 backdrop-blur-md border-b border-surface-border flex items-center justify-between sticky top-0 z-10">
      
      {/* Left: Search */}
      <div className="flex-1 max-w-md">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-content-muted group-focus-within:text-primary-light transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search resumes, jobs, or skills..." 
            className="w-full bg-surface-highlight/50 border border-surface-border rounded-lg pl-10 pr-4 py-2 text-sm text-content focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
          />
        </div>
      </div>




      {/* Right: Actions & Profile */}
      <div className="flex items-center gap-4 pl-4">
        {/* Profile Dropdown */}
        <button className="flex items-center gap-3 pl-2">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold">{user?.name || 'User'}</p>
          </div>
          <img 
            src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=6366f1&color=fff`} 
            alt="Profile" 
            className="w-9 h-9 rounded-full border-2 border-primary/20"
          />
        </button>

      </div>
    </header>
  );
}
