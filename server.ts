import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isProd = process.env.NODE_ENV === 'production';
const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json({ limit: '10mb' }));

// Server-side Gemini initialization according to gemini-api skill
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({
  apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

interface CommitItem {
  sha: string;
  shortSha: string;
  message: string;
  author: {
    name: string;
    email?: string;
    avatarUrl?: string;
    username?: string;
  };
  date: string;
  htmlUrl: string;
}

interface RepoInfo {
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

// Helper to extract owner and repo from URL or string
function parseGithubUrl(input: string): { owner: string; repo: string } | null {
  const cleaned = input.trim().replace(/\/+$/, '');
  
  // Matches formats:
  // https://github.com/owner/repo
  // https://github.com/owner/repo/tree/branch
  // git@github.com:owner/repo.git
  // github.com/owner/repo
  // owner/repo
  const webRegex = /(?:https?:\/\/)?(?:www\.)?github\.com\/([a-zA-Z0-9_.-]+)\/([a-zA-Z0-9_.-]+)(?:\/.*)?$/i;
  const sshRegex = /^git@github\.com:([a-zA-Z0-9_.-]+)\/([a-zA-Z0-9_.-]+)(?:\.git)?$/i;
  const shortRegex = /^([a-zA-Z0-9_.-]+)\/([a-zA-Z0-9_.-]+)$/i;

  let match = cleaned.match(webRegex) || cleaned.match(sshRegex) || cleaned.match(shortRegex);
  if (match) {
    let repo = match[2];
    if (repo.endsWith('.git')) {
      repo = repo.slice(0, -4);
    }
    return { owner: match[1], repo };
  }
  return null;
}

// 1. Fetch Repository Info & Commits from GitHub API
app.post('/api/github/fetch-commits', async (req: Request, res: Response) => {
  try {
    const { url, token, branch, perPage = 30, since, until } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'GitHub repository URL or owner/repo is required.' });
    }

    const parsed = parseGithubUrl(url);
    if (!parsed) {
      return res.status(400).json({
        error: 'Invalid GitHub URL format. Examples: "owner/repo" or "https://github.com/owner/repo"',
      });
    }

    const { owner, repo } = parsed;

    const headers: Record<string, string> = {
      Accept: 'application/vnd.github.v3+json',
      'User-Agent': 'GitStory-App',
    };

    if (token && typeof token === 'string' && token.trim().length > 0) {
      headers['Authorization'] = `token ${token.trim()}`;
    }

    // 1. Fetch Repo Details
    const repoRes = await fetch(`https://api.github.com/repos/${owner}/${repo}`, { headers });
    
    if (repoRes.status === 404) {
      return res.status(404).json({
        error: `Repository "${owner}/${repo}" not found or is private. If it is private, provide a GitHub Personal Access Token.`,
      });
    }

    if (repoRes.status === 403) {
      const rateLimitRemaining = repoRes.headers.get('x-ratelimit-remaining');
      if (rateLimitRemaining === '0') {
        return res.status(403).json({
          error: 'GitHub API rate limit exceeded for unauthenticated requests (60 req/hr). Add an optional GitHub Personal Access Token in the settings, or try one of the curated sample repositories.',
          rateLimited: true,
        });
      }
    }

    if (!repoRes.ok) {
      const errorData = await repoRes.json().catch(() => ({}));
      return res.status(repoRes.status).json({
        error: (errorData as any).message || `GitHub API error: ${repoRes.statusText}`,
      });
    }

    const repoData = await repoRes.json();
    const repoInfo: RepoInfo = {
      owner: repoData.owner?.login || owner,
      name: repoData.name || repo,
      fullName: repoData.full_name || `${owner}/${repo}`,
      description: repoData.description || 'No description provided.',
      stars: repoData.stargazers_count || 0,
      forks: repoData.forks_count || 0,
      defaultBranch: repoData.default_branch || 'main',
      language: repoData.language || 'Code',
      avatarUrl: repoData.owner?.avatar_url || '',
      htmlUrl: repoData.html_url || `https://github.com/${owner}/${repo}`,
    };

    // 2. Fetch Commits
    const targetBranch = branch || repoInfo.defaultBranch;
    const queryParams = new URLSearchParams({
      sha: targetBranch,
      per_page: Math.min(Math.max(Number(perPage) || 30, 5), 100).toString(),
    });

    if (since) queryParams.set('since', since);
    if (until) queryParams.set('until', until);

    const commitsRes = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/commits?${queryParams.toString()}`,
      { headers }
    );

    if (!commitsRes.ok) {
      const errorData = await commitsRes.json().catch(() => ({}));
      return res.status(commitsRes.status).json({
        error: (errorData as any).message || `Failed to fetch commits: ${commitsRes.statusText}`,
      });
    }

    const commitsData = await commitsRes.json();
    if (!Array.isArray(commitsData)) {
      return res.status(500).json({ error: 'Unexpected response format from GitHub commits API.' });
    }

    const commits: CommitItem[] = commitsData.map((c: any) => ({
      sha: c.sha,
      shortSha: c.sha ? c.sha.slice(0, 7) : '',
      message: c.commit?.message || '',
      author: {
        name: c.commit?.author?.name || c.author?.login || 'Anonymous',
        email: c.commit?.author?.email,
        avatarUrl: c.author?.avatar_url || '',
        username: c.author?.login || '',
      },
      date: c.commit?.author?.date || c.commit?.committer?.date || '',
      htmlUrl: c.html_url || `https://github.com/${owner}/${repo}/commit/${c.sha}`,
    }));

    return res.json({
      repoInfo,
      commits,
      branch: targetBranch,
    });
  } catch (err: any) {
    console.error('Error fetching from GitHub:', err);
    return res.status(500).json({
      error: err.message || 'Internal server error while fetching GitHub repository data.',
    });
  }
});

