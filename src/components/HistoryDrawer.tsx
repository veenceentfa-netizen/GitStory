import React from 'react';
import { X, Trash2, Calendar, GitCommit, ArrowRight, ExternalLink } from 'lucide-react';
import { StoryResult } from '../types';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  stories: StoryResult[];
  onSelectStory: (story: StoryResult) => void;
  onDeleteStory: (id: string) => void;
  onClearAll: () => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  stories,
  onSelectStory,
  onDeleteStory,
  onClearAll,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-slate-900 border-l border-slate-800 h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white font-heading">
              Story History ({stories.length})
            </h3>
            <p className="text-xs text-slate-400">Previously generated product stories</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List of saved stories */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {stories.length === 0 ? (
            <div className="py-20 text-center text-slate-500 text-xs">
              No saved stories yet. Generate a release story to see it here!
            </div>
          ) : (
            stories.map((item) => (
              <div
                key={item.id}
                className="group p-4 bg-slate-950 border border-slate-800 hover:border-indigo-500/50 rounded-xl transition-all"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    {item.repoInfo.avatarUrl && (
                      <img
                        src={item.repoInfo.avatarUrl}
                        alt=""
                        className="w-5 h-5 rounded-md object-cover"
                      />
                    )}
                    <span className="text-xs font-bold text-white font-mono">
                      {item.repoInfo.fullName}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteStory(item.id);
                    }}
                    className="text-slate-500 hover:text-rose-400 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <h4 className="text-xs font-semibold text-indigo-300 line-clamp-1 mb-1">
                  {item.meta.title || item.options.releaseVersion || 'Product Update'}
                </h4>
                <p className="text-[11px] text-slate-400 line-clamp-2 mb-3">
                  {item.meta.tagline || item.markdown.slice(0, 100)}
                </p>

                <div className="flex items-center justify-between text-[10px] text-slate-500 pt-2 border-t border-slate-800/80">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      onSelectStory(item);
                      onClose();
                    }}
                    className="inline-flex items-center gap-1 text-indigo-400 hover:text-indigo-300 font-semibold cursor-pointer"
                  >
                    <span>View Story</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {stories.length > 0 && (
          <div className="p-4 border-t border-slate-800 flex items-center justify-between">
            <button
              type="button"
              onClick={onClearAll}
              className="text-xs text-rose-400 hover:text-rose-300 underline"
            >
              Clear All History
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 text-xs font-medium bg-slate-800 text-slate-200 hover:text-white rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
