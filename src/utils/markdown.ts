import { marked } from 'marked';
import { CommitItem } from '../types';

// Configure marked with sensible defaults
marked.setOptions({
  gfm: true,
  breaks: true,
});

export function renderMarkdownToHtml(markdown: string): string {
  try {
    return marked.parse(markdown) as string;
  } catch (err) {
    console.error('Error parsing markdown:', err);
    return `<p class="text-rose-400">Failed to render markdown preview.</p><pre>${markdown}</pre>`;
  }
}

export function classifyCommit(message: string): CommitItem['category'] {
  const lower = message.toLowerCase().trim();
  if (lower.startsWith('feat') || lower.includes('feature:') || lower.includes('add ')) return 'feat';
  if (lower.startsWith('fix') || lower.includes('bug') || lower.includes('hotfix')) return 'fix';
  if (lower.startsWith('perf') || lower.includes('speed') || lower.includes('optimize')) return 'perf';
  if (lower.startsWith('refactor') || lower.includes('cleanup')) return 'refactor';
  if (lower.startsWith('docs') || lower.includes('readme')) return 'docs';
  if (lower.startsWith('chore') || lower.startsWith('test') || lower.startsWith('ci') || lower.startsWith('build')) return 'chore';
  return 'other';
}

export function getCategoryBadge(category?: CommitItem['category']): { label: string; color: string; border: string; bg: string } {
  switch (category) {
    case 'feat':
      return { label: 'Feature', color: 'text-emerald-400', border: 'border-emerald-500/30', bg: 'bg-emerald-500/10' };
    case 'fix':
      return { label: 'Fix', color: 'text-amber-400', border: 'border-amber-500/30', bg: 'bg-amber-500/10' };
    case 'perf':
      return { label: 'Perf', color: 'text-cyan-400', border: 'border-cyan-500/30', bg: 'bg-cyan-500/10' };
    case 'refactor':
      return { label: 'Refactor', color: 'text-indigo-400', border: 'border-indigo-500/30', bg: 'bg-indigo-500/10' };
    case 'docs':
      return { label: 'Docs', color: 'text-blue-400', border: 'border-blue-500/30', bg: 'bg-blue-500/10' };
    case 'chore':
      return { label: 'Chore', color: 'text-slate-400', border: 'border-slate-700', bg: 'bg-slate-800/40' };
    default:
      return { label: 'Update', color: 'text-violet-400', border: 'border-violet-500/30', bg: 'bg-violet-500/10' };
  }
}

export function formatRelativeDate(isoDate: string): string {
  if (!isoDate) return '';
  try {
    const date = new Date(isoDate);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays === 0) {
      if (diffHours <= 1) return 'Just now';
      return `${diffHours} hours ago`;
    }
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 30) return `${diffDays} days ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return isoDate.split('T')[0] || isoDate;
  }
}

export function estimateReadTime(text: string): string {
  const words = text.trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min read (${words} words)`;
}
