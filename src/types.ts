export interface CommitAuthor {
  name: string;
  email?: string;
  avatarUrl?: string;
  username?: string;
}

export interface CommitItem {
  sha: string;
  shortSha: string;
  message: string;
  author: CommitAuthor;
  date: string;
  htmlUrl: string;
  selected?: boolean;
  category?: 'feat' | 'fix' | 'refactor' | 'docs' | 'perf' | 'chore' | 'other';
}

export interface RepoInfo {
  owner: string;
  name: string;
  fullName: string;
  description: string;
  stars: number;
  forks: number;
  defaultBranch: string;
  language: string;
  avatarUrl: string;
  htmlUrl: string;
}

export type StoryTone = 'product-launch' | 'executive' | 'tech-deep-dive' | 'newsletter' | 'social-thread';

export interface StoryOptions {
  tone: StoryTone;
  targetAudience: string;
  releaseVersion: string;
  format: 'blog-post' | 'changelog' | 'release-notes';
  customInstructions?: string;
}

export interface StoryMeta {
  title: string;
  tagline: string;
  highlights: string[];
  stats?: {
    featureCount?: number;
    fixCount?: number;
  };
}

export interface StoryResult {
  id: string;
  createdAt: string;
  repoInfo: RepoInfo;
  markdown: string;
  meta: StoryMeta;
  options: StoryOptions;
  analyzedCommitsCount: number;
  modelUsed: string;
}
