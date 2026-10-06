import React from 'react';
import { GitBranch, Sparkles, History, Key, BookOpen, Layers } from 'lucide-react';

interface NavbarProps {
  onOpenTokenModal: () => void;
  onOpenHistory: () => void;
  hasToken: boolean;
  historyCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenTokenModal,
  onOpenHistory,
  hasToken,
  historyCount,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-purple-500 shadow-lg shadow-indigo-500/25 p-0.5">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <GitBranch className="w-5 h-5 text-indigo-400" />
            </div>
            <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-purple-500 rounded-full flex items-center justify-center shadow-sm">
              <Sparkles className="w-2 h-2 text-white" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-heading font-extrabold text-xl tracking-tight text-white">
                Git<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400">Story</span>
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide uppercase bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                <Sparkles className="w-2.5 h-2.5 text-indigo-400" /> Gemini 3.8 Flash
              </span>
            </div>
            <p className="hidden md:block text-[11px] text-slate-400 -mt-0.5">
              Turn commit logs into captivating product launch stories
            </p>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2.5">
          {/* GitHub Token Trigger */}
          <button
            type="button"
            onClick={onOpenTokenModal}
            className={`inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${
              hasToken
                ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/20'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200 hover:bg-slate-800/80'
            }`}
            title={hasToken ? 'GitHub Token Active' : 'Add GitHub Token (Optional)'}
          >
            <Key className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">
              {hasToken ? 'Token Active' : 'GitHub Token'}
            </span>
            {hasToken && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />}
          </button>

          {/* History Drawer Trigger */}
          <button
            type="button"
            onClick={onOpenHistory}
            className="relative inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg border border-slate-800 transition-colors"
          >
            <History className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">Saved Stories</span>
            {historyCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-indigo-600 text-white">
                {historyCount}
              </span>
            )}
          </button>
        </div>

      </div>
    </header>
  );
};
