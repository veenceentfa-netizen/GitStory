# GitStory 🚀

> **Turn raw Git commit histories into captivating, publication-ready product release stories with Gemini AI.**

GitStory is a modern full-stack web application designed for developer advocates, product managers, and open-source maintainers. It ingests commit logs from any public or private GitHub repository, filters out technical noise, and leverages **Google Gemini 3.8 Flash** (`@google/genai`) to synthesize code changes into engaging, benefit-driven product updates, executive briefs, or social threads.

---

## 🌟 Key Features

- **GitHub Repository Ingestion**:
  - Accepts full GitHub URLs (`https://github.com/owner/repo`), short identifiers (`owner/repo`), or branch/tag references.
  - Automatic pagination controls (15, 30, 50, 80 commits).
  - Handles rate limits gracefully with an optional personal access token dialog for 5,000 req/hr and private repos.
  - Pre-loaded with instant curated presets (`shadcn-ui/ui`, `tailwindlabs/tailwindcss`, `vitejs/vite`) for zero-friction exploration.

- **Interactive Commit Explorer**:
  - Filter commits by message, author name, or SHA hash.
  - Automatic conventional commit classification (`Feature`, `Fix`, `Perf`, `Refactor`, `Docs`, `Chore`).
  - Cherry-pick commits to include or exclude before generating AI updates.
  - 1-click filters ("Select Features & Fixes Only", "Deselect All", etc.).

- **Multiple Story Personas & Tones**:
  - 🚀 **Product Launch**: High-energy, benefit-driven marketing changelog (think Stripe, Apple, or Vercel).
  - 👔 **Executive Brief**: Strategic velocity, ROI, reliability metrics, and milestone achievements for leadership.
  - 🛠️ **Tech Deep Dive**: Architecture, internal mechanics, breaking changes, and migration guidance for engineers.
  - 🗞️ **Newsletter Edition**: Conversational narrative arc highlighting the sprint journey and community contributors.
  - 🐦 **Social Release Thread**: Punchy hooks, bullet points, and emoji layouts ready for X (Twitter) or LinkedIn.

- **Multi-View Output & Exporting**:
  - **Rendered Story Preview**: Clean custom markdown typography (`prose-story`) with code blocks, badges, callouts, and blockquotes.
  - **Live Markdown Editor**: Edit the generated markdown directly in the app before exporting.
  - **Visual Release Showcase Card**: High-fidelity graphical banner with repository metadata and feature highlights—perfect for screenshots.
  - **Social Post Snippet**: 1-click copy formatted tweet/LinkedIn announcement.
  - **Instant Exports**: Copy Raw Markdown, Copy Rendered HTML, Download `.md`, Download `.html`, and celebratory confetti!
  - **Local Story History**: Auto-saves past stories in browser `localStorage` for future reference.

---

## 🏗️ Architecture & How the Code Works

GitStory is organized as a full-stack TypeScript application with an Express backend proxy and a React 19 SPA frontend powered by Vite and Tailwind CSS v4.

```
┌───────────────────────────────────────────────────────────┐
│                    Client (React 19 SPA)                  │
│                                                           │
│  - RepoInput: URL parsing, instant samples, limit slider   │
│  - CommitTimeline: Cherry-pick commits & search filter    │
│  - StoryConfigPanel: Tone selection & custom instructions │
│  - StoryOutput: Rendered prose, Markdown editor, exports  │
│  - HistoryDrawer & TokenModal                             │
└──────────────────────────┬────────────────────────────────┘
                           │ HTTP REST (JSON)
                           ▼
┌───────────────────────────────────────────────────────────┐
│                    Server (Express.js)                    │
│                                                           │
│  POST /api/github/fetch-commits                           │
│   ├── Validates & extracts { owner, repo }                │
│   ├── Fetches repo metadata from GitHub REST API          │
│   └── Fetches commits with branch/sha & limit             │
│                                                           │
│  POST /api/generate-story                                 │
│   ├── Formats commit stream with short SHAs & authors     │
│   ├── Applies domain prompt with selected Tone & Audience │
│   └── Invokes Gemini 3.8 Flash via @google/genai SDK      │
└──────────────────────────┬────────────────────────────────┘
                           │
                           ▼
┌───────────────────────────────────────────────────────────┐
│                    Google Gemini 3.8 Flash                │
│                                                           │
│  - Synthesizes & groups related commits                   │
│  - Extracts JSON metadata (tagline, highlights, stats)    │
│  - Produces rich, publication-grade Markdown text         │
└───────────────────────────────────────────────────────────┘
```

