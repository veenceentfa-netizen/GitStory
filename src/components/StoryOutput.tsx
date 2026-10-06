import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  BookOpen, 
  Code2, 
  Share2, 
  Copy, 
  Check, 
  Download, 
  Sparkles, 
  Star, 
  Calendar, 
  Clock, 
  ExternalLink,
  Layers,
  PartyPopper,
  Edit3
} from 'lucide-react';
import { StoryResult } from '../types';
import { renderMarkdownToHtml, estimateReadTime } from '../utils/markdown';

interface StoryOutputProps {
  story: StoryResult;
  onUpdateMarkdown: (newMarkdown: string) => void;
  onRegenerateWithTone: (tone: StoryResult['options']['tone']) => void;
}

export const StoryOutput: React.FC<StoryOutputProps> = ({
  story,
  onUpdateMarkdown,
  onRegenerateWithTone,
}) => {
  const [activeTab, setActiveTab] = useState<'rendered' | 'editor' | 'card' | 'social'>('rendered');
  const [copiedType, setCopiedType] = useState<string | null>(null);

  // Trigger celebration confetti
  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#6366f1', '#a855f7', '#ec4899', '#38bdf8', '#10b981'],
    });
  };

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedType(type);
      setTimeout(() => setCopiedType(null), 2000);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  const handleDownloadMd = () => {
    const blob = new Blob([story.markdown], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${story.repoInfo.name}-release-story.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadHtml = () => {
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${story.meta.title || story.repoInfo.fullName}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; max-width: 800px; margin: 40px auto; padding: 0 20px; line-height: 1.6; color: #1e293b; }
    h1, h2, h3 { color: #0f172a; }
    blockquote { border-left: 4px solid #6366f1; background: #f8fafc; padding: 12px 20px; margin: 20px 0; border-radius: 0 8px 8px 0; }
    code { background: #f1f5f9; padding: 2px 6px; border-radius: 4px; font-family: monospace; }
    pre { background: #0f172a; color: #f8fafc; padding: 16px; border-radius: 8px; overflow-x: auto; }
    pre code { background: transparent; color: inherit; }
  </style>
</head>
<body>
  ${renderMarkdownToHtml(story.markdown)}
</body>
</html>`;
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${story.repoInfo.name}-release-story.html`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Generate a ready-to-post social thread blurb
  const socialSnippet = `🚀 What's New in ${story.repoInfo.fullName} (${story.options.releaseVersion || 'Latest Release'})!

${story.meta.tagline || 'Exciting new features and optimizations just dropped.'}

Key Highlights:
${(story.meta.highlights && story.meta.highlights.length > 0
  ? story.meta.highlights
  : ['Major feature updates', 'Performance improvements', 'Bug fixes & stability']
)
  .slice(0, 4)
  .map((h) => `✨ ${h}`)
  .join('\n')}

Synthesized from ${story.analyzedCommitsCount} commits using Gemini AI.
Full changelog: ${story.repoInfo.htmlUrl}`;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
      {/* Action Header */}
      <div className="p-4 md:p-5 border-b border-slate-800 bg-slate-950 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-xl overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('rendered')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'rendered'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Story Preview</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('editor')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'editor'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Markdown Editor</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('card')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'card'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Visual Card</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('social')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'social'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Social Post</span>
          </button>
        </div>

        {/* Export & Copy Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => copyToClipboard(story.markdown, 'markdown')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg border border-slate-800 transition-colors"
            title="Copy Raw Markdown"
          >
            {copiedType === 'markdown' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-indigo-400" />}
            <span>{copiedType === 'markdown' ? 'Copied MD!' : 'Copy MD'}</span>
          </button>

          <button
            type="button"
            onClick={() => copyToClipboard(renderMarkdownToHtml(story.markdown), 'html')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg border border-slate-800 transition-colors"
            title="Copy HTML"
          >
            {copiedType === 'html' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Code2 className="w-3.5 h-3.5 text-indigo-400" />}
            <span>{copiedType === 'html' ? 'Copied HTML!' : 'Copy HTML'}</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadMd}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg border border-slate-800 transition-colors"
            title="Download .md file"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span>Export .md</span>
          </button>

          <button
            type="button"
            onClick={triggerConfetti}
            className="p-1.5 text-pink-400 hover:text-pink-300 hover:bg-pink-500/10 rounded-lg border border-slate-800 transition-colors"
            title="Celebrate Release!"
          >
            <PartyPopper className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* Meta Bar */}
      <div className="px-5 py-2.5 bg-slate-950/60 border-b border-slate-800/80 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-2">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-indigo-400" />
            {estimateReadTime(story.markdown)}
          </span>
          <span>•</span>
          <span>
            {story.analyzedCommitsCount} commits synthesized
          </span>
          <span>•</span>
          <span className="capitalize text-slate-300">
            Tone: {story.options.tone.replace('-', ' ')}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] text-slate-500">Quick re-tone:</span>
          {story.options.tone !== 'social-thread' && (
            <button
              type="button"
              onClick={() => onRegenerateWithTone('social-thread')}
              className="text-[11px] text-indigo-400 hover:text-indigo-300 underline"
            >
              As Social Thread
            </button>
          )}
          {story.options.tone !== 'executive' && (
            <button
              type="button"
              onClick={() => onRegenerateWithTone('executive')}
              className="text-[11px] text-indigo-400 hover:text-indigo-300 underline"
            >
              As Executive Brief
            </button>
          )}
        </div>
      </div>

      {/* TAB 1: RENDERED STORY PREVIEW */}
      {activeTab === 'rendered' && (
        <div className="p-6 md:p-10 max-h-[750px] overflow-y-auto">
          {/* Tagline / Hook Banner */}
          {story.meta.tagline && (
            <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-indigo-950/60 via-purple-950/40 to-slate-900 border border-indigo-500/20 text-indigo-200 text-sm font-medium leading-relaxed flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block font-heading mb-0.5">
                  {story.meta.title || 'Product Release Story'}
                </strong>
                <span>{story.meta.tagline}</span>
              </div>
            </div>
          )}

          {/* Rendered Markdown Body */}
          <div
            className="prose-story max-w-none"
            dangerouslySetInnerHTML={{ __html: renderMarkdownToHtml(story.markdown) }}
          />
        </div>
      )}

      {/* TAB 2: RAW MARKDOWN EDITOR */}
      {activeTab === 'editor' && (
        <div className="p-6 max-h-[750px] flex flex-col space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Directly edit your markdown before publishing to GitHub Releases or your blog:</span>
            <span>{story.markdown.length} characters</span>
          </div>
          <textarea
            value={story.markdown}
            onChange={(e) => onUpdateMarkdown(e.target.value)}
            className="w-full h-[580px] bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs font-mono text-slate-200 leading-relaxed focus:outline-none focus:border-indigo-500 resize-none"
          />
        </div>
      )}

      {/* TAB 3: VISUAL CARD SHOWCASE */}
      {activeTab === 'card' && (
        <div className="p-6 md:p-10 flex items-center justify-center bg-slate-950/80">
          <div className="w-full max-w-2xl bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/30 rounded-3xl p-7 md:p-9 shadow-2xl relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Top Bar */}
            <div className="flex items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                {story.repoInfo.avatarUrl && (
                  <img
                    src={story.repoInfo.avatarUrl}
                    alt={story.repoInfo.owner}
                    className="w-12 h-12 rounded-2xl border border-indigo-500/30 object-cover"
                  />
                )}
                <div>
                  <h4 className="text-base font-bold text-white font-heading">
                    {story.repoInfo.fullName}
                  </h4>
                  <p className="text-xs text-indigo-300">
                    {story.options.releaseVersion || 'Product Release'}
                  </p>
                </div>
              </div>

              <div className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/30 rounded-full text-xs font-bold text-indigo-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span>GitStory Release</span>
              </div>
            </div>

            {/* Story Title & Hook */}
            <h3 className="text-2xl font-black text-white font-heading tracking-tight mb-3">
              {story.meta.title || 'Next Evolution of the Platform'}
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed mb-6">
              {story.meta.tagline || story.repoInfo.description}
            </p>

            {/* Highlights List */}
            {story.meta.highlights && story.meta.highlights.length > 0 && (
              <div className="space-y-2.5 mb-7">
                <span className="text-xs font-bold tracking-wider text-slate-400 uppercase">
                  Featured Capabilities
                </span>
                <div className="grid grid-cols-1 gap-2">
                  {story.meta.highlights.slice(0, 4).map((h, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-200"
                    >
                      <span className="w-5 h-5 rounded-md bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-[11px] shrink-0">
                        {i + 1}
                      </span>
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Card Footer */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span>{story.analyzedCommitsCount} commits synthesized by Gemini AI</span>
              <span className="font-mono text-indigo-400">{new Date(story.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: SOCIAL SNIPPET */}
      {activeTab === 'social' && (
        <div className="p-6 md:p-8 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-white">Shareable Release Announcement</h4>
              <p className="text-xs text-slate-400">Ready to copy and share on Twitter/X, LinkedIn, or Discord</p>
            </div>
            <button
              type="button"
              onClick={() => copyToClipboard(socialSnippet, 'social')}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-lg transition-colors cursor-pointer"
            >
              {copiedType === 'social' ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4 text-white" />}
              <span>{copiedType === 'social' ? 'Copied Post!' : 'Copy Social Post'}</span>
            </button>
          </div>

          <div className="p-5 bg-slate-950 border border-slate-800 rounded-xl font-mono text-xs text-slate-200 whitespace-pre-wrap leading-relaxed">
            {socialSnippet}
          </div>
        </div>
      )}

    </div>
  );
};
