import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';
import { authorizeGitHubWithOAuth } from '../services/githubService';
import { useAppStore } from '../store';
import { ShieldCheck, GitBranch, ArrowLeft, Loader2, Sparkles, Lock, AlertTriangle } from 'lucide-react';

export default function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/dashboard';
  const { setUser, setGithubUser, setUserRepos } = useAppStore();

  const [isLoadingGoogle, setIsLoadingGoogle] = useState(false);
  const [isLoadingGithub, setIsLoadingGithub] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    setIsLoadingGoogle(true);
    setAuthError(null);
    try {
      const res = await signInWithPopup(auth, googleProvider);
      setUser(res.user);
      navigate(redirectPath, { replace: true });
    } catch (err: any) {
      console.error(err);
      setAuthError(err.message || 'Google authentication was cancelled or failed.');
    } finally {
      setIsLoadingGoogle(false);
    }
  };

  const handleGithubSignIn = async () => {
    setIsLoadingGithub(true);
    setAuthError(null);
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
      navigate(redirectPath, { replace: true });
    } catch (err: any) {
      console.error(err);
      setAuthError(err.message || 'GitHub OAuth was cancelled or failed.');
    } finally {
      setIsLoadingGithub(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center px-4 relative overflow-hidden font-sans">
      {/* Background Ambience */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-md space-y-6 relative z-10">
        
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <Link to="/" className="inline-block hover:opacity-90 transition-opacity">
            <img src="/MargVedha_Logo.png" alt="MargVedha Logo" className="h-12 w-auto mx-auto object-contain" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">Authentication Required</h1>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed text-balance">
              Sign in with your corporate account or GitHub to access your workspace perimeter and dependency analysis.
            </p>
          </div>
        </div>

        {/* Auth Error Banner */}
        {authError && (
          <div className="p-3.5 bg-red-950/80 border border-red-500/50 rounded-xl text-xs text-red-300 flex items-center gap-2 shadow-lg">
            <AlertTriangle className="size-4 text-red-400 shrink-0" />
            <span className="leading-snug">{authError}</span>
          </div>
        )}

        {/* Login Card */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl space-y-5">
          
          <div className="space-y-3">
            {/* Google Sign In */}
            <button
              onClick={handleGoogleSignIn}
              disabled={isLoadingGoogle || isLoadingGithub}
              className="w-full py-3 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-semibold text-xs sm:text-sm flex items-center justify-center gap-3 transition-all shadow-md active:scale-95 disabled:opacity-60 cursor-pointer"
            >
              {isLoadingGoogle ? (
                <Loader2 className="size-4 animate-spin text-slate-900" />
              ) : (
                <svg className="size-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
              )}
              <span>{isLoadingGoogle ? 'Signing In...' : 'Continue with Google'}</span>
            </button>

            {/* GitHub Sign In */}
            <button
              onClick={handleGithubSignIn}
              disabled={isLoadingGoogle || isLoadingGithub}
              className="w-full py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-3 border border-slate-700 transition-all shadow-md active:scale-95 disabled:opacity-60 cursor-pointer"
            >
              {isLoadingGithub ? (
                <Loader2 className="size-4 animate-spin text-white" />
              ) : (
                <GitBranch className="size-4 text-emerald-400" />
              )}
              <span>{isLoadingGithub ? 'Authorizing...' : 'Authorize with GitHub (OAuth)'}</span>
            </button>
          </div>

          {/* Privacy & Role Isolation Guarantee */}
          <div className="pt-3 border-t border-slate-800/80 space-y-2">
            <div className="flex items-start gap-2 text-[11px] text-slate-400 leading-relaxed">
              <Lock className="size-3.5 text-blue-400 shrink-0 mt-0.5" />
              <span>
                <strong>Workspace Isolation:</strong> Only repositories and scans you own or explicitly connect will be visible to your session.
              </span>
            </div>
            <div className="flex items-start gap-2 text-[11px] text-slate-400 leading-relaxed">
              <ShieldCheck className="size-3.5 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                CISA BOD 22-01 & NIST SSDF compliance framework active.
              </span>
            </div>
          </div>

        </div>

        {/* Back Link */}
        <div className="text-center">
          <Link
            to="/"
            className="text-xs text-slate-400 hover:text-white transition-colors inline-flex items-center gap-1.5"
          >
            <ArrowLeft className="size-3" />
            <span>Return to Homepage</span>
          </Link>
        </div>

      </div>
    </div>
  );
}