// 2. Generate Product Story using Gemini 3.8 Flash
app.post('/api/generate-story', async (req: Request, res: Response) => {
  try {
    const {
      repoInfo,
      commits,
      options = {},
    } = req.body;

    if (!commits || !Array.isArray(commits) || commits.length === 0) {
      return res.status(400).json({ error: 'No commits provided for story generation.' });
    }

    const {
      tone = 'product-launch',
      targetAudience = 'Users & Customers',
      releaseVersion = '',
      format = 'blog-post',
      customInstructions = '',
    } = options;

    // Filter and prepare commits summary for the prompt
    const commitSummaries = commits.slice(0, 80).map((c: CommitItem, index: number) => {
      // First line of commit message is title, rest is description
      const lines = (c.message || '').trim().split('\n');
      const title = lines[0] || 'Unspecified change';
      const body = lines.slice(1).join(' ').trim().slice(0, 180);
      return `${index + 1}. [${c.shortSha}] by @${c.author.username || c.author.name} (${c.date?.split('T')[0] || 'recent'}): ${title} ${body ? `(${body})` : ''}`;
    }).join('\n');

    // Tone definitions
    let tonePromptGuidance = '';
    switch (tone) {
      case 'product-launch':
        tonePromptGuidance = `
Tone: High-energy, exciting, product-led marketing tone (think Stripe, Apple, or Vercel changelogs).
Focus on user benefits, intuitive metaphors, excitement, and clear "Why you'll love this" sections.
Avoid raw Git jargon like "merged PR #321" or "reverted refactor"; translate technical work into user value.`;
        break;
      case 'executive':
        tonePromptGuidance = `
Tone: Executive Brief & Stakeholder Summary.
Focus on strategic velocity, reliability, performance metrics, risk mitigation, and milestone completion.
Highlight business value, architecture stabilization, and customer satisfaction impact.`;
        break;
      case 'tech-deep-dive':
        tonePromptGuidance = `
Tone: Technical Deep-Dive & Engineering Changelog.
Rich with architectural context, algorithmic improvements, API design, dependency migrations, and performance optimizations.
Include code snippets or API signatures where relevant, and clearly mark breaking changes or deprecations.`;
        break;
      case 'newsletter':
        tonePromptGuidance = `
Tone: Warm, conversational developer newsletter (think Substack, TLDR, or Changelog podcast).
Engaging narrative arc telling the story of this sprint/release cycle, highlighting challenges solved, community contributors, and behind-the-scenes engineering.`;
        break;
      case 'social-thread':
        tonePromptGuidance = `
Tone: Punchy, hook-driven social release thread (formatted with engaging headers, hooks, bullet points, and emoji accents suitable for Twitter/X or LinkedIn).
Catchy opening hook, 4-6 bite-sized feature cards with emojis, and a strong call-to-action closing.`;
        break;
      default:
        tonePromptGuidance = `Tone: Engaging, professional product update highlighting user-facing features and technical improvements.`;
    }

    const versionTitle = releaseVersion.trim()
      ? releaseVersion.trim()
      : `Latest Release Update (${new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })})`;

    const prompt = `
You are GitStory, an elite product marketer and developer advocate.
Your mission: Transform raw Git commit history into a beautifully formatted, publication-ready product update story.

REPOSITORY CONTEXT:
- Repository: ${repoInfo?.fullName || 'Project'}
- Description: ${repoInfo?.description || 'N/A'}
- Primary Language: ${repoInfo?.language || 'Unknown'}
- Selected Branch: ${repoInfo?.defaultBranch || 'main'}
- Total Commits Analyzed: ${commits.length}

DESIRED OUTPUT SPECIFICATIONS:
- Release / Story Version: ${versionTitle}
- Target Audience: ${targetAudience}
- Format Style: ${format}
${tonePromptGuidance}
${customInstructions ? `Special User Instructions: ${customInstructions}` : ''}

COMMIT LOGS:
${commitSummaries}

TASK REQUIREMENTS:
1. Synthesize and group related commits into cohesive feature themes (e.g., "⚡ Blazing Fast Search", "🎨 Modern UI Redesign", "🛡️ Hardened Security & Auth", "🐛 Polishing & Stability").
2. DO NOT just list every commit one-by-one. Group them intelligently. Connect small bug fixes into "Reliability & Polish".
3. For each major feature or group, explain:
   - What was added or changed
   - **Why it matters** (the real-world problem it solves for ${targetAudience})
4. Include:
   - 🎯 A compelling main title and subtitle / hook
   - 🌟 A "TL;DR / Quick Highlights" callout block (3-4 bullet takeaways)
   - 🚀 Detailed Feature Showcases
   - 🛠️ Quality of Life & Bug Fixes
   - 👥 Contributor Shoutouts (mention authors from the commit logs)
   - 📢 A ready-to-copy social post summary at the very end in a markdown blockquote or code block.
5. Use rich Markdown elements: blockquotes, bold highlights, badges (e.g. \`[New]\`, \`[Fix]\`, \`[Performance]\`), clean bullet lists, and dividers.

Please format your response in valid, beautiful Markdown. Also, at the very beginning of your response, output a JSON meta-block enclosed in \`\`\`json_meta ... \`\`\` with this exact schema:
\`\`\`json_meta
{
  "title": "Short catchy release title",
  "tagline": "One-sentence punchy summary",
  "highlights": ["highlight 1", "highlight 2", "highlight 3"],
  "stats": {
    "featureCount": 3,
    "fixCount": 5
  }
}
\`\`\`
Followed immediately by the full Markdown product story.
`;

    // Call Gemini with gemini-3.8-flash (Standard for text tasks)
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
    });

    const outputText = response.text || '';

    // Extract json_meta if present
    let meta: any = {
      title: `${repoInfo?.name || 'Project'} Product Update`,
      tagline: 'Fresh updates, new features, and performance enhancements.',
      highlights: [],
    };
    let cleanMarkdown = outputText;

    const metaMatch = outputText.match(/```json_meta\s*([\s\S]*?)\s*```/);
    if (metaMatch) {
      try {
        meta = JSON.parse(metaMatch[1]);
        cleanMarkdown = outputText.replace(/```json_meta\s*[\s\S]*?\s*```/, '').trim();
      } catch (e) {
        console.warn('Could not parse json_meta block:', e);
      }
    }

    return res.json({
      markdown: cleanMarkdown,
      meta,
      analyzedCommitsCount: commits.length,
      modelUsed: 'gemini-3.8-flash',
    });
  } catch (err: any) {
    console.error('Error generating story with Gemini:', err);
    return res.status(500).json({
      error: err.message || 'Failed to generate product story with Gemini API.',
    });
  }
});

// Configure Vite middleware or static serving
if (!isProd) {
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
} else {
  app.use(express.static(path.resolve(__dirname, 'dist')));
  app.get('*', (_req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
  });
}

app.listen(Number(PORT), '0.0.0.0', () => {
  console.log(`GitStory server running on port ${PORT}`);
});
