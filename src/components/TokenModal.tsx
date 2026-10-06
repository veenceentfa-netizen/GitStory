import React, { useState } from 'react';
import { Key, X, Check, ExternalLink, ShieldCheck, AlertCircle } from 'lucide-react';

interface TokenModalProps {
  isOpen: boolean;
  onClose: () => void;
  token: string;
  onSaveToken: (token: string) => void;
}

export const TokenModal: React.FC<TokenModalProps> = ({
  isOpen,
  onClose,
  token,
  onSaveToken,
}) => {
  const [val, setVal] = useState(token);
  const [saved, setSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveToken(val.trim());
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 600);
  };

  const handleClear = () => {
    setVal('');
    onSaveToken('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
        
        <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">GitHub Access Token</h3>
              <p className="text-xs text-slate-400">Optional: For private repos & higher rate limits</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-5 space-y-4 text-sm text-slate-300">
          <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl space-y-2">
            <div className="flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
              <p className="text-xs text-slate-300 leading-relaxed">
                By default, GitStory uses GitHub’s public API (60 req/hr). Adding a fine-grained or classic token raises your limit to <strong>5,000 req/hr</strong> and lets you summarize <strong>private repos</strong>.
              </p>
            </div>
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
              <p className="text-xs text-slate-400 leading-relaxed">
                Your token is stored safely in your browser’s local storage and is only passed via backend proxy to GitHub. Only read-only repository permissions (<code className="text-indigo-300">repo:read</code>) are required.
              </p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Personal Access Token (classic or fine-grained)
            </label>
            <input
              type="password"
              value={val}
              onChange={(e) => setVal(e.target.value)}
              placeholder="ghp_xxxxxxxxxxxxxxxxxxxx or github_pat_..."
              className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-600 font-mono"
            />
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <a
              href="https://github.com/settings/tokens"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-indigo-400 hover:text-indigo-300 hover:underline"
            >
              Generate token on GitHub <ExternalLink className="w-3 h-3" />
            </a>
            {val && (
              <button
                type="button"
                onClick={handleClear}
                className="text-rose-400 hover:text-rose-300 hover:underline"
              >
                Clear Token
              </button>
            )}
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm text-slate-400 hover:text-white hover:bg-slate-800/80 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex items-center gap-2 px-5 py-2 text-sm font-medium bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-lg shadow-indigo-600/20 transition-all cursor-pointer"
          >
            {saved ? (
              <>
                <Check className="w-4 h-4 text-emerald-300" />
                Saved!
              </>
            ) : (
              'Save Token'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
