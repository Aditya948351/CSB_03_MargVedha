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
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[2000px] max-w-[100vw] h-[80vh] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-emerald-400/10 to-transparent blur-[120px]"></div>
        <div className="absolute top-1/3 -left-[20%] w-[1000px] h-[1000px] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-400/10 via-transparent to-transparent blur-[100px]"></div>
        <div className="absolute bottom-0 -right-[10%] w-[1000px] h-[1000px] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-400/10 via-transparent to-transparent blur-[100px] translate-y-1/2"></div>
      </div>

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
              <div className="mt-12 flex items-center gap-6">
                <button 
                  onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                  className="bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-full font-bold shadow-[0_0_40px_-10px_rgba(14,165,233,0.5)] transition-all flex items-center gap-3 cursor-pointer"
                >
                  Explore Platform
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => document.getElementById('competitors')?.scrollIntoView({ behavior: 'smooth' })}
                  className="text-slate-400 hover:text-white font-medium flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <Bot className="w-5 h-5 text-primary" />
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
          
          <div className="space-y-32 relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-0 bottom-0 left-1/2 w-0.5 bg-gradient-to-b from-blue-500/20 via-emerald-500/20 to-purple-500/20 -z-10"></div>

            {/* Step 1 */}
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div className="order-2 md:order-1 bg-white p-8 rounded-3xl border border-slate-200 shadow-2xl shadow-blue-500/10 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-blue-600"></div>
                <div className="border-2 border-dashed border-slate-300 rounded-2xl p-12 flex flex-col items-center justify-center text-center bg-slate-50">
                  <UploadCloud className="w-16 h-16 text-blue-500 mb-4" />
                  <div className="text-slate-900 font-bold text-lg mb-2">Drag & Drop ZIP Archive</div>
                  <div className="text-slate-500 text-sm">or paste a GitHub Repository URL</div>
                  <div className="mt-6 w-full max-w-xs h-10 bg-white rounded-lg border border-slate-200 flex items-center px-4">
                    <span className="text-slate-400 text-sm">https://github.com/org/repo</span>
                  </div>
                </div>
              </div>
              <div className="order-1 md:order-2 relative">
                <div className="absolute top-1/2 -left-[4.5rem] w-8 h-8 rounded-full bg-slate-900 text-white font-bold hidden md:flex items-center justify-center border-4 border-white shadow-lg shadow-blue-500/20 transform -translate-y-1/2 z-10">1</div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 font-bold tracking-wide text-xs mb-4">
                  STEP 1: INGESTION
                </div>
                <h3 className="text-3xl font-bold mb-4 text-slate-900">Upload or Connect</h3>
                <p className="text-lg text-slate-600 leading-relaxed">
                  Paste a GitHub link or securely upload an air-gapped ZIP archive. We immediately extract manifest files, analyze the supply chain, and trace deep dependencies without executing unverified code.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div className="relative">
                <div className="absolute top-1/2 -right-[4.5rem] w-8 h-8 rounded-full bg-slate-900 text-white font-bold hidden md:flex items-center justify-center border-4 border-white shadow-lg shadow-emerald-500/20 transform -translate-y-1/2 z-10">2</div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 font-bold tracking-wide text-xs mb-4">
                  STEP 2: ANALYSIS
                </div>
                <h3 className="text-3xl font-bold mb-4 text-slate-900">Graph Generation</h3>
                <p className="text-lg text-slate-600 leading-relaxed">
                  Our engine cross-references OSV.dev and CISA KEV to instantly render an interactive, color-coded node graph. Visually trace exactly how a CVE propagates from a transitive sub-dependency up to your root project.
                </p>
              </div>
              <div className="bg-[#0f172a] p-8 rounded-3xl border border-slate-700 shadow-2xl shadow-emerald-500/10 relative overflow-hidden h-[300px] flex items-center justify-center">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-500/10 via-transparent to-transparent"></div>
                {/* Fake Graph Nodes */}
                <div className="relative w-full h-full">
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 w-32 px-4 py-2 bg-emerald-500/20 border border-emerald-500/50 rounded-lg text-emerald-400 text-xs font-mono text-center z-10">Root Project</div>
                  <div className="absolute top-24 left-1/4 w-28 px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-slate-300 text-xs font-mono text-center z-10">lodash</div>
                  <div className="absolute top-24 right-1/4 w-28 px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-slate-300 text-xs font-mono text-center z-10">react</div>
                  <div className="absolute bottom-12 left-1/3 w-32 px-4 py-2 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-xs font-mono text-center z-10 shadow-[0_0_15px_rgba(239,68,68,0.3)]">CVE-2023-XXXX</div>
                  {/* Fake Lines */}
                  <div className="absolute top-12 left-[35%] w-[1px] h-14 bg-slate-600 origin-top rotate-45"></div>
                  <div className="absolute top-12 right-[35%] w-[1px] h-14 bg-slate-600 origin-top -rotate-45"></div>
                  <div className="absolute top-32 left-[30%] w-[1px] h-20 bg-red-500/50 origin-top -rotate-12"></div>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div className="order-2 md:order-1 bg-white p-6 rounded-3xl border border-slate-200 shadow-2xl shadow-purple-500/10 relative overflow-hidden">
                <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                  <div className="bg-slate-100 border-b border-slate-200 px-4 py-3 flex items-center gap-2">
                    <GitBranch className="w-4 h-4 text-slate-500" />
                    <span className="text-sm font-medium text-slate-700">MargVedha CyberSec wants to merge 1 commit</span>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                        <Bot className="w-6 h-6 text-purple-600" />
                      </div>
                      <div>
                        <div className="text-slate-900 font-bold text-sm">Automated Security Patch: CVE-2023-XXXX</div>
                        <div className="text-slate-500 text-xs">Generated by MargVedha CyberSec</div>
                      </div>
                    </div>
                    <div className="bg-slate-900 rounded-lg p-4 font-mono text-xs text-slate-300">
                      <div className="text-red-400">- "lodash": "^4.17.20"</div>
                      <div className="text-emerald-400">+ "lodash": "^4.17.21"</div>
                    </div>
                    <div className="mt-4 flex justify-end">
                      <div className="bg-emerald-500 text-white px-4 py-2 rounded-md text-sm font-bold shadow-md">Merge Pull Request</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="order-1 md:order-2 relative">
                <div className="absolute top-1/2 -left-[4.5rem] w-8 h-8 rounded-full bg-slate-900 text-white font-bold hidden md:flex items-center justify-center border-4 border-white shadow-lg shadow-purple-500/20 transform -translate-y-1/2 z-10">3</div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 text-purple-600 font-bold tracking-wide text-xs mb-4">
                  STEP 3: REMEDIATION
                </div>
                <h3 className="text-3xl font-bold mb-4 text-slate-900">Simulate & Auto-Patch</h3>
                <p className="text-lg text-slate-600 leading-relaxed">
                  Preview how a package upgrade resolves the tree, generate a MargVedha CyberSec patch strategy, and securely open a Pull Request directly to your GitHub repository with one click.
                </p>
              </div>
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
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 hover:border-primary/20 transition-colors">
            <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center mb-6 text-amber-600">
              <Shield className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-slate-900">Zero-Day Intelligence</h3>
            <p className="text-slate-600 leading-relaxed">
              Stay ahead of emerging threats with proactive zero-day vulnerability scanning before they hit the national vulnerability databases.
            </p>
          </div>
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 hover:border-primary/20 transition-colors">
            <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6 text-indigo-600">
              <Activity className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-slate-900">CI/CD Integration</h3>
            <p className="text-slate-600 leading-relaxed">
              Seamlessly bake supply chain security into your pipelines. Automatically block builds that introduce critical unpatched vulnerabilities.
            </p>
          </div>
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 hover:border-primary/20 transition-colors">
            <div className="w-14 h-14 bg-rose-50 rounded-2xl flex items-center justify-center mb-6 text-rose-600">
              <UploadCloud className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-slate-900">Automated Pull Requests</h3>
            <p className="text-slate-600 leading-relaxed">
              Don't just detect vulnerabilities—fix them. One-click patch deployment generates and merges security updates directly into your repository.
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
            <div className="bg-white border border-amber-100 p-8 rounded-3xl shadow-lg relative">
              <h3 className="text-xl font-bold mb-3 text-slate-900">Context-Aware Prioritization</h3>
              <p className="text-slate-600 leading-relaxed">
                CVSS scores are not enough. We contextualize risk by factoring in Exploit Prediction Scoring System (EPSS) data to prioritize what actually matters to your specific architecture.
              </p>
            </div>
            <div className="bg-white border border-purple-100 p-8 rounded-3xl shadow-lg relative">
              <h3 className="text-xl font-bold mb-3 text-slate-900">Zero-Trust Architecture</h3>
              <p className="text-slate-600 leading-relaxed">
                We never execute untrusted `npm install` or `pip install` commands. Our static ingestion engine safely parses manifests without exposing your host machine to malicious post-install scripts.
              </p>
            </div>
            <div className="bg-white border border-rose-100 p-8 rounded-3xl shadow-lg relative">
              <h3 className="text-xl font-bold mb-3 text-slate-900">One-Click Workflows</h3>
              <p className="text-slate-600 leading-relaxed">
                Legacy tools generate a PDF report that sits in an inbox. MARGVEDHA translates findings into an actionable GitHub Pull Request with a single click, completely closing the remediation loop.
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

      {/* Massive Rich Footer */}
      <footer id="company" className="bg-slate-950 text-slate-400 pt-20 pb-10 border-t border-slate-800 w-full relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent opacity-50 pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            {/* Brand Column */}
            <div className="space-y-6">
              <img src="/MargVedha_Logo.png" alt="MargVedha Logo" className="h-12 w-auto object-contain brightness-0 invert opacity-90" />
              <p className="text-sm text-slate-500 leading-relaxed">
                The first AI-native platform for deep supply chain vulnerability graphing, zero-day intelligence, and automated remediation. Secure your transitive dependencies before they reach production.
              </p>
              <div className="flex items-center gap-4">
                <a href="https://github.com/Aditya948351/CSB_03_MargVedha" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center hover:bg-primary/20 hover:text-primary transition-colors cursor-pointer text-slate-400">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" /></svg>
                </a>
              </div>
            </div>

            {/* Platform Links */}
            <div>
              <h4 className="text-slate-100 font-bold mb-6 tracking-wide text-sm uppercase">Platform</h4>
              <ul className="space-y-4 text-sm">
                <li><a href="#how-it-works" className="hover:text-primary transition-colors">How it Works</a></li>
                <li><a href="#features" className="hover:text-primary transition-colors">Vulnerability Graphing</a></li>
                <li><a href="#features" className="hover:text-primary transition-colors">AI Remediation</a></li>
                <li><a href="#competitors" className="hover:text-primary transition-colors">Enterprise Security</a></li>
                <li><a href="#pricing" className="hover:text-primary transition-colors">Pricing & Plans</a></li>
              </ul>
            </div>

            {/* Resources Links */}
            <div>
              <h4 className="text-slate-100 font-bold mb-6 tracking-wide text-sm uppercase">Resources</h4>
              <ul className="space-y-4 text-sm">
                <li><a href="#" className="hover:text-primary transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">API Reference</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Security Blog</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Threat Intelligence</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Case Studies</a></li>
              </ul>
            </div>

            {/* Contact / Developer */}
            <div>
              <h4 className="text-slate-100 font-bold mb-6 tracking-wide text-sm uppercase">Contact Us</h4>
              <p className="text-sm text-slate-500 mb-4">
                Have questions about enterprise deployment or air-gapped environments?
              </p>
              <a href="mailto:devpathind.community@gmail.com" className="inline-flex items-center justify-center bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors w-full mb-4 gap-2">
                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                devpathind.community@gmail.com
              </a>
              <div className="text-xs text-slate-600 bg-slate-900 p-3 rounded-lg border border-slate-800 text-center">
                Built with ❤️ for securing the supply chain.
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-600">
            <p>© {new Date().getFullYear()} MARGVEDHA. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-slate-400 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-slate-400 transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-slate-400 transition-colors">Security</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
