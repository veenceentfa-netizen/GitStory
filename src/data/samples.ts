import { CommitItem, RepoInfo } from '../types';

export interface SampleRepo {
  id: string;
  name: string;
  fullName: string;
  badge: string;
  description: string;
  repoInfo: RepoInfo;
  commits: CommitItem[];
}

export const SAMPLE_REPOSITORIES: SampleRepo[] = [
  {
    id: 'shadcn-ui',
    name: 'ui',
    fullName: 'shadcn-ui/ui',
    badge: 'Popular UI System',
    description: 'Beautifully designed components that you can copy and paste into your apps. Accessible. Customizable. Open Source.',
    repoInfo: {
      owner: 'shadcn-ui',
      name: 'ui',
      fullName: 'shadcn-ui/ui',
      description: 'Beautifully designed components that you can copy and paste into your apps. Accessible. Customizable. Open Source.',
      stars: 76420,
      forks: 6810,
      defaultBranch: 'main',
      language: 'TypeScript',
      avatarUrl: 'https://avatars.githubusercontent.com/u/139895814?s=200&v=4',
      htmlUrl: 'https://github.com/shadcn-ui/ui',
    },
    commits: [
      {
        sha: '9f2a71d84a32b1e0f6c4d7b8a1c9e2f4a5b6c7d8',
        shortSha: '9f2a71d',
        message: 'feat(sidebar): add collapsible sidebar component with responsive mobile drawer support\n\nSupports persistent state via cookies, keyboard navigation (cmd+b), and smooth spring layout transitions.',
        author: { name: 'shadcn', username: 'shadcn', avatarUrl: 'https://avatars.githubusercontent.com/u/124599?v=4' },
        date: '2026-09-28T14:32:00Z',
        htmlUrl: 'https://github.com/shadcn-ui/ui/commit/9f2a71d',
      },
      {
        sha: '7a1e4c9b2d3f5a8e1c6b4d7e9f0a2b4c6d8e0f1a',
        shortSha: '7a1e4c9',
        message: 'feat(chart): introduce interactive radar and polar area charts with recharts v2.14 integration\n\nIncludes custom tooltip themes and accessibility ARIA labels for screen readers.',
        author: { name: 'shadcn', username: 'shadcn', avatarUrl: 'https://avatars.githubusercontent.com/u/124599?v=4' },
        date: '2026-09-27T10:15:00Z',
        htmlUrl: 'https://github.com/shadcn-ui/ui/commit/7a1e4c9',
      },
      {
        sha: '4b8d2f1e9c7a5b3d6f0e8a2c4e6b1d9f7a3c5e2b',
        shortSha: '4b8d2f1',
        message: 'perf(cli): optimize template extraction speed by 4x using concurrent asset streaming\n\nReduces component install command wait times from 1.8s down to ~400ms.',
        author: { name: 'leerob', username: 'leerob', avatarUrl: 'https://avatars.githubusercontent.com/u/9113740?v=4' },
        date: '2026-09-26T16:45:00Z',
        htmlUrl: 'https://github.com/shadcn-ui/ui/commit/4b8d2f1',
      },
      {
        sha: '1c5e9a3b7d2f4e8c0a6b8d1f3e5a7c9b2d4f6e8a',
        shortSha: '1c5e9a3',
        message: 'fix(dialog): prevent background scroll lock leak when multiple stacked modals close\n\nRestores body scroll position cleanly and handles rapid ESC key presses gracefully.',
        author: { name: 'colinhacks', username: 'colinhacks', avatarUrl: 'https://avatars.githubusercontent.com/u/308178?v=4' },
        date: '2026-09-25T11:20:00Z',
        htmlUrl: 'https://github.com/shadcn-ui/ui/commit/1c5e9a3',
      },
      {
        sha: '8e2c4a6b0d9f1e3a5c7b9d2e4f6a8c0b2d4e6f8a',
        shortSha: '8e2c4a6',
        message: 'feat(theme): add OKLCH color space theme generators for higher chroma fidelity across displays',
        author: { name: 'shadcn', username: 'shadcn', avatarUrl: 'https://avatars.githubusercontent.com/u/124599?v=4' },
        date: '2026-09-24T09:10:00Z',
        htmlUrl: 'https://github.com/shadcn-ui/ui/commit/8e2c4a6',
      },
      {
        sha: '3f9a1b5c7d2e4f6a8c0b2d4e6f8a1c3e5a7b9d2e',
        shortSha: '3f9a1b5',
        message: 'docs: update registry schema definitions and add automated live interactive preview sandboxes',
        author: { name: 'pacocoursey', username: 'pacocoursey', avatarUrl: 'https://avatars.githubusercontent.com/u/1863771?v=4' },
        date: '2026-09-23T18:05:00Z',
        htmlUrl: 'https://github.com/shadcn-ui/ui/commit/3f9a1b5',
      },
    ],
  },
  {
    id: 'tailwind-v4',
    name: 'tailwindcss',
    fullName: 'tailwindlabs/tailwindcss',
    badge: 'Next-Gen Engine',
    description: 'A utility-first CSS framework for rapid UI development. Re-engineered from the ground up for speed.',
    repoInfo: {
      owner: 'tailwindlabs',
      name: 'tailwindcss',
      fullName: 'tailwindlabs/tailwindcss',
      description: 'A utility-first CSS framework for rapid UI development.',
      stars: 84100,
      forks: 4320,
      defaultBranch: 'main',
      language: 'Rust / TypeScript',
      avatarUrl: 'https://avatars.githubusercontent.com/u/67104415?s=200&v=4',
      htmlUrl: 'https://github.com/tailwindlabs/tailwindcss',
    },
    commits: [
      {
        sha: 'e5b7c1a9d3f2e4b6a8c0d2f4e6b8a1c3e5a7b9d2',
        shortSha: 'e5b7c1a',
        message: 'feat: native CSS-first configuration via @theme directive\n\nEliminates tailwind.config.js in favor of standard CSS variables and syntax.',
        author: { name: 'Adam Wathan', username: 'adamwathan', avatarUrl: 'https://avatars.githubusercontent.com/u/4323180?v=4' },
        date: '2026-09-28T12:00:00Z',
        htmlUrl: 'https://github.com/tailwindlabs/tailwindcss/commit/e5b7c1a',
      },
      {
        sha: 'a2f4e6b8a1c3e5a7b9d2e4f6a8c0d2f4e5b7c1a9',
        shortSha: 'a2f4e6b',
        message: 'perf(oxide): compile engine rewrite in Rust yielding 10x faster initial builds\n\nBenchmarks show full cold build in <15ms for enterprise projects.',
        author: { name: 'Robin Malfait', username: 'RobinMalfait', avatarUrl: 'https://avatars.githubusercontent.com/u/1834413?v=4' },
        date: '2026-09-27T15:20:00Z',
        htmlUrl: 'https://github.com/tailwindlabs/tailwindcss/commit/a2f4e6b',
      },
      {
        sha: 'd1c3e5a7b9d2e4f6a8c0d2f4e5b7c1a9a2f4e6b8',
        shortSha: 'd1c3e5a',
        message: 'feat(variants): add support for 3D transforms, container queries, and @starting-style animations without plugins',
        author: { name: 'Jordan Pittman', username: 'jordanpittman', avatarUrl: 'https://avatars.githubusercontent.com/u/1058211?v=4' },
        date: '2026-09-26T09:40:00Z',
        htmlUrl: 'https://github.com/tailwindlabs/tailwindcss/commit/d1c3e5a',
      },
      {
        sha: 'c4e6b8a1c3e5a7b9d2e4f6a8c0d2f4e5b7c1a9a2',
        shortSha: 'c4e6b8a',
        message: 'fix(lightningcss): preserve vendor prefixes for legacy Safari gradient masks',
        author: { name: 'Robin Malfait', username: 'RobinMalfait', avatarUrl: 'https://avatars.githubusercontent.com/u/1834413?v=4' },
        date: '2026-09-25T14:15:00Z',
        htmlUrl: 'https://github.com/tailwindlabs/tailwindcss/commit/c4e6b8a',
      },
    ],
  },
  {
    id: 'vite',
    name: 'vite',
    fullName: 'vitejs/vite',
    badge: 'Lightning Bundler',
    description: 'Next Generation Frontend Tooling. Instant Server Start, Lightning Fast HMR, Rich Features.',
    repoInfo: {
      owner: 'vitejs',
      name: 'vite',
      fullName: 'vitejs/vite',
      description: 'Next Generation Frontend Tooling. It is fast.',
      stars: 71200,
      forks: 6150,
      defaultBranch: 'main',
      language: 'TypeScript',
      avatarUrl: 'https://avatars.githubusercontent.com/u/65625612?s=200&v=4',
      htmlUrl: 'https://github.com/vitejs/vite',
    },
    commits: [
      {
        sha: 'b8a1c3e5a7b9d2e4f6a8c0d2f4e5b7c1a9a2f4e6',
        shortSha: 'b8a1c3e',
        message: 'feat(core): introduce Environment API for multi-runtime SSR (workers, edge, browser)\n\nAllows plugins to manage isolated modules across server and client graph simultaneously.',
        author: { name: 'Evan You', username: 'yyx990803', avatarUrl: 'https://avatars.githubusercontent.com/u/499550?v=4' },
        date: '2026-09-28T08:30:00Z',
        htmlUrl: 'https://github.com/vitejs/vite/commit/b8a1c3e',
      },
      {
        sha: '6a8c0d2f4e5b7c1a9a2f4e6b8a1c3e5a7b9d2e4f',
        shortSha: '6a8c0d2',
        message: 'perf(hmr): hot module replacement latency dropped to sub-5ms with incremental AST cache',
        author: { name: 'sapphi-red', username: 'sapphi-red', avatarUrl: 'https://avatars.githubusercontent.com/u/49056869?v=4' },
        date: '2026-09-27T17:50:00Z',
        htmlUrl: 'https://github.com/vitejs/vite/commit/6a8c0d2',
      },
      {
        sha: 'f4e5b7c1a9a2f4e6b8a1c3e5a7b9d2e4f6a8c0d2',
        shortSha: 'f4e5b7c',
        message: 'fix(deps): correct module pre-bundling resolution for subpath exports in PNPM monorepos',
        author: { name: 'patak', username: 'patak-dev', avatarUrl: 'https://avatars.githubusercontent.com/u/4232207?v=4' },
        date: '2026-09-26T13:10:00Z',
        htmlUrl: 'https://github.com/vitejs/vite/commit/f4e5b7c',
      },
    ],
  },
];
