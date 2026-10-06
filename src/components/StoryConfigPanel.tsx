import React from 'react';
import { 
  Sparkles, 
  Rocket, 
  Briefcase, 
  Cpu, 
  Newspaper, 
  Share2, 
  Users, 
  Tag, 
  FileText, 
  Loader2,
  Wand2
} from 'lucide-react';
import { StoryOptions, StoryTone } from '../types';

interface StoryConfigPanelProps {
  options: StoryOptions;
  setOptions: React.Dispatch<React.SetStateAction<StoryOptions>>;
  onGenerate: () => void;
  isGenerating: boolean;
  selectedCommitsCount: number;
}

interface ToneDefinition {
  id: StoryTone;
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
}

const TONES: ToneDefinition[] = [
  {
    id: 'product-launch',
    title: 'Product Launch',
    subtitle: 'Exciting, benefits-driven, marketing changelog for users & customers',
    icon: Rocket,
    accentColor: 'from-amber-500 to-orange-500',
  },
  {
    id: 'executive',
    title: 'Executive Brief',
    subtitle: 'Strategic ROI, milestones, reliability & roadmap progress for leaders',
    icon: Briefcase,
    accentColor: 'from-blue-500 to-indigo-500',
  },
  {
    id: 'tech-deep-dive',
    title: 'Tech Deep Dive',
    subtitle: 'Architecture, internal mechanics, breaking changes & API design',
    icon: Cpu,
    accentColor: 'from-purple-500 to-violet-500',
  },
  {
    id: 'newsletter',
    title: 'Newsletter Edition',
    subtitle: 'Narrative arc, community highlights & behind-the-scenes dev story',
    icon: Newspaper,
    accentColor: 'from-emerald-500 to-teal-500',
  },
  {
    id: 'social-thread',
    title: 'Social Release Thread',
    subtitle: 'Punchy hooks, emoji bullet points, ready to post on X or LinkedIn',
    icon: Share2,
    accentColor: 'from-pink-500 to-rose-500',
  },
];

export const StoryConfigPanel: React.FC<StoryConfigPanelProps> = ({
  options,
  setOptions,
  onGenerate,
  isGenerating,
  selectedCommitsCount,
}) => {
  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Wand2 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white font-heading">
              Story Tone & Style Configuration
            </h3>
            <p className="text-xs text-slate-400">
              Customize how Gemini AI translates technical commits into a story
            </p>
          </div>
        </div>

        <div className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-xs font-semibold text-indigo-300 flex items-center gap-1.5">
          <Sparkles className="w-3 h-3 text-indigo-400" />
          <span>Gemini 3.8 Flash</span>
        </div>
      </div>

      {/* Tone Selection Cards */}
      <div>
        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2.5">
          Select Story Persona
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {TONES.map((t) => {
            const Icon = t.icon;
            const isSelected = options.tone === t.id;

            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setOptions((prev) => ({ ...prev, tone: t.id }))}
                className={`relative text-left p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-slate-800/90 border-indigo-500 shadow-md shadow-indigo-500/10 ring-1 ring-indigo-500/50'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center text-white bg-gradient-to-tr ${t.accentColor}`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    {isSelected && (
                      <span className="w-2 h-2 rounded-full bg-indigo-400 shadow-sm shadow-indigo-400" />
                    )}
                  </div>
                  <div className="text-xs font-bold text-white mb-1">
                    {t.title}
                  </div>
                  <p className="text-[11px] text-slate-400 leading-snug">
                    {t.subtitle}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid of Audience & Version Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Target Audience */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-indigo-400" /> Target Audience
          </label>
          <select
            value={options.targetAudience}
            onChange={(e) => setOptions((prev) => ({ ...prev, targetAudience: e.target.value }))}
            className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
          >
            <option value="Users & Customers">Users & Customers (Benefit-driven)</option>
            <option value="Developers & Engineers">Developers & Engineers (Technical & Code)</option>
            <option value="Stakeholders & Leadership">Leadership & Stakeholders (High-level ROI)</option>
            <option value="Open Source Community">Open Source Community (Collaborative & Welcoming)</option>
          </select>
        </div>

        {/* Release Version / Sprint Title */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-indigo-400" /> Release Version / Title (Optional)
            </span>
            <button
              type="button"
              onClick={() => {
                const date = new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
                setOptions((prev) => ({ ...prev, releaseVersion: `Release v${(Math.random() * 2 + 1).toFixed(1)}.0 (${date})` }));
              }}
              className="text-[10px] text-indigo-400 hover:text-indigo-300 underline"
            >
              Auto-suggest
            </button>
          </label>
          <input
            type="text"
            value={options.releaseVersion}
            onChange={(e) => setOptions((prev) => ({ ...prev, releaseVersion: e.target.value }))}
            placeholder="e.g. v2.4.0 (Spring Launch) or Sprint 32"
            className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none font-mono"
          />
        </div>
      </div>

      {/* Custom Instructions */}
      <div>
        <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
          <FileText className="w-3.5 h-3.5 text-indigo-400" /> Custom Instructions or Highlights (Optional)
        </label>
        <textarea
          value={options.customInstructions || ''}
          onChange={(e) => setOptions((prev) => ({ ...prev, customInstructions: e.target.value }))}
          placeholder="e.g. Highlight the 4x performance gain in the CLI, mention the new dark mode theme, and add a friendly call for contributors..."
          rows={2}
          className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl p-3 text-xs text-white placeholder-slate-600 focus:outline-none resize-none"
        />
      </div>

      {/* Primary Action Button */}
      <div className="pt-2">
        <button
          type="button"
          disabled={isGenerating || selectedCommitsCount === 0}
          onClick={onGenerate}
          className="w-full flex items-center justify-center gap-3 py-3.5 px-6 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500 disabled:opacity-50 shadow-xl shadow-indigo-600/25 transition-all cursor-pointer group"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin text-white" />
              <span>Synthesizing Commits with Gemini 3.8 Flash...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 text-yellow-300 group-hover:scale-110 transition-transform" />
              <span>
                Generate Story from {selectedCommitsCount} {selectedCommitsCount === 1 ? 'Commit' : 'Commits'}
              </span>
            </>
          )}
        </button>
      </div>

    </div>
  );
};
