import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithPopup } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, googleProvider, db } from '../firebase';
import { useAppStore } from '../store';
import { Shield, GitBranch, Zap, Bot, ArrowRight, Loader2, UploadCloud, Activity, Wrench } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();
  const { user, setUser, setScanCount } = useAppStore();
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogin = async () => {
    if (user) {
      navigate('/dashboard');
      return;
    }
    
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
    <div className="w-full min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-primary/20 relative overflow-x-hidden">
      {/* Massive Background Glowing Orbs similar to Sarvam */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[2000px] max-w-[100vw] h-[80vh] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-emerald-400/10 to-transparent blur-[120px] -z-10 pointer-events-none"></div>
      <div className="absolute top-1/3 left-[-20%] w-[1000px] h-[1000px] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-400/10 via-transparent to-transparent blur-[100px] -z-10 pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[1000px] h-[1000px] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-400/10 via-transparent to-transparent blur-[100px] -z-10 pointer-events-none"></div>

      {/* Navbar */}
      <nav className="border-b border-slate-200/50 bg-white/60 backdrop-blur-xl sticky top-0 z-50 w-full">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-12">
            <img src="/MargVedha_Logo.png" alt="MargVedha Logo" className="h-14 w-auto object-contain" />
            
            {/* Nav Tabs */}
            <div className="hidden md:flex items-center gap-8 font-medium text-sm text-slate-600">
              <a href="#how-it-works" className="hover:text-primary transition-colors">Products</a>
              <a href="#features" className="hover:text-primary transition-colors">Features</a>
              <a href="#pricing" className="hover:text-primary transition-colors">Developers</a>
              <a href="#company" className="hover:text-primary transition-colors">Company</a>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <button 
                onClick={() => navigate('/dashboard')}
                className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-2.5 rounded-full font-medium transition-all shadow-lg flex items-center gap-2"
              >
                Go to Dashboard
              </button>
            ) : (
              <button 
                onClick={handleLogin}
                disabled={isLoggingIn}
                className="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-full font-medium transition-all shadow-lg shadow-primary/25 disabled:opacity-70 flex items-center gap-2"
              >
                {isLoggingIn ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
                Login
              </button>
            )}
          </div>
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
                  onClick={() => document.getElementById('competitors')?.scrollIntoView({ behavior: 'smooth' })}
                  className="bg-primary/20 hover:bg-primary/30 text-primary-foreground border border-primary/30 px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <Bot className="w-5 h-5" />
                  View the Gap
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

        {/* How It Works Pitch */}
        <div id="how-it-works" className="mt-32 mb-16 pt-16">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">How MARGVEDHA Works</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">From an uploaded repository to a merged GitHub patch in 3 simple steps.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connecting lines for desktop */}
            <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-0.5 bg-slate-200 -z-10 w-2/3 mx-auto"></div>

            {/* Step 1 */}
            <div className="text-center relative">
              <div className="w-24 h-24 mx-auto bg-white border-4 border-slate-50 shadow-xl shadow-slate-200/50 rounded-full flex items-center justify-center mb-6">
                <UploadCloud className="w-10 h-10 text-blue-500" />
              </div>
              <div className="absolute top-0 right-1/2 translate-x-12 -translate-y-2 w-8 h-8 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center border-4 border-white">1</div>
              <h3 className="text-xl font-bold mb-3 text-slate-900">Upload or Connect</h3>
              <p className="text-slate-600 leading-relaxed max-w-sm mx-auto">
                Paste a GitHub link or securely upload an air-gapped ZIP archive. We immediately extract manifest files and dependencies.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center relative">
              <div className="w-24 h-24 mx-auto bg-white border-4 border-slate-50 shadow-xl shadow-slate-200/50 rounded-full flex items-center justify-center mb-6">
                <Activity className="w-10 h-10 text-emerald-500" />
              </div>
              <div className="absolute top-0 right-1/2 translate-x-12 -translate-y-2 w-8 h-8 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center border-4 border-white">2</div>
              <h3 className="text-xl font-bold mb-3 text-slate-900">Graph Generation</h3>
              <p className="text-slate-600 leading-relaxed max-w-sm mx-auto">
                Our engine cross-references OSV.dev and CISA KEV to instantly render an interactive, color-coded node graph of vulnerability paths.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center relative">
              <div className="w-24 h-24 mx-auto bg-white border-4 border-slate-50 shadow-xl shadow-slate-200/50 rounded-full flex items-center justify-center mb-6">
                <Wrench className="w-10 h-10 text-purple-500" />
              </div>
              <div className="absolute top-0 right-1/2 translate-x-12 -translate-y-2 w-8 h-8 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center border-4 border-white">3</div>
              <h3 className="text-xl font-bold mb-3 text-slate-900">Simulate & Auto-Patch</h3>
              <p className="text-slate-600 leading-relaxed max-w-sm mx-auto">
                Preview how a package upgrade resolves the tree, generate a MargVedha CyberSec patch strategy, and 1-click open a Pull Request directly to GitHub.
              </p>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div id="features" className="grid md:grid-cols-3 gap-8 pt-16">
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
              Powered by the MargVedha CyberSec Model. Generate custom, 3-step actionable patching strategies instantly instead of parsing raw CVE logs.
            </p>
          </div>
        </div>

        {/* The Gap: Competitors Section */}
        <div id="competitors" className="mt-32 pt-16 border-t border-slate-200">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 text-slate-700 font-bold tracking-wide text-xs mb-4">
              THE INDUSTRY GAP
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-6">Beyond Traditional SCA Tools</h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
              While established tools like <strong>Snyk, GitHub Dependabot, OSV-Scanner, and OWASP Dependency-Track</strong> are excellent at <em>detecting</em> vulnerabilities, they output flat lists that leave developers guessing. MARGVEDHA doesn't replace these tools—it evolves the workflow to focus on <strong>explainability and remediation impact</strong>.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white border border-red-100 p-8 rounded-3xl shadow-lg relative">
              <h3 className="text-xl font-bold mb-3 text-slate-900">Explainable Propagation</h3>
              <p className="text-slate-600 leading-relaxed">
                Traditional tools tell you a package is vulnerable. We show you the <strong>complete dependency chain</strong> from your root application down to the vulnerable node, distinguishing between direct includes and structural transitive paths.
              </p>
            </div>
            <div className="bg-white border border-emerald-100 p-8 rounded-3xl shadow-lg relative">
              <h3 className="text-xl font-bold mb-3 text-slate-900">Remediation Simulation</h3>
              <p className="text-slate-600 leading-relaxed">
                Before risking a breaking change, developers can use MARGVEDHA to simulate a package upgrade. Preview exactly how a fix will alter the dependency graph and verify it resolves the vulnerability <em>before</em> creating a PR.
              </p>
            </div>
            <div className="bg-white border border-blue-100 p-8 rounded-3xl shadow-lg relative">
              <h3 className="text-xl font-bold mb-3 text-slate-900">Cross-Project Impact</h3>
              <p className="text-slate-600 leading-relaxed">
                Instead of fixing the same CVE repository by repository, we identify shared vulnerable dependencies across your entire enterprise portfolio, allowing you to prioritize high-impact global patches.
              </p>
            </div>
          </div>

          <div className="mt-16 bg-slate-50 border border-slate-200 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h4 className="font-bold text-slate-900 mb-2">Powered by Industry Standards</h4>
              <p className="text-sm text-slate-600 max-w-xl">
                We leverage authoritative data sources like <strong>OSV.dev</strong> for advisories, <strong>CISA KEV</strong> for wild-exploitation intelligence, and <strong>EPSS</strong> for probability metrics, combining them into our custom <strong>NetworkX</strong> propagation engine.
              </p>
            </div>
            <div className="flex gap-4 shrink-0 opacity-60">
              {/* Dummy logos for data sources */}
              <div className="font-bold text-lg font-mono">OSV.dev</div>
              <div className="font-bold text-lg font-mono">CISA</div>
            </div>
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
        <div id="pricing" className="mt-32 mb-16">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">Transparent Pricing</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">Start instantly. Scale when you need enterprise power.</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Tier */}
            <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-xl shadow-slate-200/50 flex flex-col">
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Developer Free</h3>
              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-4xl font-extrabold text-slate-900">₹0</span>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-center gap-3 text-slate-600"><div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0"></div> <strong>10 Free Repository Scans</strong></li>
                <li className="flex items-center gap-3 text-slate-600"><div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0"></div> Full Vulnerability Graphing</li>
                <li className="flex items-center gap-3 text-slate-600"><div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0"></div> Basic AI Remediation</li>
              </ul>
              <button onClick={handleLogin} className="w-full bg-primary/10 hover:bg-primary/20 text-primary font-semibold py-3 rounded-xl transition-colors">
                Start Free Trial
              </button>
            </div>

            {/* Enterprise Tier */}
            <div className="bg-slate-900 text-white rounded-3xl p-8 shadow-2xl relative overflow-hidden flex flex-col border border-slate-800 transform md:-translate-y-4">
              <div className="absolute top-0 right-0 bg-primary text-white text-xs font-bold px-3 py-1 rounded-bl-lg">RECOMMENDED</div>
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary via-slate-900 to-slate-900"></div>
              
              <div className="relative z-10 flex flex-col flex-1">
                <h3 className="text-2xl font-bold mb-2">Enterprise Pro</h3>
                <div className="flex items-baseline gap-2 mb-6">
                  <span className="text-4xl font-extrabold">₹500</span>
                  <span className="text-slate-400">/ scan</span>
                </div>
                <ul className="space-y-4 mb-8 flex-1">
                  <li className="flex items-center gap-3 text-slate-300"><div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0"></div> <strong>Unlimited Quota</strong></li>
                  <li className="flex items-center gap-3 text-slate-300"><div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0"></div> Cross-Project Impact Analysis</li>
                  <li className="flex items-center gap-3 text-slate-300"><div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0"></div> Advanced AI Patch Generation</li>
                  <li className="flex items-center gap-3 text-slate-300"><div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0"></div> One-Click PR Automation</li>
                </ul>
                <button onClick={handleLogin} className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 rounded-xl transition-colors shadow-lg shadow-primary/25">
                  Upgrade to Pro
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer id="company" className="bg-slate-900 text-slate-400 py-12 text-center border-t border-slate-800 w-full">
        <div className="max-w-7xl mx-auto px-6">
          <p className="mb-2">Built with ❤️ for securing the supply chain.</p>
          <p>Contact Developer: <a href="mailto:devpathind.community@gmail.com" className="text-primary hover:text-primary/80 transition-colors font-medium">devpathind.community@gmail.com</a></p>
        </div>
      </footer>
    </div>
  );
}
