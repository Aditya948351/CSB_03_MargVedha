import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { useAppStore } from '../store';
import { 
  GitBranch, ShieldCheck, CheckCircle2, AlertTriangle, RefreshCw, 
  Power, Trash2, Plus, ExternalLink, Lock, Sparkles, Check, X, 
  Layers, Shield, Activity
} from 'lucide-react';
import { authorizeGitHubWithOAuth, fetchReposByUsername } from '../services/githubService';

export default function Settings() {
  const { 
    user, scanCount, userRepos, setUserRepos, addUserRepo, removeUserRepo, 
    toggleRepoMonitoring, githubUser, setGithubUser, liveScanningEnabled, 
    setLiveScanningEnabled, userPlan 
  } = useAppStore();

  const isSuperUser = user?.email === 'ap8548328@gmail.com';

  // Local state for GitHub username / token input
  const [githubInput, setGithubInput] = useState('');
  const [tokenInput, setTokenInput] = useState('');
  const [isConnectingGh, setIsConnectingGh] = useState(false);
  const [ghError, setGhError] = useState<string | null>(null);
  const [ghSuccess, setGhSuccess] = useState<string | null>(null);
  const [newRepoInput, setNewRepoInput] = useState('');

  // OAuth Connect
  const handleConnectOAuth = async () => {
    setIsConnectingGh(true);
    setGhError(null);
    setGhSuccess(null);
    try {
      const res = await authorizeGitHubWithOAuth();
      setGithubUser({
        username: res.username || res.user?.displayName || 'GitHub User',
        avatarUrl: res.user?.photoURL || undefined,
        token: res.token || undefined
      });
      if (res.repos.length > 0) {
        setUserRepos(res.repos);
        setGhSuccess(`Successfully authorized GitHub! Synced ${res.repos.length} repositories.`);
      } else {
        setGhSuccess(`GitHub account authorized. Add repositories to begin live monitoring.`);
      }
    } catch (err: any) {
      console.error(err);
      setGhError(err.message || 'GitHub OAuth failed. You can connect using your GitHub username below.');
    } finally {
      setIsConnectingGh(false);
    }
  };

  // Connect via Username / PAT
  const handleConnectByUsername = async () => {
    if (!githubInput.trim()) {
      setGhError('Please enter a GitHub username or organization handle.');
      return;
    }
    setIsConnectingGh(true);
    setGhError(null);
    setGhSuccess(null);
    try {
      const repos = await fetchReposByUsername(githubInput.trim(), tokenInput.trim() || undefined);
      setGithubUser({
        username: githubInput.trim(),
        token: tokenInput.trim() || undefined
      });
      if (repos.length > 0) {
        setUserRepos(repos);
        setGhSuccess(`Successfully connected @${githubInput.trim()}! Synced ${repos.length} repositories into live perimeter.`);
      } else {
        setGhSuccess(`Connected @${githubInput.trim()}. No public repositories found.`);
      }
    } catch (err: any) {
      console.error(err);
      setGhError(err.message || 'Could not fetch repositories for this username. Please verify the handle.');
    } finally {
      setIsConnectingGh(false);
    }
  };

  const handleDisconnectGitHub = () => {
    setGithubUser(null);
    if (!isSuperUser) {
      setUserRepos([]);
    }
    setGhSuccess('GitHub account disconnected.');
  };

  const handleAddCustomRepo = () => {
    if (!newRepoInput.trim()) return;
    const res = addUserRepo(newRepoInput.trim());
    if (res.success) {
      setNewRepoInput('');
      setGhSuccess(res.message);
    } else {
      setGhError(res.message);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl pb-16 font-sans">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 text-balance">Settings & Account</h1>
        <p className="text-text-muted text-sm mt-1">
          Manage your subscription tier, connected GitHub sources, and automated continuous scanning permissions.
        </p>
      </div>

      {/* Notifications */}
      {ghSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
            <span className="font-medium">{ghSuccess}</span>
          </div>
          <button onClick={() => setGhSuccess(null)} className="text-emerald-500 hover:text-emerald-700">
            <X className="size-3.5" />
          </button>
        </div>
      )}

      {ghError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-800 text-xs flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <AlertTriangle className="size-4 text-red-600 shrink-0" />
            <span className="font-medium">{ghError}</span>
          </div>
          <button onClick={() => setGhError(null)} className="text-red-500 hover:text-red-700">
            <X className="size-3.5" />
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. GITHUB OAUTH & LIVE SCANNING CONFIGURATION (PRIMARY USER REQUIREMENT)   */}
      {/* ========================================================================= */}
      <Card className="border-border shadow-xs overflow-hidden">
        <CardHeader className="bg-slate-900 text-white p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-white/10 flex items-center justify-center text-white border border-white/20">
                <GitBranch className="size-5 text-emerald-400" />
              </div>
              <div>
                <CardTitle className="text-lg text-white font-bold flex items-center gap-2">
                  GitHub Integration & Live Monitored Repositories
                </CardTitle>
                <p className="text-xs text-slate-300 mt-0.5">
                  Authorize your personal GitHub account to scan all your repositories and enable live continuous protection.
                </p>
              </div>
            </div>

            {githubUser ? (
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-mono font-bold flex items-center gap-1.5 self-start sm:self-auto">
                <span className="size-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Connected: @{githubUser.username}
              </span>
            ) : (
              <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-mono font-bold flex items-center gap-1.5 self-start sm:self-auto">
                <Lock className="size-3" />
                No GitHub Connected
              </span>
            )}
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          
          {/* GitHub Connection Status / Controls */}
          {githubUser ? (
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-sm">
                  {githubUser.username[0]?.toUpperCase() || 'G'}
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <span>@{githubUser.username}</span>
                    <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-mono">
                      Scopes: repo, read:org
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 tabular-nums">
                    {userRepos.length} repositories currently synced to your perimeter.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleConnectOAuth}
                  disabled={isConnectingGh}
                  className="px-3.5 py-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-800 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <RefreshCw className={`size-3.5 text-primary ${isConnectingGh ? 'animate-spin' : ''}`} />
                  <span>Sync Now</span>
                </button>
                <button
                  onClick={handleDisconnectGitHub}
                  className="px-3.5 py-2 bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer"
                >
                  Disconnect
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-5 bg-blue-50/50 border border-blue-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                    <Sparkles className="size-4 text-primary" />
                    Authorize MARGVEDHA via GitHub OAuth
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed max-w-xl text-balance">
                    Grant read permissions to discover and analyze your dependencies. No source code is modified without your explicit approval.
                  </p>
                </div>
                <button
                  onClick={handleConnectOAuth}
                  disabled={isConnectingGh}
                  className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer shrink-0"
                >
                  <GitBranch className="size-4 text-emerald-400" />
                  <span>{isConnectingGh ? 'Connecting...' : 'Authorize GitHub Account'}</span>
                </button>
              </div>

              {/* Username / PAT Fallback */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Or Connect by GitHub Username / Personal Access Token:
                </div>
                <div className="grid sm:grid-cols-12 gap-3">
                  <div className="sm:col-span-6">
                    <input
                      type="text"
                      value={githubInput}
                      onChange={e => setGithubInput(e.target.value)}
                      placeholder="GitHub username (e.g. your-github-handle)"
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-primary focus:outline-none"
                    />
                  </div>
                  <div className="sm:col-span-4">
                    <input
                      type="password"
                      value={tokenInput}
                      onChange={e => setTokenInput(e.target.value)}
                      placeholder="Token (optional for private repos)"
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-primary focus:outline-none"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <button
                      onClick={handleConnectByUsername}
                      disabled={isConnectingGh}
                      className="w-full py-2 bg-primary hover:bg-primary-hover text-white rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center justify-center gap-1"
                    >
                      {isConnectingGh ? 'Fetching...' : 'Fetch Repos'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Continuous Live Scanning Master Switch */}
          <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-xl">
            <div className="space-y-0.5">
              <div className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Activity className="size-4 text-emerald-600" />
                <span>Continuous Live Scanning</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                  liveScanningEnabled ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                }`}>
                  {liveScanningEnabled ? 'Enabled' : 'Paused'}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Periodically check dependencies against CISA KEV and trigger proactive SAT alerts when supply chain vulnerabilities emerge.
              </p>
            </div>
            <button
              onClick={() => setLiveScanningEnabled(!liveScanningEnabled)}
              className={`p-2 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                liveScanningEnabled 
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm' 
                  : 'bg-slate-200 text-slate-700 border-slate-300'
              }`}
            >
              <Power className="size-4" />
              <span>{liveScanningEnabled ? 'Active' : 'Turn On'}</span>
            </button>
          </div>

          {/* Currently Monitored Repositories List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="size-4 text-blue-600" />
                <span>Your Monitored Repositories ({userRepos.length})</span>
              </h4>
              <span className="text-xs text-text-muted tabular-nums">
                Tier: {userPlan.toUpperCase()} (Max {isSuperUser || userPlan === 'fleet' ? 'Unlimited' : userPlan === 'pro' ? 10 : 1})
              </span>
            </div>

            {userRepos.length === 0 ? (
              <div className="text-center py-8 border-2 border-dashed border-slate-200 rounded-2xl p-6 bg-slate-50/50 space-y-2">
                <GitBranch className="size-8 text-slate-400 mx-auto" />
                <h5 className="font-bold text-slate-800 text-sm">No repositories connected yet</h5>
                <p className="text-xs text-slate-500 max-w-md mx-auto text-balance">
                  Connect your GitHub account above or manually add a repository below to start scanning and generating automated remediation PRs.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden bg-white">
                {userRepos.map(repo => (
                  <div key={repo.id} className="p-3.5 flex items-center justify-between gap-3 hover:bg-slate-50 transition-colors">
                    <div className="space-y-0.5">
                      <div className="font-bold text-slate-900 text-xs flex items-center gap-2">
                        <GitBranch className="size-3.5 text-primary" />
                        <span>{repo.fullName}</span>
                        <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-mono">
                          {repo.ecosystem}
                        </span>
                        {repo.monitoringActive ? (
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-semibold flex items-center gap-1">
                            <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Live
                          </span>
                        ) : (
                          <span className="text-[10px] bg-slate-200 text-slate-600 px-1.5 py-0.2 rounded">
                            Paused
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500 tabular-nums">
                        Branch: {repo.defaultBranch} • Incidents: {repo.openIncidents} • Status: {repo.agenticStatus}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleRepoMonitoring(repo.id)}
                        className={`px-2.5 py-1 rounded text-[11px] font-bold border transition-colors cursor-pointer ${
                          repo.monitoringActive
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                            : 'bg-slate-100 text-slate-600 border-slate-300'
                        }`}
                      >
                        {repo.monitoringActive ? 'Monitoring ON' : 'Paused'}
                      </button>
                      <button
                        onClick={() => removeUserRepo(repo.id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 rounded hover:bg-red-50 transition-colors cursor-pointer"
                        title="Remove repository"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Quick Add Custom Repo Input */}
            <div className="flex gap-2 pt-2">
              <input
                type="text"
                value={newRepoInput}
                onChange={e => setNewRepoInput(e.target.value)}
                placeholder="Add repository URL or 'owner/repository'..."
                className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-primary focus:outline-none"
              />
              <button
                onClick={handleAddCustomRepo}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5 shrink-0"
              >
                <Plus className="size-3.5" />
                <span>Add Repo</span>
              </button>
            </div>

          </div>

        </CardContent>
      </Card>

      {/* ========================================================================= */}
      {/* 2. SUBSCRIPTION & QUOTA CARD                                              */}
      {/* ========================================================================= */}
      {user && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-bold text-slate-900">Subscription & Scan Quota</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4 border-b border-border pb-6">
              <img src={user.photoURL || `https://ui-avatars.com/api/?name=${user.email}`} alt="Avatar" className="size-16 rounded-full border border-slate-200" />
              <div>
                <h3 className="text-xl font-bold text-slate-900">{user.displayName || 'Google User'}</h3>
                <p className="text-sm text-text-muted">{user.email}</p>
                <div className="mt-2 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                  {isSuperUser ? 'Enterprise Superuser' : `${userPlan.toUpperCase()} Plan`}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm font-medium text-slate-700 tabular-nums">
                <span>Free Tier Usage</span>
                <span>{scanCount} / 10 Scans Used</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                <div 
                  className={`h-3 rounded-full transition-all ${scanCount >= 10 ? 'bg-red-500' : 'bg-primary'}`} 
                  style={{ width: `${Math.min(100, (scanCount / 10) * 100)}%` }}
                ></div>
              </div>
              {scanCount >= 10 ? (
                <div className="bg-red-50 text-red-700 p-4 rounded-lg mt-4 text-sm font-medium border border-red-200">
                  You have reached your 10 free scans. Future scans will require Developer Pro at ₹199/mo.
                  <button 
                    onClick={() => {
                      setUserPlan('pro');
                      alert("Developer Pro activated! Unlimited scans unlocked.");
                    }}
                    className="block mt-3 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors cursor-pointer"
                  >
                    Upgrade to Developer Pro (₹199/mo)
                  </button>
                </div>
              ) : (
                <div className="bg-blue-50 text-blue-700 p-4 rounded-lg mt-4 text-sm border border-blue-200 flex justify-between items-center">
                  <span className="tabular-nums">You have {10 - scanCount} free scans remaining.</span>
                  <button 
                    onClick={() => {
                      setUserPlan('pro');
                      alert("Developer Pro activated! Enjoy unlimited scans.");
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors cursor-pointer"
                  >
                    Upgrade to Pro (₹199/mo)
                  </button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* ========================================================================= */}
      {/* 3. ANALYSIS CONFIGURATION                                                 */}
      {/* ========================================================================= */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-bold text-slate-900">Analysis Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center p-4 bg-background border border-border rounded-md">
            <div>
              <div className="font-medium text-sm">Analysis Mode</div>
              <div className="text-xs text-text-muted">Current operational mode of the platform.</div>
            </div>
            <div className="px-3 py-1 bg-primary/20 text-primary border border-primary/30 rounded-full text-xs font-bold uppercase">
              Demo Workspace
            </div>
          </div>
          <div className="flex justify-between items-center p-4 bg-background border border-border rounded-md">
            <div>
              <div className="font-medium text-sm">Data Retention</div>
              <div className="text-xs text-text-muted">Handling of uploaded project archives.</div>
            </div>
            <div className="text-xs font-medium text-slate-700">
              Ephemeral (Deleted after scan)
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ========================================================================= */}
      {/* 4. VULNERABILITY SOURCES & SCORING                                        */}
      {/* ========================================================================= */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-bold text-slate-900">Vulnerability Intelligence Feeds</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-xs sm:text-sm">
          <div className="flex justify-between items-center border-b border-border pb-3">
            <div>
              <div className="font-semibold text-slate-900">OSV.dev Global Vulnerability DB</div>
              <div className="text-xs text-text-muted">Direct mapping of npm, PyPI, and crates ecosystems.</div>
            </div>
            <span className="text-emerald-600 text-xs font-semibold flex items-center gap-1">
              <span className="size-2 rounded-full bg-emerald-500"></span> Connected
            </span>
          </div>
          <div className="flex justify-between items-center border-b border-border pb-3">
            <div>
              <div className="font-semibold text-slate-900">CISA KEV (Known Exploited Vulnerabilities)</div>
              <div className="text-xs text-text-muted">Zero-day active exploitation telemetry.</div>
            </div>
            <span className="text-emerald-600 text-xs font-semibold flex items-center gap-1">
              <span className="size-2 rounded-full bg-emerald-500"></span> Cached & Live
            </span>
          </div>
          <div className="flex justify-between items-center">
            <div>
              <div className="font-semibold text-slate-900">FIRST EPSS (Exploit Prediction Scoring)</div>
              <div className="text-xs text-text-muted">Probability of in-the-wild weaponization within 30 days.</div>
            </div>
            <span className="text-emerald-600 text-xs font-semibold flex items-center gap-1">
              <span className="size-2 rounded-full bg-emerald-500"></span> Active
            </span>
          </div>
        </CardContent>
      </Card>

    </div>
  );
}
