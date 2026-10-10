import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell, Search, User as UserIcon, Crown, Sparkles, LogOut, LogIn, GitBranch, Settings as SettingsIcon } from 'lucide-react';
import { useAppStore } from '../../store';
import { auth, googleProvider } from '../../firebase';
import { signInWithPopup, signOut } from 'firebase/auth';
import { authorizeGitHubWithOAuth } from '../../services/githubService';

export default function TopBar() {
  const { user, userPlan, setUser, setUserPlan, githubUser, setGithubUser, setUserRepos } = useAppStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const isSuperUser = user?.email === 'ap8548328@gmail.com';

  const handleSignIn = async () => {
    try {
      const res = await signInWithPopup(auth, googleProvider);
      setUser(res.user);
    } catch (e) {
      console.error(e);
    }
  };

  const handleGitHubSignIn = async () => {
    try {
      const res = await authorizeGitHubWithOAuth();
      setUser(res.user);
      setGithubUser({
        username: res.username || res.user?.displayName || 'GitHub User',
        avatarUrl: res.user?.photoURL || undefined,
        token: res.token || undefined
      });
      if (res.repos.length > 0) {
        setUserRepos(res.repos);
      }
      setDropdownOpen(false);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSignOut = async () => {
    await signOut(auth);
    setUser(null);
    setUserPlan('free');
    setGithubUser(null);
    setDropdownOpen(false);
  };

  return (
    <header className="h-16 bg-surface border-b border-border flex items-center justify-between px-6 shrink-0 relative z-30">
      <div className="flex items-center flex-1">
        <div className="relative w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-text-muted" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-border rounded-md leading-5 bg-background text-text placeholder-text-muted focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm"
            placeholder="Search packages, CVEs, or projects..."
          />
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        {/* User Tier Status Badge */}
        {isSuperUser ? (
          <span className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-purple-950/80 to-indigo-950/80 border border-purple-500/50 text-purple-300 text-xs font-bold shadow-xs">
            <Crown className="w-3.5 h-3.5 text-amber-300" />
            <span>Enterprise Superuser</span>
          </span>
        ) : userPlan === 'fleet' ? (
          <span className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-full bg-purple-100 text-purple-800 border border-purple-300 text-xs font-bold">
            <Sparkles className="w-3 h-3 text-purple-600" />
            Fleet Plan Active
          </span>
        ) : userPlan === 'pro' ? (
          <span className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold">
            <Sparkles className="w-3 h-3 text-emerald-600" />
            Pro Plan Active
          </span>
        ) : (
          <span className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-300 text-xs font-semibold">
            Free Community Tier
          </span>
        )}

        <button className="p-2 text-text-muted hover:text-text rounded-full hover:bg-surface-hover transition-colors relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-danger"></span>
        </button>

        {/* User Avatar & Dropdown */}
        <div className="relative">
          <button 
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 p-1 rounded-full hover:bg-surface-hover transition-colors cursor-pointer"
          >
            {user?.photoURL ? (
              <img src={user.photoURL} alt="User Avatar" className="h-8 w-8 rounded-full border border-primary/40 object-cover" />
            ) : (
              <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30 text-primary">
                <UserIcon className="h-4 w-4" />
              </div>
            )}
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-surface border border-border rounded-xl shadow-xl py-2 z-50 text-xs">
              <div className="px-4 py-2 border-b border-border">
                <p className="font-bold text-text truncate">{user?.displayName || 'User'}</p>
                <p className="text-text-muted font-mono text-[11px] truncate">{user?.email || 'Not Signed In'}</p>
                <div className="mt-1.5">
                  <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                    isSuperUser 
                      ? 'bg-purple-100 text-purple-800' 
                      : userPlan === 'fleet' 
                        ? 'bg-purple-100 text-purple-800' 
                        : userPlan === 'pro' 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : 'bg-slate-100 text-slate-700'
                  }`}>
                    {isSuperUser ? '👑 ap8548328@gmail.com (Superuser)' : `${userPlan.toUpperCase()} Plan`}
                  </span>
                </div>
                {githubUser && (
                  <div className="mt-1 flex items-center gap-1 text-[11px] text-emerald-700 font-mono">
                    <GitBranch className="size-3" />
                    <span>GitHub: @{githubUser.username}</span>
                  </div>
                )}
              </div>

              <Link
                to="/settings"
                onClick={() => setDropdownOpen(false)}
                className="w-full px-4 py-2 text-left text-slate-700 hover:bg-surface-hover flex items-center gap-2 font-medium"
              >
                <SettingsIcon className="size-3.5 text-primary" />
                <span>GitHub & Scan Settings</span>
              </Link>

              {user ? (
                <button
                  onClick={handleSignOut}
                  className="w-full px-4 py-2 text-left text-danger hover:bg-surface-hover flex items-center gap-2 font-medium cursor-pointer"
                >
                  <LogOut className="size-3.5" />
                  Sign Out
                </button>
              ) : (
                <div className="space-y-0.5 border-t border-border pt-1">
                  <button
                    onClick={handleGitHubSignIn}
                    className="w-full px-4 py-2 text-left text-slate-900 hover:bg-surface-hover flex items-center gap-2 font-medium cursor-pointer"
                  >
                    <GitBranch className="size-3.5 text-emerald-600" />
                    Authorize with GitHub
                  </button>
                  <button
                    onClick={handleSignIn}
                    className="w-full px-4 py-2 text-left text-primary hover:bg-surface-hover flex items-center gap-2 font-medium cursor-pointer"
                  >
                    <LogIn className="size-3.5" />
                    Sign In with Google
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