### 1. Backend Commit Ingestion (`server.ts`)
- **Route**: `POST /api/github/fetch-commits`
- **Logic**:
  - The URL parser regex extracts the owner and repository name from multiple formats (`https://github.com/owner/repo`, `github.com/...`, `owner/repo`, or SSH).
  - Fetches repository metadata (`stargazers_count`, `forks_count`, `default_branch`, `avatar_url`) from `https://api.github.com/repos/{owner}/{repo}`.
  - Fetches recent commits from `https://api.github.com/repos/{owner}/{repo}/commits` based on the specified branch/tag and count.
  - Masks errors gracefully (e.g. rate limit HTTP 403 signals the client to prompt for a GitHub token or use presets).

### 2. Gemini AI Story Generation Engine (`server.ts`)
- **Route**: `POST /api/generate-story`
- **SDK**: Initialized server-side with `@google/genai` using the `gemini-3.8-flash` model:
  ```ts
  import { GoogleGenAI } from '@google/genai';

  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: { 'User-Agent': 'aistudio-build' },
    },
  });
  ```
- **Prompt Engineering**:
  - Rather than summarizing commits line-by-line, the prompt instructs Gemini to **cluster and synthesize** commits into thematic release pillars (e.g., "⚡ Blazing Fast Build Engine", "🎨 Modernized Component Architecture", "🛡️ Rock-Solid Auth").
  - Translates technical implementation details into **user-facing benefits** ("Why it matters").
  - Returns a dual-payload: a structured JSON metadata block (````json_meta ... ````) containing release title, one-sentence punchline, and highlights, followed by the complete Markdown article.

### 3. Client State & Presentation (`src/App.tsx`)
- Orchestrates repository fetching, commit selection toggles, prompt tone modulation, and live markdown preview.
- Markdown rendering is handled by `marked` with custom prose CSS rules in `src/index.css` (`.prose-story`) matching modern developer tools like Linear, GitHub Releases, and Substack.
- Features real-time markdown editing: changes made in the "Markdown Editor" tab update the live preview and export files immediately.
- Client stores personal access tokens and story history locally in `localStorage` without leaking sensitive secrets.

---

## 📂 Project Structure

```
├── .env.example              # Environment variables template
├── metadata.json             # Applet capabilities & metadata
├── package.json              # Full-stack dependencies & scripts
├── index.html                # Entry point with Google Fonts & OG meta
├── server.ts                 # Express backend: GitHub proxy & Gemini API
├── src/
│   ├── main.tsx              # React DOM mounting
│   ├── App.tsx               # Main application orchestration
│   ├── index.css             # Tailwind CSS v4 & prose-story styling
│   ├── types.ts              # TypeScript interfaces (commits, story, tones)
│   ├── data/
│   │   └── samples.ts        # Pre-cached curated presets (shadcn, Tailwind, Vite)
│   ├── utils/
│   │   └── markdown.ts       # Marked HTML renderer & commit classifier
│   └── components/
│       ├── Navbar.tsx        # Brand header, token indicator, history toggle
│       ├── RepoInput.tsx     # URL bar, commit slider, branch & preset buttons
│       ├── CommitTimeline.tsx# Interactive commit selector, search & filters
│       ├── StoryConfigPanel.tsx # Tone cards, audience selector, generate CTA
│       ├── StoryOutput.tsx   # Tabs (Preview, Raw Editor, Visual Card, Social)
│       ├── HistoryDrawer.tsx # Slide-out drawer for saved past stories
│       └── TokenModal.tsx    # GitHub Personal Access Token configuration
└── README.md                 # Documentation
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 22+
- A Google Gemini API Key (`GEMINI_API_KEY`)

### Environment Variables
Configure your `.env` file based on `.env.example`:
```env
GEMINI_API_KEY="your-gemini-api-key-here"
PORT=3000
```

### Installation & Running

```bash
# Install dependencies
npm install

# Start development server (Express backend + Vite middleware)
npm run dev

# Build for production
npm run build

# Start production server
npm run start
```

Open your browser at `http://localhost:3000`.

---

## 📄 License
Apache-2.0
