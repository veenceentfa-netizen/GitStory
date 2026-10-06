import React, { useState } from 'react';
import { Search, GitBranch, ArrowRight, Loader2, Sparkles, AlertCircle, Compass, CheckCircle2 } from 'lucide-react';
import { SAMPLE_REPOSITORIES, SampleRepo } from '../data/samples';

interface RepoInputProps {
  url: string;
  setUrl: (url: string) => void;
  branch: string;
  setBranch: (branch: string) => void;
  commitLimit: number;
  setCommitLimit: (limit: number) => void;
  onFetch: () => void;
  isLoading: boolean;
  onSelectSample: (sample: SampleRepo) => void;
  error?: string | null;
  rateLimited?: boolean;
  onOpenTokenModal: () => void;
}

export const RepoInput: React.FC<RepoInputProps> = ({
  url,
  setUrl,
  branch,
  setBranch,
  commitLimit,
  setCommitLimit,
  onFetch,
  isLoading,
  onSelectSample,
  error,
  rateLimited,
  onOpenTokenModal,
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim() && !isLoading) {
      onFetch();
    }
  };

  return (
    <div className="w-full">
      {/* Search & URL Box */}
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl blur-md opacity-25 group-hover:opacity-45 transition duration-500" />
          
          <div className="relative flex flex-col md:flex-row items-stretch md:items-center bg-slate-900 border border-slate-800 rounded-2xl p-2 gap-2 shadow-2xl">
            <div className="flex-1 flex items-center gap-3 px-3">
              <Search className="w-5 h-5 text-indigo-400 shrink-0" />
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Enter GitHub URL or owner/repo (e.g. facebook/react or vercel/next.js)..."
                className="w-full bg-transparent text-white placeholder-slate-500 text-sm md:text-base focus:outline-none py-2 font-mono"
              />
            </div>

            {/* Quick Commit Limit Selector */}
            <div className="flex items-center gap-2 px-2 border-t md:border-t-0 md:border-l border-slate-800/80 pt-2 md:pt-0">
              <select
                value={commitLimit}
                onChange={(e) => setCommitLimit(Number(e.target.value))}
                className="bg-slate-950 border border-slate-800 text-slate-300 rounded-xl px-2.5 py-2 text-xs focus:outline-none focus:border-indigo-500"
                title="Number of recent commits to analyze"
              >
                <option value={15}>15 commits</option>
                <option value={30}>30 commits</option>
                <option value={50}>50 commits</option>
                <option value={80}>80 commits</option>
              </select>

              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className={`p-2 rounded-xl border text-xs flex items-center gap-1 transition-colors ${
                  showAdvanced || branch
                    ? 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
                title="Branch and advanced options"
              >
                <GitBranch className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{branch ? branch : 'Branch'}</span>
              </button>

              <button
                type="submit"
                disabled={isLoading || !url.trim()}
                className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-medium text-sm text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:hover:bg-indigo-600 shadow-lg shadow-indigo-600/30 transition-all cursor-pointer whitespace-nowrap"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Fetching...</span>
                  </>
                ) : (
                  <>
                    <span>Fetch Commits</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Advanced Branch Input */}
        {showAdvanced && (
          <div className="mt-2.5 p-3 bg-slate-900/90 border border-slate-800 rounded-xl flex items-center gap-3 text-xs animate-in slide-in-from-top-1 duration-200">
            <span className="text-slate-400 flex items-center gap-1">
              <GitBranch className="w-3.5 h-3.5 text-indigo-400" /> Target Branch / Tag:
            </span>
            <input
              type="text"
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              placeholder="e.g. main, dev, v2.0 (leave blank for default)"
              className="flex-1 bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-lg px-2.5 py-1 text-slate-200 text-xs font-mono"
            />
            {branch && (
              <button
                type="button"
                onClick={() => setBranch('')}
                className="text-slate-400 hover:text-white text-xs underline"
              >
                Reset to default
              </button>
            )}
          </div>
        )}
      </form>

      {/* Error / Rate Limit Banner */}
      {error && (
        <div className="mt-3 p-4 bg-rose-950/40 border border-rose-800/60 rounded-xl text-rose-300 text-xs flex items-start gap-3 animate-in fade-in">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold text-rose-200">{error}</p>
            {rateLimited && (
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={onOpenTokenModal}
                  className="px-3 py-1 bg-rose-900/60 hover:bg-rose-800/80 text-white rounded-lg text-xs font-medium border border-rose-700/50 transition-colors"
                >
                  Enter GitHub Token
                </button>
                <span className="text-rose-400">or try a curated preset repository below:</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Instant Presets / Quick Explore */}
      <div className="mt-3.5 flex flex-wrap items-center gap-2 text-xs">
        <span className="text-slate-500 flex items-center gap-1 font-medium">
          <Compass className="w-3.5 h-3.5 text-indigo-400" /> Instant Samples:
        </span>
        {SAMPLE_REPOSITORIES.map((sample) => (
          <button
            key={sample.id}
            type="button"
            onClick={() => onSelectSample(sample)}
            className="group flex items-center gap-1.5 px-3 py-1 bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-indigo-500/40 rounded-full text-slate-300 hover:text-white transition-all cursor-pointer shadow-sm"
          >
            <span className="font-medium">{sample.fullName}</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 group-hover:bg-indigo-500/20">
              {sample.badge}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
