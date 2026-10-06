import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { 
  Sparkles, 
  GitBranch, 
  Rocket, 
  ArrowDown, 
  Layers, 
  FileCode2, 
  BookOpen, 
  CheckCircle2, 
  Zap,
  Github
} from 'lucide-react';
import { Navbar } from './components/Navbar';
import { RepoInput } from './components/RepoInput';
import { CommitTimeline } from './components/CommitTimeline';
import { StoryConfigPanel } from './components/StoryConfigPanel';
import { StoryOutput } from './components/StoryOutput';
import { TokenModal } from './components/TokenModal';
import { HistoryDrawer } from './components/HistoryDrawer';
import { SAMPLE_REPOSITORIES, SampleRepo } from './data/samples';
import { CommitItem, RepoInfo, StoryOptions, StoryResult, StoryTone } from './types';

const STORAGE_KEY_TOKEN = 'gitstory_github_token';
const STORAGE_KEY_HISTORY = 'gitstory_stories_history';

export default function App() {
  // Input states
  const [url, setUrl] = useState('shadcn-ui/ui');
  const [branch, setBranch] = useState('');
  const [commitLimit, setCommitLimit] = useState(30);

  // Data states
  const [repoInfo, setRepoInfo] = useState<RepoInfo | null>(null);
  const [commits, setCommits] = useState<CommitItem[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rateLimited, setRateLimited] = useState(false);

  // Story options
  const [options, setOptions] = useState<StoryOptions>({
    tone: 'product-launch',
    targetAudience: 'Users & Customers',
    releaseVersion: 'v2.0 (Spring Release)',
    format: 'blog-post',
    customInstructions: '',
  });

  // Current Story & History
  const [currentStory, setCurrentStory] = useState<StoryResult | null>(null);
  const [history, setHistory] = useState<StoryResult[]>([]);

  // Modals & Drawers
  const [token, setToken] = useState<string>('');
  const [isTokenModalOpen, setIsTokenModalOpen] = useState(false);
  const [isHistoryDrawerOpen, setIsHistoryDrawerOpen] = useState(false);

  const storyOutputRef = useRef<HTMLDivElement>(null);

  // Load token & history from localStorage and initialize with sample preset
  useEffect(() => {
    try {
      const savedToken = localStorage.getItem(STORAGE_KEY_TOKEN);
      if (savedToken) setToken(savedToken);

      const savedHistory = localStorage.getItem(STORAGE_KEY_HISTORY);
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }

    // Default to the first sample repo so user sees instant value
    const defaultSample = SAMPLE_REPOSITORIES[0];
    setRepoInfo(defaultSample.repoInfo);
    setCommits(defaultSample.commits.map((c) => ({ ...c, selected: true })));
  }, []);

  // Save history to localStorage
  const saveToHistory = (newStory: StoryResult) => {
    setHistory((prev) => {
      const updated = [newStory, ...prev.filter((item) => item.id !== newStory.id)].slice(0, 20);
      try {
        localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(updated));
      } catch (e) {
        console.warn('Could not save history to localStorage', e);
      }
      return updated;
    });
  };

  const handleSaveToken = (newToken: string) => {
    setToken(newToken);
    try {
      if (newToken) {
        localStorage.setItem(STORAGE_KEY_TOKEN, newToken);
      } else {
        localStorage.removeItem(STORAGE_KEY_TOKEN);
      }
    } catch (e) {
      console.warn('LocalStorage token error:', e);
    }
  };

  const handleDeleteHistoryItem = (id: string) => {
    setHistory((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      try {
        localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(updated));
      } catch (e) {
        console.warn(e);
      }
      return updated;
    });
  };

  const handleClearAllHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem(STORAGE_KEY_HISTORY);
    } catch (e) {
      console.warn(e);
    }
  };

  // Fetch commits from backend API
  const handleFetchCommits = async () => {
    if (!url.trim()) return;
    setIsFetching(true);
    setError(null);
    setRateLimited(false);

    try {
      const response = await fetch('/api/github/fetch-commits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: url.trim(),
          branch: branch.trim() || undefined,
          perPage: commitLimit,
          token: token.trim() || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to fetch GitHub commits');
        if (data.rateLimited) {
          setRateLimited(true);
        }
        setIsFetching(false);
        return;
      }

      setRepoInfo(data.repoInfo);
      setCommits((data.commits || []).map((c: CommitItem) => ({ ...c, selected: true })));
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Network error while contacting GitStory server');
    } finally {
      setIsFetching(false);
    }
  };

  // Select Sample Repository
  const handleSelectSample = (sample: SampleRepo) => {
    setUrl(sample.fullName);
    setBranch('');
    setError(null);
    setRateLimited(false);
    setRepoInfo(sample.repoInfo);
    setCommits(sample.commits.map((c) => ({ ...c, selected: true })));
  };

  // Toggle commit selection
  const handleToggleCommit = (sha: string) => {
    setCommits((prev) =>
      prev.map((c) => (c.sha === sha ? { ...c, selected: !c.selected } : c))
    );
  };

  const handleSelectAll = (select: boolean) => {
    setCommits((prev) => prev.map((c) => ({ ...c, selected: select })));
  };

  const handleSelectFeaturesOnly = () => {
    setCommits((prev) =>
      prev.map((c) => {
        const cat = c.category;
        const isImportant = cat === 'feat' || cat === 'fix' || cat === 'perf';
        return { ...c, selected: isImportant };
      })
    );
  };

  // Generate Story with Gemini
  const handleGenerateStory = async () => {
    const selectedCommits = commits.filter((c) => c.selected !== false);
    if (selectedCommits.length === 0) {
      setError('Please select at least 1 commit to generate a story.');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch('/api/generate-story', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          repoInfo,
          commits: selectedCommits,
          options,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate product story with Gemini.');
      }

      const newStory: StoryResult = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
        createdAt: new Date().toISOString(),
        repoInfo: repoInfo!,
        markdown: data.markdown,
        meta: data.meta,
        options: { ...options },
        analyzedCommitsCount: data.analyzedCommitsCount,
        modelUsed: data.modelUsed || 'gemini-3.8-flash',
      };

      setCurrentStory(newStory);
      saveToHistory(newStory);

      // Trigger celebratory confetti
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#6366f1', '#a855f7', '#ec4899', '#38bdf8', '#10b981'],
      });

      // Smooth scroll to output
      setTimeout(() => {
        storyOutputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 150);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error occurred while generating story.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Quick re-generate with a new tone
  const handleRegenerateWithTone = (newTone: StoryTone) => {
    setOptions((prev) => ({ ...prev, tone: newTone }));
    setTimeout(() => {
      handleGenerateStory();
    }, 50);
  };

  const selectedCommitsCount = commits.filter((c) => c.selected !== false).length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar
        onOpenTokenModal={() => setIsTokenModalOpen(true)}
        onOpenHistory={() => setIsHistoryDrawerOpen(true)}
        hasToken={Boolean(token)}
        historyCount={history.length}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 space-y-8">
        
        {/* Hero Section */}
        <section className="text-center max-w-3xl mx-auto space-y-3 pt-2 pb-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-indigo-500/20 text-indigo-300">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>AI-Powered GitHub Changelog & Release Notes Generator</span>
          </div>
          
          <h1 className="text-3xl sm:text-5xl font-black font-heading tracking-tight text-white leading-tight">
            Turn Raw Git Commits into{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400">
              Captivating Product Stories
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-2xl mx-auto">
            Give GitStory any GitHub repository URL. Gemini AI intelligently groups changes, filters technical noise, and crafts polished release notes, marketing updates, or executive briefs.
          </p>
        </section>

        {/* Input Bar */}
        <section className="max-w-4xl mx-auto">
          <RepoInput
            url={url}
            setUrl={setUrl}
            branch={branch}
            setBranch={setBranch}
            commitLimit={commitLimit}
            setCommitLimit={setCommitLimit}
            onFetch={handleFetchCommits}
            isLoading={isFetching}
            onSelectSample={handleSelectSample}
            error={error}
            rateLimited={rateLimited}
            onOpenTokenModal={() => setIsTokenModalOpen(true)}
          />
        </section>

        {/* Main Work Area: Commits Timeline & Story Configuration */}
        {repoInfo && (
          <section className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Left Column: Interactive Commit Timeline (7 cols) */}
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center justify-between text-xs text-slate-400 px-1">
                  <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                    <GitBranch className="w-4 h-4 text-indigo-400" /> 1. Review & Cherry-Pick Commits
                  </span>
                  <span>Uncheck any commits you want excluded</span>
                </div>

                <CommitTimeline
                  repoInfo={repoInfo}
                  commits={commits}
                  onToggleCommit={handleToggleCommit}
                  onSelectAll={handleSelectAll}
                  onSelectFeaturesOnly={handleSelectFeaturesOnly}
                />
              </div>

              {/* Right Column: Story Configuration & Generator (5 cols) */}
              <div className="lg:col-span-5 space-y-4">
                <div className="flex items-center justify-between text-xs text-slate-400 px-1">
                  <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                    <Rocket className="w-4 h-4 text-purple-400" /> 2. Set Tone & Generate
                  </span>
                  <span>Customized by Gemini 3.8 Flash</span>
                </div>

                <StoryConfigPanel
                  options={options}
                  setOptions={setOptions}
                  onGenerate={handleGenerateStory}
                  isGenerating={isGenerating}
                  selectedCommitsCount={selectedCommitsCount}
                />
              </div>

            </div>

            {/* Generated Story Output Section */}
            {currentStory && (
              <div ref={storyOutputRef} className="pt-6 space-y-4 animate-in fade-in duration-300">
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    <h3 className="text-base font-bold text-white font-heading">
                      Generated Product Release Story
                    </h3>
                  </div>
                  <span className="text-xs text-slate-400">
                    Ready to copy, edit, or export
                  </span>
                </div>

                <StoryOutput
                  story={currentStory}
                  onUpdateMarkdown={(newMd) => {
                    setCurrentStory((prev) => (prev ? { ...prev, markdown: newMd } : null));
                  }}
                  onRegenerateWithTone={handleRegenerateWithTone}
                />
              </div>
            )}
          </section>
        )}

      </main>

      {/* Footer */}
      <footer className="mt-20 border-t border-slate-900 bg-slate-950/80 py-8 text-xs text-slate-500 text-center space-y-2">
        <p className="flex items-center justify-center gap-1">
          <span>Built for developers & product teams with</span>
          <span className="text-indigo-400 font-semibold">Gemini 3.8 Flash</span>
        </p>
        <p>GitStory synthesizes commit histories into publish-ready releases in seconds.</p>
      </footer>

      {/* Modals & Slide-out Drawers */}
      <TokenModal
        isOpen={isTokenModalOpen}
        onClose={() => setIsTokenModalOpen(false)}
        token={token}
        onSaveToken={handleSaveToken}
      />

      <HistoryDrawer
        isOpen={isHistoryDrawerOpen}
        onClose={() => setIsHistoryDrawerOpen(false)}
        stories={history}
        onSelectStory={(s) => {
          setCurrentStory(s);
          setRepoInfo(s.repoInfo);
          setTimeout(() => {
            storyOutputRef.current?.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        }}
        onDeleteStory={handleDeleteHistoryItem}
        onClearAll={handleClearAllHistory}
      />
    </div>
  );
}
