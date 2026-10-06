import React, { useState, useMemo } from 'react';
import { 
  GitCommit, 
  Star, 
  GitFork, 
  ExternalLink, 
  CheckSquare, 
  Square, 
  Filter, 
  Search, 
  ChevronDown, 
  ChevronUp, 
  User, 
  Calendar,
  Layers,
  Sparkles
} from 'lucide-react';
import { CommitItem, RepoInfo } from '../types';
import { classifyCommit, getCategoryBadge, formatRelativeDate } from '../utils/markdown';

interface CommitTimelineProps {
  repoInfo: RepoInfo;
  commits: CommitItem[];
  onToggleCommit: (sha: string) => void;
  onSelectAll: (select: boolean) => void;
  onSelectFeaturesOnly: () => void;
}

export const CommitTimeline: React.FC<CommitTimelineProps> = ({
  repoInfo,
  commits,
  onToggleCommit,
  onSelectAll,
  onSelectFeaturesOnly,
}) => {
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [expandedSha, setExpandedSha] = useState<string | null>(null);

  // Categorize commits on the fly if not set
  const processedCommits = useMemo(() => {
    return commits.map((c) => ({
      ...c,
      category: c.category || classifyCommit(c.message),
    }));
  }, [commits]);

  // Filtered commits
  const filteredCommits = useMemo(() => {
    return processedCommits.filter((c) => {
      const matchesSearch = 
        c.message.toLowerCase().includes(search.toLowerCase()) ||
        c.author.name.toLowerCase().includes(search.toLowerCase()) ||
        c.shortSha.toLowerCase().includes(search.toLowerCase());

      const matchesCat = 
        filterCategory === 'all' || 
        c.category === filterCategory;

      return matchesSearch && matchesCat;
    });
  }, [processedCommits, search, filterCategory]);

  const selectedCount = commits.filter((c) => c.selected !== false).length;
  const isAllSelected = selectedCount === commits.length;

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
      {/* Repo Header Summary */}
      <div className="p-5 border-b border-slate-800 bg-gradient-to-b from-slate-900 to-slate-950">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            {repoInfo.avatarUrl ? (
              <img
                src={repoInfo.avatarUrl}
                alt={repoInfo.owner}
                className="w-12 h-12 rounded-xl border border-slate-700 object-cover shadow-sm"
              />
            ) : (
              <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400">
                <GitCommit className="w-6 h-6" />
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white font-heading">
                  {repoInfo.fullName}
                </h2>
                <a
                  href={repoInfo.htmlUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-slate-400 hover:text-indigo-400 transition-colors"
                  title="View on GitHub"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
              <p className="text-xs text-slate-400 line-clamp-1 mt-0.5 max-w-xl">
                {repoInfo.description}
              </p>
            </div>
          </div>

          {/* Repo Badges */}
          <div className="flex items-center gap-3 text-xs text-slate-300">
            <div className="flex items-center gap-1 px-2.5 py-1 bg-slate-950 border border-slate-800 rounded-lg">
              <Star className="w-3.5 h-3.5 text-amber-400" />
              <span>{repoInfo.stars.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1 px-2.5 py-1 bg-slate-950 border border-slate-800 rounded-lg">
              <GitFork className="w-3.5 h-3.5 text-slate-400" />
              <span>{repoInfo.forks.toLocaleString()}</span>
            </div>
            <div className="px-2.5 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 rounded-lg font-medium">
              {repoInfo.language}
            </div>
          </div>
        </div>

        {/* Filter and Selection Toolbar */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter commits by message or author..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Quick Selection Actions */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => onSelectAll(!isAllSelected)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium bg-slate-950 hover:bg-slate-800 text-slate-300 rounded-lg border border-slate-800 transition-colors"
            >
              {isAllSelected ? <Square className="w-3.5 h-3.5 text-indigo-400" /> : <CheckSquare className="w-3.5 h-3.5 text-indigo-400" />}
              {isAllSelected ? 'Deselect All' : 'Select All'}
            </button>

            <button
              type="button"
              onClick={onSelectFeaturesOnly}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 rounded-lg border border-emerald-500/20 transition-colors"
            >
              <Sparkles className="w-3 h-3 text-emerald-400" />
              Features & Fixes Only
            </button>

            <div className="px-2.5 py-1 text-xs text-slate-400 bg-slate-950 border border-slate-800 rounded-lg">
              <strong className="text-white">{selectedCount}</strong> of {commits.length} chosen
            </div>
          </div>
        </div>
      </div>

      {/* Commits List */}
      <div className="max-h-[500px] overflow-y-auto divide-y divide-slate-800/60 p-2">
        {filteredCommits.length === 0 ? (
          <div className="py-12 text-center text-slate-500 text-xs">
            No commits match your filter criteria.
          </div>
        ) : (
          filteredCommits.map((commit) => {
            const isSelected = commit.selected !== false;
            const badge = getCategoryBadge(commit.category);
            const lines = (commit.message || '').split('\n');
            const title = lines[0] || '';
            const body = lines.slice(1).join('\n').trim();
            const isExpanded = expandedSha === commit.sha;

            return (
              <div
                key={commit.sha}
                className={`group flex items-start gap-3 p-3 rounded-xl transition-all ${
                  isSelected
                    ? 'hover:bg-slate-800/50 bg-slate-900/30'
                    : 'opacity-40 hover:opacity-75 bg-slate-950/20'
                }`}
              >
                {/* Selection Checkbox */}
                <button
                  type="button"
                  onClick={() => onToggleCommit(commit.sha)}
                  className="mt-0.5 text-slate-500 group-hover:text-indigo-400 transition-colors focus:outline-none"
                  title={isSelected ? 'Exclude from story' : 'Include in story'}
                >
                  {isSelected ? (
                    <CheckSquare className="w-4 h-4 text-indigo-500" />
                  ) : (
                    <Square className="w-4 h-4 text-slate-600" />
                  )}
                </button>

                {/* Author Avatar */}
                <div className="relative shrink-0 mt-0.5">
                  {commit.author.avatarUrl ? (
                    <img
                      src={commit.author.avatarUrl}
                      alt={commit.author.name}
                      className="w-7 h-7 rounded-full border border-slate-700 object-cover"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 text-xs">
                      <User className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>

                {/* Commit Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span
                      className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold border ${badge.bg} ${badge.color} ${badge.border}`}
                    >
                      {badge.label}
                    </span>

                    <a
                      href={commit.htmlUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="font-mono text-[11px] text-indigo-400 hover:text-indigo-300 hover:underline flex items-center gap-1"
                    >
                      {commit.shortSha}
                    </a>

                    <span className="text-[11px] text-slate-400">by</span>
                    <span className="text-[11px] font-medium text-slate-300">
                      {commit.author.name}
                    </span>

                    <span className="text-[11px] text-slate-500 flex items-center gap-1 ml-auto">
                      <Calendar className="w-3 h-3" />
                      {formatRelativeDate(commit.date)}
                    </span>
                  </div>

                  {/* Message Title */}
                  <div className="text-xs font-medium text-slate-200 break-words leading-snug">
                    {title}
                  </div>

                  {/* Body Expandable */}
                  {body && (
                    <div className="mt-1.5">
                      <button
                        type="button"
                        onClick={() => setExpandedSha(isExpanded ? null : commit.sha)}
                        className="text-[11px] text-indigo-400 hover:text-indigo-300 inline-flex items-center gap-1 font-medium"
                      >
                        {isExpanded ? (
                          <>
                            <ChevronUp className="w-3 h-3" /> Hide details
                          </>
                        ) : (
                          <>
                            <ChevronDown className="w-3 h-3" /> View commit details
                          </>
                        )}
                      </button>
                      {isExpanded && (
                        <pre className="mt-2 p-2 bg-slate-950 border border-slate-800 rounded-lg text-[11px] text-slate-400 font-mono whitespace-pre-wrap">
                          {body}
                        </pre>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
