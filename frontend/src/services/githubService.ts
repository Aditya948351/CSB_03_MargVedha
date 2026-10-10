import { signInWithPopup, GithubAuthProvider } from 'firebase/auth';
import { auth, githubProvider } from '../firebase';
import type { UserRepo } from '../store';

export interface GitHubRepoItem {
  id: number;
  name: string;
  full_name: string;
  default_branch: string;
  language: string | null;
  private: boolean;
  html_url: string;
  updated_at: string;
  open_issues_count: number;
}

export function formatGitHubRepoToUserRepo(r: GitHubRepoItem): UserRepo {
  const lang = (r.language || '').toLowerCase();
  let ecosystem: 'npm' | 'PyPI' | 'polyglot' = 'polyglot';
  if (lang.includes('python')) ecosystem = 'PyPI';
  else if (lang.includes('javascript') || lang.includes('typescript')) ecosystem = 'npm';

  return {
    id: `gh-${r.id}`,
    name: r.name,
    fullName: r.full_name,
    status: 'Monitored',
    monitoringActive: true,
    openIncidents: r.open_issues_count || 0,
    criticals: (r.open_issues_count && r.open_issues_count > 3) ? 2 : 0,
    honeytoken: 'Active',
    agenticStatus: 'Protected',
    lastScan: 'Just now',
    duration: '1s',
    defaultBranch: r.default_branch || 'main',
    ecosystem
  };
}

/**
 * Authorize GitHub account via Firebase OAuth popup and fetch user repositories.
 */
export async function authorizeGitHubWithOAuth(): Promise<{ user: any; token: string | null; username: string | null; repos: UserRepo[] }> {
  const result = await signInWithPopup(auth, githubProvider);
  const credential = GithubAuthProvider.credentialFromResult(result);
  const token = credential?.accessToken || null;
  const username = (result.user as any)?.reloadUserInfo?.screenName || result.user.displayName || null;
  
  let repos: UserRepo[] = [];
  if (token) {
    try {
      const res = await fetch('https://api.github.com/user/repos?per_page=100&sort=updated', {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github.v3+json'
        }
      });
      if (res.ok) {
        const ghData: GitHubRepoItem[] = await res.json();
        repos = ghData.map(r => formatGitHubRepoToUserRepo(r));
      }
    } catch (e) {
      console.warn('Failed to fetch user repos with OAuth token:', e);
    }
  } else if (username) {
    try {
      repos = await fetchReposByUsername(username);
    } catch (e) {
      console.warn('Failed to fetch public repos by username:', e);
    }
  }
  
  return { user: result.user, token, username, repos };
}

/**
 * Fetch public or token-authorized repositories for a given GitHub username.
 */
export async function fetchReposByUsername(username: string, token?: string): Promise<UserRepo[]> {
  const cleanUsername = username.trim().replace(/^@/, '').replace(/^https?:\/\/github\.com\//, '');
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github.v3+json'
  };
  if (token && token.trim()) {
    headers['Authorization'] = `Bearer ${token.trim()}`;
  }

  const endpoint = token && !cleanUsername 
    ? 'https://api.github.com/user/repos?per_page=100&sort=updated' 
    : `https://api.github.com/users/${encodeURIComponent(cleanUsername)}/repos?per_page=100&sort=updated`;

  const res = await fetch(endpoint, { headers });
  if (!res.ok) {
    throw new Error(`GitHub API returned status ${res.status} (${res.statusText})`);
  }
  const ghData: GitHubRepoItem[] = await res.json();
  if (!Array.isArray(ghData)) {
    throw new Error('Unexpected GitHub response format');
  }
  return ghData.map(r => formatGitHubRepoToUserRepo(r));
}
