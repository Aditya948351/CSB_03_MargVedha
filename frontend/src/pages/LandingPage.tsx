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
            <div className="bg-primary/10 p-2 rounded-lg">
              <Shield className="w-8 h-8 text-primary" />
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

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 py-20 lg:py-32">
        <div className="text-center max-w-4xl mx-auto space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-700 font-medium text-sm mb-4 border border-blue-100">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            SaaS Security Ecosystem
          </div>
          <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.1]">
            Trace the Risk.<br />
            <span className="bg-gradient-to-r from-primary to-emerald-500 bg-clip-text text-transparent">Secure the Path.</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            MARGVEDHA is an advanced cybersecurity SaaS platform that analyzes your software supply chain using Directed Acyclic Graphs, OSINT feeds, and AI-driven remediation to stop zero-day vulnerabilities before they reach production.
          </p>
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={handleLogin}
              disabled={isLoggingIn}
              className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all shadow-xl shadow-slate-900/20 flex items-center justify-center gap-2 group"
            >
              {isLoggingIn ? <Loader2 className="w-5 h-5 animate-spin" /> : "Try our Demo"}
              {!isLoggingIn && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
            </button>
            <p className="text-sm text-slate-500 font-medium">Free for up to 10 repository scans.</p>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-32">
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
