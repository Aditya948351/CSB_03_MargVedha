import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithPopup } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, googleProvider, db } from '../firebase';
import { useAppStore } from '../store';
import { Shield, GitBranch, Zap, Bot, ArrowRight, Loader2 } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();
  const { user, setUser, setScanCount } = useAppStore();
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    // If already logged in, skip landing page
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleLogin = async () => {
    setIsLoggingIn(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const userObj = result.user;
      setUser(userObj);

      // Check Firestore for user profile
      const userRef = doc(db, 'users', userObj.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        setScanCount(userSnap.data().scanCount || 0);
      } else {
        await setDoc(userRef, {
          email: userObj.email,
          name: userObj.displayName,
          scanCount: 0,
          createdAt: new Date().toISOString()
        });
        setScanCount(0);
      }

      navigate('/dashboard');
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-primary/20">
      {/* Navbar */}
      <nav className="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-primary/5 p-1.5 rounded-lg border border-primary/10">
              <img src="/MargVedha_Logo.png" alt="MargVedha Logo" className="w-9 h-9 object-contain" />
            </div>
            <span className="font-bold text-2xl tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">MARGVEDHA</span>
          </div>
          <button 
            onClick={handleLogin}
            disabled={isLoggingIn}
            className="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-full font-medium transition-all shadow-lg shadow-primary/25 disabled:opacity-70 flex items-center gap-2"
          >
            {isLoggingIn ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
            Login
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12 lg:py-20 space-y-32">
      {/* Hero Section */}
      <div className="relative overflow-hidden min-h-[80vh] flex items-center rounded-3xl bg-white border border-slate-200 shadow-xl shadow-slate-200/50 p-12">
        {/* Animated Background Waves */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-30">
          <svg className="absolute w-full h-[150%] top-[-25%] left-0 animate-[spin_120s_linear_infinite]" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0,50 Q25,20 50,50 T100,50" fill="none" stroke="url(#gradient)" strokeWidth="0.5" />
            <path d="M0,60 Q25,30 50,60 T100,60" fill="none" stroke="url(#gradient)" strokeWidth="0.5" />
            <path d="M0,40 Q25,10 50,40 T100,40" fill="none" stroke="url(#gradient)" strokeWidth="0.5" />
            <path d="M0,70 Q25,40 50,70 T100,70" fill="none" stroke="url(#gradient)" strokeWidth="0.5" />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#2DD4BF" stopOpacity="0" />
                <stop offset="50%" stopColor="#2DD4BF" />
                <stop offset="100%" stopColor="#2DD4BF" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center relative z-10 w-full">
          
          {/* Left Column - Copy & CTA */}
          <div className="space-y-8 max-w-2xl text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-bold tracking-wide text-xs mb-2 border border-primary/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              SaaS Security Ecosystem
            </div>
            
            <h1 className="text-5xl lg:text-6xl font-light text-slate-800 leading-[1.1] tracking-tight">
              Trace the Risk. <br/>
              <span className="font-semibold bg-gradient-to-r from-primary to-emerald-500 bg-clip-text text-transparent">Secure the Path.</span>
            </h1>
            
            <p className="text-xl text-slate-600 leading-relaxed font-light">
              Involve your developers as equal partners in your AppSec program. Analyze software supply chains with DAGs, OSINT, and AI remediation before pushing to production.
            </p>
            
            <div className="pt-4 flex flex-col sm:flex-row items-center gap-4">
              <button 
                onClick={handleLogin}
                disabled={isLoggingIn}
                className="w-full sm:w-auto bg-slate-800 hover:bg-slate-900 text-white px-8 py-4 rounded-full font-medium text-lg transition-all shadow-xl shadow-slate-900/10 flex items-center justify-center gap-2 group"
              >
                {isLoggingIn ? <Loader2 className="w-5 h-5 animate-spin" /> : "Try our Demo"}
                {!isLoggingIn && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
              </button>
            </div>
          </div>

          {/* Right Column - Animated Card */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-emerald-400/20 rounded-[2.5rem] blur-3xl transform rotate-3 scale-105"></div>
            <div className="relative bg-[#2D325A] rounded-3xl p-8 shadow-2xl border border-white/10 overflow-hidden min-h-[400px] flex flex-col justify-between">
              
              {/* Fake Terminal Header */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
                <div className="text-white/40 text-xs font-mono">margvedha-scan.sh</div>
                <div className="flex gap-2 text-white/40">
                  <span className="w-1 h-1 rounded-full bg-white/40"></span>
                  <span className="w-1 h-1 rounded-full bg-white/40"></span>
                  <span className="w-1 h-1 rounded-full bg-white/40"></span>
                </div>
              </div>

              {/* Fake Terminal Body */}
              <div className="space-y-4">
                <h2 className="text-4xl font-bold text-white tracking-tight">MARGVEDHA</h2>
                <p className="text-slate-300 font-light leading-relaxed max-w-sm">
                  This platform teaches you how to map transitive vulnerabilities across deep dependency graphs and instantly patch them via AI.
                </p>
              </div>

              {/* Fake Terminal Footer */}
              <div className="mt-12">
                <button 
                  onClick={handleLogin}
                  className="bg-primary/20 hover:bg-primary/30 text-primary-foreground border border-primary/30 px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors"
                >
                  <Bot className="w-5 h-5" />
                  Start Challenge
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 hover:border-primary/20 transition-colors">
            <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 text-primary">
              <GitBranch className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-slate-900">Vulnerability Graphing</h3>
            <p className="text-slate-600 leading-relaxed">
              Instantly visualize exactly how deep transitive CVEs propagate up to your root projects using interactive dependency tree models.
            </p>
          </div>
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 hover:border-primary/20 transition-colors">
            <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6 text-emerald-600">
              <Zap className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-slate-900">Live OSINT Feeds</h3>
            <p className="text-slate-600 leading-relaxed">
              We query real-time threat intelligence from OSV.dev and CISA KEV without executing any untrusted installation scripts.
            </p>
          </div>
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 hover:border-purple-200 transition-colors">
            <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center mb-6 text-purple-600">
              <Bot className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-slate-900">AI Remediation</h3>
            <p className="text-slate-600 leading-relaxed">
              Powered by Sarvam AI. Generate custom, 3-step actionable patching strategies instantly instead of parsing raw CVE logs.
            </p>
          </div>
        </div>

        {/* Why GitHub & ZIP Section */}
        <div className="mt-32">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">Enterprise-Grade Source Control Integration</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">Why does MARGVEDHA exclusively analyze GitHub repositories and local ZIP archives?</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-slate-900 text-white p-8 rounded-3xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-20">
                <GitBranch className="w-24 h-24" />
              </div>
              <h3 className="text-2xl font-bold mb-4 relative z-10">Shift-Left Security via GitHub</h3>
              <p className="text-slate-300 leading-relaxed relative z-10">
                We intercept vulnerabilities at the <strong>source code level</strong> before they ever reach production. GitHub is the industry standard where over 90% of modern supply chains begin. By natively scanning the repo directly, we catch zero-day flaws while the developer is still coding—dramatically reducing the cost and risk of patching a live server later.
              </p>
            </div>
            
            <div className="bg-white border border-slate-200 p-8 rounded-3xl shadow-xl shadow-slate-200/50 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-5">
                <Shield className="w-24 h-24" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-slate-900 relative z-10">Air-Gapped Enterprise ZIP Support</h3>
              <p className="text-slate-600 leading-relaxed relative z-10">
                Many banks, defense contractors, and high-security enterprises work in strict <strong>Air-Gapped environments</strong> (no internet access) and legally cannot host code on public Git platforms. Our local ZIP upload feature ensures they can securely analyze proprietary source code without exposing their Git history to external networks.
              </p>
            </div>
          </div>
        </div>

        {/* Pricing Notice */}
        <div className="mt-32 bg-slate-900 text-white rounded-3xl p-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary via-slate-900 to-slate-900"></div>
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl font-bold">Simple, Transparent Pricing</h2>
            <p className="text-slate-300 text-lg">
              Every user gets exactly <strong>10 free repository scans</strong> to test the power of MARGVEDHA. 
              After your quota is reached, enterprise-grade deep scanning is available for ₹500 per repository.
            </p>
            <button onClick={handleLogin} className="mt-4 bg-white text-slate-900 hover:bg-slate-100 px-8 py-3 rounded-full font-semibold transition-colors">
              Get Started for Free
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
