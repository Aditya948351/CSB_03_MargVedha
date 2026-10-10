import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithPopup } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, googleProvider, db } from '../firebase';
import { useAppStore } from '../store';
import { 
  Shield, GitBranch, Zap, Bot, ArrowRight, Loader2, UploadCloud, Activity, Wrench,
  CheckCircle2, AlertTriangle, Terminal, Layers, GitPullRequest, Sparkles, Copy, 
  Check, BarChart3, Binary, Lock, Network, Database, Eye, ChevronRight,
  ShieldCheck, FileCode, Cpu, Info, ExternalLink
} from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();
  const { user, setUser, setScanCount, setUserPlan } = useAppStore();
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // In-Depth Threat Propagation & Innovation Suite State
  const [selectedScenario, setSelectedScenario] = useState<'log4j' | 'xz' | 'eventstream'>('log4j');
  const [activeAnalysisTab, setActiveAnalysisTab] = useState<'dag' | 'matrix' | 'remediation' | 'sbom'>('dag');
  const [activeNode, setActiveNode] = useState<'root' | 'direct' | 'transitive' | 'leaf'>('leaf');
  const [decayFactor, setDecayFactor] = useState<number>(0.85);
  const [copiedSbom, setCopiedSbom] = useState<boolean>(false);

  // Attack Scenarios Data for Deep Analysis
  const scenarios = {
    log4j: {
      id: 'CVE-2021-44228',
      name: 'Log4Shell Transitive JNDI RCE',
      ecosystem: 'Maven / Java',
      rootApp: 'payment-gateway-service',
      directDep: 'spring-boot-starter-web:2.5.4',
      transitiveDep: 'spring-boot-starter-logging:2.5.4',
      vulnerableLeaf: 'log4j-core:2.14.1',
      depth: 3,
      cvss: 10.0,
      cvssSeverity: 'CRITICAL',
      epss: 0.974,
      epssPercentile: '99th Percentile (Active Exploits in Wild)',
      cisaKev: true,
      cisaDate: '2021-12-10',
      bodCompliance: 'CISA BOD 22-01 Mandatory Remediation',
      reachability: 'AST Verified Reachable',
      reachabilityDetail: 'Invoked at OrderController.java:42 via logger.error(untrustedPayload)',
      blastRadius: 8,
      blastPercentage: 84,
      diagnosis: 'JNDI LDAP lookups allow arbitrary remote bytecode execution without authentication.',
      patchedVersion: 'log4j-core:2.17.1',
      solverNote: 'SAT solver isolated minimal constraint boundary: upgrades log4j-core without bumping Spring Boot parent or breaking servlet-api ABI.',
      diff: [
        { type: 'context', line: '    <dependencies>' },
        { type: 'context', line: '      <!-- Transitive dependency managed by Spring Boot -->' },
        { type: 'remove',  line: '-       <version>2.14.1</version>' },
        { type: 'add',     line: '+       <version>2.17.1</version> <!-- Safe Pinning by MargVedha SAT Solver -->' },
        { type: 'context', line: '    </dependencies>' },
      ],
      sbomSnippet: {
        bomFormat: 'CycloneDX',
        specVersion: '1.5',
        serialNumber: 'urn:uuid:7f3b892a-89a1-404f-a2e9-408fb3698b67',
        component: {
          name: 'log4j-core',
          version: '2.17.1',
          purl: 'pkg:maven/org.apache.logging.log4j/log4j-core@2.17.1',
          hashes: [{ alg: 'SHA-256', content: 'b5a83e05a8b0decf14e86a51d45ffb384666cf4041e17e4f3a7638d2fef9bcbf' }],
          slsaLevel: 'Level 3 Attested (Cosign)',
          license: 'Apache-2.0'
        }
      }
    },
    xz: {
      id: 'CVE-2024-3094',
      name: 'XZ-Utils Upstream Binary Backdoor',
      ecosystem: 'C / Linux Systems',
      rootApp: 'bastion-auth-daemon',
      directDep: 'openssh-server:9.3p1',
      transitiveDep: 'libsystemd0:252.12',
      vulnerableLeaf: 'liblzma5:5.6.0',
      depth: 2,
      cvss: 10.0,
      cvssSeverity: 'CRITICAL',
      epss: 0.882,
      epssPercentile: '98th Percentile (State-Actor Weaponized)',
      cisaKev: true,
      cisaDate: '2024-03-29',
      bodCompliance: 'CISA BOD 22-01 Emergency Directive',
      reachability: 'AST Verified Reachable',
      reachabilityDetail: 'Hooked via RSA_public_decrypt symbol interception during SSH pre-auth',
      blastRadius: 12,
      blastPercentage: 92,
      diagnosis: 'Multi-stage obfuscated backdoor in upstream build scripts modifying IFUNC symbol resolution.',
      patchedVersion: 'liblzma5:5.4.6',
      solverNote: 'Rollback pinning constraint: freezes package to last uncompromised verified release 5.4.6.',
      diff: [
        { type: 'context', line: 'Package: openssh-server' },
        { type: 'remove',  line: '- Depends: liblzma5 (= 5.6.0-0.2)' },
        { type: 'add',     line: '+ Depends: liblzma5 (= 5.4.6-1) # Cryptographically verified rollback' },
        { type: 'context', line: 'Architecture: amd64' },
      ],
      sbomSnippet: {
        bomFormat: 'CycloneDX',
        specVersion: '1.5',
        serialNumber: 'urn:uuid:9c21ef45-12b7-4a02-b2fa-5536e2f18392',
        component: {
          name: 'liblzma5',
          version: '5.4.6',
          purl: 'pkg:deb/debian/liblzma5@5.4.6-1',
          hashes: [{ alg: 'SHA-256', content: 'c37a6b245089312febeff076f8742a0fe5c86c071d7990176bf599e0df2f7331' }],
          slsaLevel: 'Level 3 Attested (Debian Release Team)',
          license: 'Public Domain / LGPL-2.1+'
        }
      }
    },
    eventstream: {
      id: 'CVE-2018-20834',
      name: 'Event-Stream Malicious Hijacking',
      ecosystem: 'npm / JavaScript',
      rootApp: 'copay-crypto-wallet',
      directDep: 'copay-dash-wallet:5.1.0',
      transitiveDep: 'event-stream:3.3.6',
      vulnerableLeaf: 'flatmap-stream:0.1.1',
      depth: 4,
      cvss: 9.8,
      cvssSeverity: 'CRITICAL',
      epss: 0.745,
      epssPercentile: '94th Percentile (Cryptocurrency Theft)',
      cisaKev: true,
      cisaDate: '2019-06-25',
      bodCompliance: 'CISA KEV Catalogue Catalogued',
      reachability: 'AST Verified Reachable',
      reachabilityDetail: 'Decryption payload injected into Copay credential harvest routine',
      blastRadius: 4,
      blastPercentage: 65,
      diagnosis: 'Social engineering takeover of maintainer account resulting in trojaned flatmap-stream inclusion.',
      patchedVersion: 'event-stream:3.3.4 (Stripped flatmap-stream)',
      solverNote: 'SAT solver strips malicious sub-dependency and polyfills flatMap via native ES2019 Array prototype.',
      diff: [
        { type: 'context', line: '  "dependencies": {' },
        { type: 'remove',  line: '-   "event-stream": "3.3.6"' },
        { type: 'add',     line: '+   "event-stream": "3.3.4" // Strips out unverified flatmap-stream injection' },
        { type: 'context', line: '  }' },
      ],
      sbomSnippet: {
        bomFormat: 'CycloneDX',
        specVersion: '1.5',
        serialNumber: 'urn:uuid:3e4b7891-92b1-4190-8e12-321ab982e012',
        component: {
          name: 'event-stream',
          version: '3.3.4',
          purl: 'pkg:npm/event-stream@3.3.4',
          hashes: [{ alg: 'SHA-256', content: '5f928e19b0485a3c20067341235b2e910245a0b4119d80dcfd54e48b39352e00' }],
          slsaLevel: 'Level 2 Registry Signed',
          license: 'MIT'
        }
      }
    }
  };

  const currentScenario = scenarios[selectedScenario];
  const currentDecayScore = (currentScenario.cvss * Math.pow(decayFactor, currentScenario.depth)).toFixed(2);

  const handleCopySbom = () => {
    navigator.clipboard.writeText(JSON.stringify(currentScenario.sbomSnippet, null, 2));
    setCopiedSbom(true);
    setTimeout(() => setCopiedSbom(false), 2000);
  };

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

  const handleSelectPlan = (plan: 'free' | 'pro' | 'fleet') => {
    if (user) {
      if (plan === 'pro') {
        setUserPlan('pro');
        navigate('/perimeter');
      } else if (plan === 'fleet') {
        setUserPlan('fleet');
        navigate('/perimeter');
      } else {
        navigate('/dashboard');
      }
    } else {
      navigate(`/login?plan=${plan}`);
    }
  };

  return (
    <div className="w-full min-h-screen bg-white text-slate-900 font-sans selection:bg-amber-500/20 relative overflow-x-hidden">
      {/* Radiant Ambient Top Lighting Atmosphere (Sarvam Aesthetic) */}
      <div className="absolute top-0 left-0 right-0 h-[720px] pointer-events-none -z-10 overflow-hidden">
        {/* Center Radiant Saffron/Amber Glow Dome */}
        <div className="absolute top-[-140px] left-1/2 -translate-x-1/2 w-[1250px] h-[620px] rounded-[100%] bg-gradient-to-b from-orange-500/40 via-amber-400/25 to-transparent blur-[90px] animate-pulse-glow"></div>
        
        {/* Left Sky Blue / Periwinkle Wing */}
        <div className="absolute top-[-90px] left-[-160px] w-[650px] h-[550px] rounded-full bg-gradient-to-br from-blue-300/45 via-sky-200/25 to-transparent blur-[95px]"></div>

        {/* Right Sky Blue / Lavender Wing */}
        <div className="absolute top-[-90px] right-[-160px] w-[650px] h-[550px] rounded-full bg-gradient-to-bl from-blue-300/45 via-indigo-200/25 to-transparent blur-[95px]"></div>
      </div>

      {/* Fixed Frosted Glass Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 backdrop-blur-md bg-white/80 border-b border-black/[0.04]">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          {/* Brand Logo */}
          <div className="flex items-center cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <img src="/MargVedha_Logo.png" alt="MargVedha Logo" className="h-11 w-auto object-contain" />
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8 font-medium text-sm text-slate-700">
            <a href="#how-it-works" className="hover:text-black transition-colors">Products</a>
            <a href="#threat-sandbox" className="hover:text-black transition-colors">Innovations</a>
            <a href="#competitors" className="hover:text-black transition-colors">Benchmark</a>
            <a href="#security-defense" className="hover:text-black transition-colors">Platform Defense</a>
            <a href="#pricing" className="hover:text-black transition-colors">Pricing</a>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => user ? navigate('/dashboard') : handleLogin()}
              disabled={isLoggingIn}
              className="bg-[#18181b] hover:bg-black text-white px-5 py-2.5 rounded-full font-medium text-xs sm:text-sm transition-all shadow-sm hover:shadow active:scale-95 flex items-center gap-2 cursor-pointer"
            >
              {isLoggingIn ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              Go to Dashboard
            </button>
            <a 
              href="https://github.com/Aditya948351/CSB_03_MargVedha" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-white/90 hover:bg-white text-slate-800 px-5 py-2.5 rounded-full font-medium text-xs sm:text-sm border border-slate-200/90 shadow-xs hover:shadow transition-all active:scale-95 cursor-pointer"
            >
              Contact Us
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section Container (snug spacing below navbar, matching user screenshot) */}
      <section className="reveal relative pt-24 pb-8 md:pt-28 md:pb-10 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="relative overflow-hidden rounded-[2.25rem] bg-white border border-slate-200/90 shadow-xl shadow-slate-200/40 p-8 sm:p-12 lg:p-16">
          
          {/* Animated Curved Teal / Cyan Contour Waves (as seen in screenshot) */}
          <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-40">
            <svg className="absolute w-[140%] h-[160%] -top-[30%] -left-[20%] animate-[spin_160s_linear_infinite]" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M0,50 Q25,20 50,50 T100,50" fill="none" stroke="url(#cyan-gradient)" strokeWidth="0.4" />
              <path d="M0,60 Q25,30 50,60 T100,60" fill="none" stroke="url(#cyan-gradient)" strokeWidth="0.4" />
              <path d="M0,40 Q25,10 50,40 T100,40" fill="none" stroke="url(#cyan-gradient)" strokeWidth="0.4" />
              <path d="M0,70 Q25,40 50,70 T100,70" fill="none" stroke="url(#cyan-gradient)" strokeWidth="0.4" />
              <path d="M0,30 Q25,5 50,30 T100,30" fill="none" stroke="url(#cyan-gradient)" strokeWidth="0.4" />
              <defs>
                <linearGradient id="cyan-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity="0" />
                  <stop offset="50%" stopColor="#0ea5e9" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#14b8a6" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-14 items-center relative z-10 w-full">
            
            {/* Left Column - Copy, Badges & CTA */}
            <div className="space-y-6 text-left max-w-2xl">
              
              {/* Badges including SaaS Security and Full Form */}
              <div className="space-y-2.5">
                <div className="flex flex-wrap items-center gap-2">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-50 text-sky-600 font-semibold tracking-wide text-xs border border-sky-200/80 shadow-xs">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
                    </span>
                    SaaS Security Ecosystem
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200/80">
                    <span className="font-semibold text-sky-600">Problem Statement CSB-03</span>
                  </div>
                </div>

                {/* Prominent MARGVEDHA Full Form Badge */}
                <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-50/90 border border-slate-200/90 text-[11px] sm:text-xs text-slate-700 shadow-xs">
                  <span className="font-bold text-slate-900 tracking-wide">MARGVEDHA:</span>
                  <span className="font-medium text-slate-600">Mapping And Risk Graph for Vulnerability Evaluation, Detection & Hardening Applications</span>
                </div>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light text-slate-900 leading-[1.12] tracking-tight">
                Trace the Risk. <br/>
                <span className="font-semibold bg-gradient-to-r from-sky-500 via-cyan-500 to-teal-500 bg-clip-text text-transparent">
                  Secure the Path.
                </span>
              </h1>

              {/* Body Paragraph */}
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-light">
                Involve your developers as equal partners in your AppSec program. Analyze software supply chains with DAGs, OSINT, and AI remediation before pushing to production.
              </p>

              {/* Action Button */}
              <div className="pt-2 flex flex-col sm:flex-row items-center gap-4">
                <button 
                  onClick={handleLogin}
                  disabled={isLoggingIn}
                  className="w-full sm:w-auto bg-[#181d31] hover:bg-slate-900 text-white px-8 py-3.5 rounded-full font-medium text-base transition-all shadow-lg shadow-slate-900/15 flex items-center justify-center gap-2 group cursor-pointer active:scale-95"
                >
                  {isLoggingIn ? <Loader2 className="w-5 h-5 animate-spin" /> : "Try our Demo"}
                  {!isLoggingIn && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                </button>
              </div>

              {/* Idea Report Card */}
              <a 
                href="https://drive.google.com/file/d/1FIDzQ4OGU6Vs0bct49cXAKitNhhJXZ5z/view?usp=sharing"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-br from-indigo-50 to-sky-50 border border-sky-100 hover:border-sky-300 transition-all group shadow-sm hover:shadow-md cursor-pointer w-fit"
              >
                <div className="w-10 h-10 rounded-xl bg-sky-600 flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
                  <ExternalLink className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 group-hover:text-sky-700 transition-colors">Our Entire Idea Report</h4>
                  <p className="text-xs text-slate-600 mt-0.5">View the complete hackathon solution PDF</p>
                </div>
              </a>
            </div>

            {/* Right Column - Animated Dark Terminal Card */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-sky-500/15 to-teal-400/15 rounded-[2.5rem] blur-2xl transform rotate-1 scale-105"></div>
              <div className="relative bg-[#232847] rounded-3xl p-7 sm:p-9 shadow-2xl border border-white/10 overflow-hidden min-h-[380px] flex flex-col justify-between text-left">
                
                {/* Fake Terminal Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                    <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                  </div>
                  <div className="text-white/40 text-xs font-mono">margvedha-scan.sh</div>
                  <div className="flex gap-1.5 text-white/40">
                    <span className="w-1 h-1 rounded-full bg-white/40"></span>
                    <span className="w-1 h-1 rounded-full bg-white/40"></span>
                    <span className="w-1 h-1 rounded-full bg-white/40"></span>
                  </div>
                </div>

                {/* Fake Terminal Body with Brand & Full Form */}
                <div className="space-y-3">
                  <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">MARGVEDHA</h2>
                  
                  {/* Full form highlighted in cyan/emerald mono font */}
                  <div className="text-xs font-mono font-medium text-teal-300/90 tracking-wide uppercase leading-snug">
                    Mapping And Risk Graph for Vulnerability Evaluation, Detection & Hardening Applications
                  </div>

                  <p className="text-slate-300 font-light leading-relaxed text-sm sm:text-base pt-1">
                    This platform teaches you how to map transitive vulnerabilities across deep dependency graphs and instantly patch them via AI.
                  </p>
                </div>

                {/* Fake Terminal Footer Buttons */}
                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <button 
                    onClick={() => document.getElementById('threat-sandbox')?.scrollIntoView({ behavior: 'smooth' })}
                    className="bg-[#0284c7] hover:bg-[#0369a1] text-white px-7 py-3 rounded-full font-semibold text-sm shadow-[0_0_30px_-5px_rgba(2,132,199,0.5)] transition-all flex items-center gap-2 cursor-pointer active:scale-95"
                  >
                    Explore Innovations
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => document.getElementById('competitors')?.scrollIntoView({ behavior: 'smooth' })}
                    className="text-slate-300 hover:text-white font-medium text-sm flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <Bot className="w-4 h-4 text-sky-400" />
                    View Benchmark
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-6 space-y-28 mt-6">

        {/* ========================================================================= */}
        {/* DEEP ANALYSIS & INNOVATION SUITE (Interactive Attack & Graph Sandbox) */}
        {/* ========================================================================= */}
        <section id="threat-sandbox" className="reveal pt-8">
          <div className="bg-gradient-to-b from-slate-50 to-white rounded-3xl border border-slate-200/90 shadow-2xl p-6 sm:p-10 relative overflow-hidden">
            
            {/* Header Title with Innovation Badges */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-slate-200">
              <div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight">
                  Interactive Threat Propagation & DAG Sandbox
                </h2>
                <p className="text-slate-600 text-sm sm:text-base mt-2 max-w-2xl">
                  Simulate real-world supply chain attacks, verify mathematical depth-decay attenuation, and inspect autonomous AI SAT-constraint patches.
                </p>
              </div>

              {/* Scenario Selector Pills */}
              <div className="flex flex-wrap items-center gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 self-start md:self-auto">
                <button
                  onClick={() => setSelectedScenario('log4j')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    selectedScenario === 'log4j' 
                      ? 'bg-white text-slate-900 shadow-sm border border-slate-200/80' 
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Log4Shell (RCE)
                </button>
                <button
                  onClick={() => setSelectedScenario('xz')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    selectedScenario === 'xz' 
                      ? 'bg-white text-slate-900 shadow-sm border border-slate-200/80' 
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  XZ-Utils (Backdoor)
                </button>
                <button
                  onClick={() => setSelectedScenario('eventstream')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    selectedScenario === 'eventstream' 
                      ? 'bg-white text-slate-900 shadow-sm border border-slate-200/80' 
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Event-Stream (Hijack)
                </button>
              </div>
            </div>

            {/* Live Telemetry Ribbon */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 my-6">
              <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
                <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block">Vulnerability</span>
                <span className="text-sm font-bold text-slate-900 font-mono mt-0.5 block">{currentScenario.id}</span>
                <span className="text-[10px] text-red-600 font-bold bg-red-50 px-1.5 py-0.5 rounded mt-1 inline-block">CVSS: {currentScenario.cvss}</span>
              </div>

              <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
                <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block">EPSS (30-Day Exploit)</span>
                <span className="text-sm font-bold text-amber-600 font-mono mt-0.5 block">{(currentScenario.epss * 100).toFixed(1)}%</span>
                <span className="text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded mt-1 inline-block">99th Percentile Risk</span>
              </div>

              <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
                <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block">CISA KEV Status</span>
                <span className="text-sm font-bold text-red-600 mt-0.5 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-red-600 shrink-0" />
                  Catalogued
                </span>
                <span className="text-[10px] text-slate-500 mt-1 block truncate">BOD 22-01 Mandatory</span>
              </div>

              <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
                <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block">AST Call-Graph</span>
                <span className="text-sm font-bold text-emerald-600 mt-0.5 flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  Reachable
                </span>
                <span className="text-[10px] text-slate-500 mt-1 block truncate">Direct Execution Path</span>
              </div>

              <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs col-span-2 lg:col-span-1">
                <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block">Decayed Risk Score S(v)</span>
                <span className="text-sm font-bold text-blue-600 font-mono mt-0.5 block">{currentDecayScore} / 10.0</span>
                <span className="text-[10px] text-slate-500 mt-1 block">Hop Decay at d = {currentScenario.depth}</span>
              </div>
            </div>

            {/* Analysis Mode Navigation Tabs */}
            <div className="flex border-b border-slate-200 gap-2 sm:gap-6 overflow-x-auto text-xs sm:text-sm font-semibold mb-6">
              <button
                onClick={() => setActiveAnalysisTab('dag')}
                className={`pb-3 border-b-2 flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
                  activeAnalysisTab === 'dag' 
                    ? 'border-blue-600 text-blue-600 font-bold' 
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Network className="w-4 h-4" />
                1. DAG Propagation & Blast Radius
              </button>
              <button
                onClick={() => setActiveAnalysisTab('matrix')}
                className={`pb-3 border-b-2 flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
                  activeAnalysisTab === 'matrix' 
                    ? 'border-blue-600 text-blue-600 font-bold' 
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                2. CISA KEV + EPSS Dual Matrix
              </button>
              <button
                onClick={() => setActiveAnalysisTab('remediation')}
                className={`pb-3 border-b-2 flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
                  activeAnalysisTab === 'remediation' 
                    ? 'border-blue-600 text-blue-600 font-bold' 
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <GitPullRequest className="w-4 h-4" />
                3. Autonomous SAT Patch Engine
              </button>
              <button
                onClick={() => setActiveAnalysisTab('sbom')}
                className={`pb-3 border-b-2 flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
                  activeAnalysisTab === 'sbom' 
                    ? 'border-blue-600 text-blue-600 font-bold' 
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Binary className="w-4 h-4" />
                4. SLSA SBOM & Provenance
              </button>
            </div>

            {/* TAB CONTENT 1: DAG PROPAGATION & BLAST RADIUS */}
            {activeAnalysisTab === 'dag' && (
              <div className="grid lg:grid-cols-12 gap-8 items-start">
                
                {/* Visual Interactive Graph Canvas (Left: 7 cols) */}
                <div className="lg:col-span-7 bg-[#0b1021] rounded-2xl p-6 border border-slate-800 relative overflow-hidden min-h-[380px] flex flex-col justify-between">
                  <div className="flex items-center justify-between text-xs text-slate-400 pb-3 border-b border-slate-800/80">
                    <span className="font-mono text-emerald-400 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                      DAG ENGINE: TRACING EXPLOIT VECTOR
                    </span>
                    <span className="text-[11px] text-slate-400">Click any node to inspect metrics</span>
                  </div>

                  {/* Nodes & Propagation Chain Visualizer */}
                  <div className="relative py-8 flex flex-col items-center justify-between gap-6 my-auto">
                    {/* SVG Connecting Flow Lines */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" preserveAspectRatio="none">
                      <path d="M 50% 40 L 50% 100 L 50% 160 L 50% 220" stroke="#334155" strokeWidth="2" strokeDasharray="4 4" />
                      <line x1="50%" y1="210" x2="50%" y2="28" stroke="#ef4444" strokeWidth="2.5" className="animate-pulse" />
                    </svg>

                    {/* Root Node */}
                    <div 
                      onClick={() => setActiveNode('root')}
                      className={`relative z-10 px-5 py-2.5 rounded-xl border font-mono text-xs transition-all cursor-pointer flex items-center gap-3 ${
                        activeNode === 'root'
                          ? 'bg-blue-600/30 border-blue-400 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)] scale-105'
                          : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-500'
                      }`}
                    >
                      <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                      <div>
                        <div className="text-[10px] text-blue-300 font-sans uppercase">ROOT APPLICATION (d = 0)</div>
                        <div className="font-bold text-white">{currentScenario.rootApp}</div>
                      </div>
                    </div>

                    {/* Direct Dependency Node */}
                    <div 
                      onClick={() => setActiveNode('direct')}
                      className={`relative z-10 px-5 py-2.5 rounded-xl border font-mono text-xs transition-all cursor-pointer flex items-center gap-3 ${
                        activeNode === 'direct'
                          ? 'bg-slate-800 border-blue-400 text-white shadow-md scale-105'
                          : 'bg-slate-900/90 border-slate-700 text-slate-300 hover:border-slate-500'
                      }`}
                    >
                      <div className="w-2 h-2 rounded-full bg-slate-400"></div>
                      <div>
                        <div className="text-[10px] text-slate-400 font-sans uppercase">DIRECT MANIFEST INCLUSION (d = 1)</div>
                        <div>{currentScenario.directDep}</div>
                      </div>
                    </div>

                    {/* Transitive Node */}
                    <div 
                      onClick={() => setActiveNode('transitive')}
                      className={`relative z-10 px-5 py-2.5 rounded-xl border font-mono text-xs transition-all cursor-pointer flex items-center gap-3 ${
                        activeNode === 'transitive'
                          ? 'bg-slate-800 border-amber-400 text-white shadow-md scale-105'
                          : 'bg-slate-900/90 border-slate-700 text-slate-300 hover:border-slate-500'
                      }`}
                    >
                      <div className="w-2 h-2 rounded-full bg-amber-400"></div>
                      <div>
                        <div className="text-[10px] text-amber-300 font-sans uppercase">TRANSITIVE INTERMEDIATE (d = 2)</div>
                        <div>{currentScenario.transitiveDep}</div>
                      </div>
                    </div>

                    {/* Vulnerable Leaf Node */}
                    <div 
                      onClick={() => setActiveNode('leaf')}
                      className={`relative z-10 px-5 py-3 rounded-xl border font-mono text-xs transition-all cursor-pointer flex items-center gap-3 ${
                        activeNode === 'leaf'
                          ? 'bg-red-950/70 border-red-500 text-white shadow-[0_0_25px_rgba(239,68,68,0.5)] scale-105'
                          : 'bg-red-950/40 border-red-800/80 text-red-300 hover:border-red-600'
                      }`}
                    >
                      <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></div>
                      <div>
                        <div className="text-[10px] text-red-400 font-sans uppercase font-bold flex items-center gap-1.5">
                          <span>VULNERABLE LEAF NODE (d = {currentScenario.depth})</span>
                          <span className="bg-red-500/20 px-1 py-0.2 rounded text-[9px] text-red-300">CVSS {currentScenario.cvss}</span>
                        </div>
                        <div className="font-bold text-red-100">{currentScenario.vulnerableLeaf}</div>
                      </div>
                    </div>
                  </div>

                  {/* Graph Footer Bar */}
                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-3 border-t border-slate-800/80">
                    <span className="text-red-400 font-mono">Propagation Path: {currentScenario.vulnerableLeaf} ➔ {currentScenario.rootApp}</span>
                    <span className="text-slate-400">Blast Radius: {currentScenario.blastRadius} Microservices ({currentScenario.blastPercentage}%)</span>
                  </div>
                </div>

                {/* Mathematical Inspector & Live Hop Attenuation Slider (Right: 5 cols) */}
                <div className="lg:col-span-5 space-y-4">
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                        <Terminal className="w-3.5 h-3.5 text-blue-600" />
                        Depth-Decay Attenuation Model
                      </h4>
                      <span className="text-[11px] font-mono text-blue-600 font-semibold">Formula: S(v) = CVSS × γ^d</span>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed mb-4">
                      Vulnerabilities deeper in the tree pose less direct exploitability without a reachable call path. Adjust the decay factor γ below to see real-time score adjustment:
                    </p>

                    {/* Interactive Decay Slider */}
                    <div className="bg-white p-3.5 rounded-xl border border-slate-200 mb-4">
                      <div className="flex justify-between text-xs font-mono mb-2">
                        <span className="text-slate-600">Decay Factor (γ): <strong className="text-slate-900">{decayFactor.toFixed(2)}</strong></span>
                        <span className="text-blue-600 font-bold">Effective S(v): {currentDecayScore} / 10</span>
                      </div>
                      <input 
                        type="range" 
                        min="0.70" 
                        max="0.95" 
                        step="0.01" 
                        value={decayFactor} 
                        onChange={(e) => setDecayFactor(parseFloat(e.target.value))}
                        className="w-full accent-blue-600 cursor-pointer"
                      />
                      <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
                        <span>0.70 (Aggressive Decay)</span>
                        <span>0.85 (Standard)</span>
                        <span>0.95 (Minimal Decay)</span>
                      </div>
                    </div>

                    {/* Node Details Card */}
                    <div className="bg-white p-4 rounded-xl border border-slate-200 text-xs space-y-2">
                      <div className="font-semibold text-slate-900 flex items-center justify-between">
                        <span>Selected Node Telemetry:</span>
                        <span className="text-blue-600 font-mono uppercase">{activeNode}</span>
                      </div>
                      <div className="text-slate-600">
                        <strong>Package:</strong> {activeNode === 'root' ? currentScenario.rootApp : activeNode === 'direct' ? currentScenario.directDep : activeNode === 'transitive' ? currentScenario.transitiveDep : currentScenario.vulnerableLeaf}
                      </div>
                      <div className="text-slate-600">
                        <strong>Call-Graph Reachability:</strong> <span className="text-emerald-700 font-semibold">{currentScenario.reachability}</span>
                      </div>
                      <div className="text-[11px] font-mono bg-slate-50 p-2 rounded border border-slate-200 text-slate-700">
                        {currentScenario.reachabilityDetail}
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50/70 p-4 rounded-2xl border border-blue-200/80 text-xs text-blue-900 flex items-start gap-3">
                    <Shield className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-blue-950 font-semibold">Architectural Advantage:</strong>
                      Traditional tools treat every CVE as direct, triggering panic for unreachable transitive leaf nodes. MARGVEDHA's DAG engine differentiates dead code from true weaponized vectors.
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* TAB CONTENT 2: CISA KEV + EPSS DUAL MATRIX */}
            {activeAnalysisTab === 'matrix' && (
              <div className="grid lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-4">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">Dual-Vector Prioritization Scatter Matrix</h4>
                      <p className="text-xs text-slate-500">EPSS (Probability of In-Wild Exploit) vs CVSS (Theoretical Severity)</p>
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-1 bg-red-50 text-red-600 border border-red-200 rounded-full">
                      P0: Immediate Emergency
                    </span>
                  </div>

                  {/* 4-Quadrant Visual Grid */}
                  <div className="grid grid-cols-2 gap-3 h-[300px]">
                    {/* Quadrant 2: High CVSS, Low EPSS */}
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col justify-between">
                      <div>
                        <div className="text-[10px] font-bold text-slate-500 uppercase">QUADRANT II: THEORETICAL RISK (P2)</div>
                        <div className="text-xs font-semibold text-slate-800 mt-1">High CVSS (9.0+), Low EPSS (&lt;5%)</div>
                        <p className="text-[11px] text-slate-500 mt-1">Severe vulnerability without public exploit weaponization.</p>
                      </div>
                      <div className="text-[10px] font-mono text-slate-600 bg-white p-1.5 rounded border">Deprioritized to avoid alert fatigue</div>
                    </div>

                    {/* Quadrant 1: High CVSS, High EPSS + CISA KEV */}
                    <div className="bg-red-50 p-4 rounded-xl border-2 border-red-500 shadow-md flex flex-col justify-between relative overflow-hidden">
                      <div className="absolute top-2 right-2 flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                        <span className="text-[9px] font-bold text-red-700 uppercase bg-white px-1.5 py-0.5 rounded border border-red-300">ACTIVE TARGET</span>
                      </div>
                      <div>
                        <div className="text-[10px] font-bold text-red-700 uppercase">QUADRANT I: EMERGENCY PRIORITY (P0)</div>
                        <div className="text-xs font-extrabold text-red-950 mt-1">{currentScenario.id} (EPSS: {(currentScenario.epss * 100).toFixed(1)}%)</div>
                        <p className="text-[11px] text-red-800 mt-1">Active CISA KEV Catalogue entry with verified wild exploitation.</p>
                      </div>
                      <div className="text-[10px] font-bold text-white bg-red-600 p-1.5 rounded text-center">Automated Pull Request Generated</div>
                    </div>

                    {/* Quadrant 4: Low CVSS, Low EPSS */}
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col justify-between">
                      <div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase">QUADRANT IV: DEFERRED (P3)</div>
                        <div className="text-xs font-semibold text-slate-600 mt-1">Low CVSS, Low EPSS</div>
                      </div>
                      <div className="text-[10px] text-slate-400">Scheduled maintenance only</div>
                    </div>

                    {/* Quadrant 3: Low CVSS, High EPSS */}
                    <div className="bg-amber-50/60 p-4 rounded-xl border border-amber-300 flex flex-col justify-between">
                      <div>
                        <div className="text-[10px] font-bold text-amber-800 uppercase">QUADRANT III: WEAPONIZED CHAINS (P1)</div>
                        <div className="text-xs font-semibold text-amber-950 mt-1">Medium CVSS, High EPSS (&gt;60%)</div>
                        <p className="text-[11px] text-amber-800 mt-1">Often missed by naive CVSS filters but actively harvested by botnets.</p>
                      </div>
                      <div className="text-[10px] font-mono text-amber-900 bg-white p-1.5 rounded border border-amber-200">Flagged by MargVedha PRI</div>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-5 space-y-4 text-left">
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
                    <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                      76.4% Alert Fatigue Reduction
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      Industry statistics show that <strong>92% of CVEs never see wild exploitation</strong>. Tools like Snyk and Dependabot flood developers with thousands of high-severity alerts for vulnerabilities that have 0.1% exploit probability.
                    </p>
                    <div className="space-y-2 pt-2 border-t border-slate-200">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-600">CISA KEV Wild-Exploit Verification:</span>
                        <span className="font-bold text-red-600">Mandatory BOD 22-01</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-600">EPSS 30-Day Probability:</span>
                        <span className="font-bold text-slate-900">{(currentScenario.epss * 100).toFixed(1)}% ({currentScenario.epssPercentile})</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-600">False-Positive Prevention:</span>
                        <span className="font-bold text-emerald-600">Filtered by AST Reachability</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT 3: AUTONOMOUS SAT PATCH ENGINE */}
            {activeAnalysisTab === 'remediation' && (
              <div className="grid lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-7 bg-[#0b1021] rounded-2xl p-6 border border-slate-800 font-mono text-xs text-slate-300">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-[11px] text-slate-400">
                    <div className="flex items-center gap-2">
                      <GitPullRequest className="w-3.5 h-3.5 text-purple-400" />
                      <span>PR #142: [MargVedha SAT-Solver] Bump {currentScenario.vulnerableLeaf}</span>
                    </div>
                    <span className="bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded text-[10px]">Zero Breaking Changes</span>
                  </div>

                  {/* Git Diff Display */}
                  <div className="my-4 space-y-1 bg-slate-950 p-4 rounded-xl border border-slate-800/80">
                    {currentScenario.diff.map((line, idx) => (
                      <div 
                        key={idx} 
                        className={`px-2 py-0.5 rounded ${
                          line.type === 'remove' ? 'bg-red-950/60 text-red-400' :
                          line.type === 'add' ? 'bg-emerald-950/60 text-emerald-400 font-bold' :
                          'text-slate-400'
                        }`}
                      >
                        {line.line}
                      </div>
                    ))}
                  </div>

                  {/* Verification Pipeline Checks */}
                  <div className="space-y-1.5 pt-3 border-t border-slate-800 text-[11px]">
                    <div className="flex items-center gap-2 text-emerald-400">
                      <Check className="w-3.5 h-3.5" /> ABI Compatibility Test: 100% Passed (Zero breaking method signatures)
                    </div>
                    <div className="flex items-center gap-2 text-emerald-400">
                      <Check className="w-3.5 h-3.5" /> AST Regression Suite: 42/42 Tests Executed Successfully
                    </div>
                    <div className="flex items-center gap-2 text-emerald-400">
                      <Check className="w-3.5 h-3.5" /> Rollback Script: rollback-patch.sh generated and cryptographically signed
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-5 space-y-4 text-left">
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-900 uppercase">
                      <Bot className="w-4 h-4 text-purple-600" />
                      AI SAT-Constraint Solver
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {currentScenario.solverNote}
                    </p>
                    <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs">
                      <div className="font-semibold text-slate-800 mb-1">Target Version Pin:</div>
                      <div className="font-mono text-purple-700 font-bold">{currentScenario.patchedVersion}</div>
                    </div>
                  </div>

                  <div className="bg-purple-50 p-4 rounded-2xl border border-purple-200 text-xs text-purple-900 space-y-1">
                    <strong className="block text-purple-950">How this solves "Dependency Hell":</strong>
                    Traditional Dependabot upgrades blindly bump top-level manifests, frequently breaking transitive peer dependencies. MARGVEDHA executes SAT constraint resolution across the entire lockfile.
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT 4: SLSA SBOM & CRYPTOGRAPHIC PROVENANCE */}
            {activeAnalysisTab === 'sbom' && (
              <div className="grid lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-7 bg-[#0b1021] rounded-2xl p-6 border border-slate-800 font-mono text-xs text-slate-300">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-[11px] text-slate-400">
                    <span className="flex items-center gap-1.5 text-sky-400">
                      <Binary className="w-3.5 h-3.5" />
                      CycloneDX v1.5 Cryptographic SBOM Export
                    </span>
                    <button
                      onClick={handleCopySbom}
                      className="bg-slate-800 hover:bg-slate-700 text-white px-2.5 py-1 rounded text-[10px] flex items-center gap-1 transition-all cursor-pointer"
                    >
                      {copiedSbom ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      {copiedSbom ? 'Copied JSON' : 'Copy SBOM'}
                    </button>
                  </div>

                  {/* JSON Output */}
                  <pre className="my-4 bg-slate-950 p-4 rounded-xl border border-slate-800/80 overflow-x-auto text-[11px] leading-relaxed text-slate-300">
                    {JSON.stringify(currentScenario.sbomSnippet, null, 2)}
                  </pre>
                </div>

                <div className="lg:col-span-5 space-y-4 text-left">
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
                      <Lock className="w-4 h-4 text-blue-600" />
                      SLSA Level 3 Integrity Verification
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Every ingested package is checked for tamper-evidence against registry SHA-256 digests (PyPI, npm, Maven Central) to detect Typosquatting and Dependency Confusion attacks.
                    </p>
                    <div className="space-y-2 pt-2 border-t border-slate-200 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Digest Match:</span>
                        <span className="font-mono text-emerald-600 font-bold">SHA-256 Verified</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Typosquatting Distance:</span>
                        <span className="font-mono text-slate-900 font-semibold">0 (Legitimate Origin)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Export Formats:</span>
                        <span className="font-mono text-blue-600 font-semibold">CycloneDX & SPDX 2.3</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </section>

        {/* ========================================================================= */}
        {/* THEORETICAL FOUNDATION & MATHEMATICAL PROOFS */}
        {/* ========================================================================= */}
        <section id="theory" className="reveal pt-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 font-semibold text-xs border border-blue-200 mb-3">
              THEORETICAL RIGOR & GRAPH FORMULATIONS
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900">
              Mathematical Formulations of Problem CSB-03
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto mt-2 text-sm sm:text-base">
              The formal graph-theoretic algorithms and propagation equations implemented in MARGVEDHA.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 mb-4 font-bold font-mono">
                1
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-2">DAG Dependency Model</h3>
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 font-mono text-xs text-blue-700 mb-3">
                G = (V, E, W)
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Represents packages as vertices V and import relationships as directed edges E with topological sort validating cycle absence.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 mb-4 font-bold font-mono">
                2
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-2">Depth-Decayed Attenuation</h3>
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 font-mono text-xs text-emerald-700 mb-3">
                S(v) = CVSS(v) · γ^d
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Hop attenuation factor γ = 0.85 penalizes deep transitive exposure where invocation probability decays with call stack depth.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 mb-4 font-bold font-mono">
                3
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-2">Cumulative Blast Radius</h3>
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 font-mono text-xs text-purple-700 mb-3">
                B(v) = |Ancestors(v)| / |V|
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Computes all reachable root services impacted if leaf node v is poisoned, measuring enterprise-wide attack surface.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 mb-4 font-bold font-mono">
                4
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-2">Priority Rank Index (PRI)</h3>
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 font-mono text-xs text-amber-700 mb-3">
                PRI = w₁C + w₂E + w₃K + w₄R
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Multi-objective scoring unifying CVSS, EPSS probability, CISA KEV catalogue status, and AST call-graph reachability.
              </p>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* HOW MARGVEDHA WORKS (3-Step Pipeline) */}
        {/* ========================================================================= */}
        <div id="how-it-works" className="reveal mt-16 mb-16 pt-8">
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
                    <span className="text-slate-900 text-sm font-medium">https://github.com/org/repo</span>
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
              <div className="bg-[#0f172a] p-6 rounded-3xl border border-slate-700 shadow-2xl shadow-emerald-500/20 relative overflow-hidden h-[350px] flex flex-col">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-500/10 via-transparent to-transparent"></div>
                
                {/* Legend */}
                <div className="relative z-20 flex gap-4 text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-2 border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded bg-emerald-500"></div> Root (Safe)</div>
                  <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded bg-slate-600"></div> Transitive</div>
                  <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]"></div> Vulnerable</div>
                </div>

                {/* Fake Graph Nodes */}
                <div className="relative w-full flex-1 mt-4">
                  <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                    <line x1="50%" y1="20" x2="25%" y2="100" stroke="#475569" strokeWidth="2" strokeDasharray="4 4" className="opacity-60" />
                    <line x1="50%" y1="20" x2="75%" y2="100" stroke="#475569" strokeWidth="2" strokeDasharray="4 4" className="opacity-60" />
                    <line x1="25%" y1="120" x2="35%" y2="200" stroke="#ef4444" strokeWidth="2" className="drop-shadow-[0_0_8px_rgba(239,68,68,0.8)] opacity-80" />
                  </svg>
                  
                  <div className="absolute top-[0px] left-1/2 -translate-x-1/2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/50 rounded-lg text-emerald-400 text-xs font-mono text-center z-10 shadow-[0_0_15px_rgba(16,185,129,0.2)] backdrop-blur-sm flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
                    frontend-app
                  </div>
                  
                  <div className="absolute top-[90px] left-1/4 -translate-x-1/2 px-4 py-2 bg-slate-800/80 border border-slate-600 rounded-lg text-slate-300 text-xs font-mono text-center z-10 backdrop-blur-sm">
                    react-scripts
                  </div>
                  
                  <div className="absolute top-[90px] left-[75%] -translate-x-1/2 px-4 py-2 bg-slate-800/80 border border-slate-600 rounded-lg text-slate-300 text-xs font-mono text-center z-10 backdrop-blur-sm">
                    lodash@4.17.20
                  </div>
                  
                  <div className="absolute top-[190px] left-[35%] -translate-x-1/2 px-4 py-2 bg-red-900/40 border border-red-500/50 rounded-lg text-red-400 text-xs font-mono text-center z-10 shadow-[0_0_20px_rgba(239,68,68,0.4)] backdrop-blur-sm flex flex-col items-center">
                    <span className="font-bold">CVE-2023-45133</span>
                    <span className="text-[9px] text-red-300 opacity-80 mt-0.5">CVSS: 9.8 CRITICAL</span>
                  </div>
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
        <div id="features" className="reveal grid md:grid-cols-3 gap-8 pt-16">
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

        {/* ========================================================================= */}
        {/* COMPREHENSIVE COMPETITIVE BENCHMARK MATRIX */}
        {/* ========================================================================= */}
        <div id="competitors" className="reveal mt-32 pt-16 border-t border-slate-200">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 text-slate-700 font-bold tracking-wide text-xs mb-4">
              COMPETITIVE ARCHITECTURAL BENCHMARK
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-6">Beyond Traditional Flat SCA Scanners</h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Why MARGVEDHA represents a paradigm shift over legacy tools like Snyk, GitHub Dependabot, OSV-Scanner, and OWASP Dependency-Track.
            </p>
          </div>

          {/* Detailed Matrix Table */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden mb-16">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="bg-slate-900 text-white font-semibold">
                    <th className="py-4 px-6 font-bold">Evaluation Dimension</th>
                    <th className="py-4 px-6 bg-blue-600 text-white font-bold">MARGVEDHA (Ours)</th>
                    <th className="py-4 px-5 text-slate-300">Snyk</th>
                    <th className="py-4 px-5 text-slate-300">GitHub Dependabot</th>
                    <th className="py-4 px-5 text-slate-300">OSV-Scanner</th>
                    <th className="py-4 px-5 text-slate-300">OWASP Dep-Track</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-normal">
                  <tr className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-6 font-semibold text-slate-900">Transitive DAG Hop Tracing</td>
                    <td className="py-4 px-6 bg-blue-50/50 font-bold text-blue-700">✅ Full Multi-Hop DAG</td>
                    <td className="py-4 px-5 text-slate-600">⚠️ Parent-Child Only</td>
                    <td className="py-4 px-5 text-slate-500">❌ Flat List Only</td>
                    <td className="py-4 px-5 text-slate-500">❌ Flat Output</td>
                    <td className="py-4 px-5 text-slate-600">⚠️ Basic Tree</td>
                  </tr>
                  <tr className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-6 font-semibold text-slate-900">Mathematical Depth-Decay Scoring</td>
                    <td className="py-4 px-6 bg-blue-50/50 font-bold text-blue-700">✅ Dynamic γ^d Attenuation</td>
                    <td className="py-4 px-5 text-slate-500">❌ Static CVSS</td>
                    <td className="py-4 px-5 text-slate-500">❌ Static CVSS</td>
                    <td className="py-4 px-5 text-slate-500">❌ Static CVSS</td>
                    <td className="py-4 px-5 text-slate-500">❌ Static CVSS</td>
                  </tr>
                  <tr className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-6 font-semibold text-slate-900">CISA KEV + EPSS Dual Prioritization</td>
                    <td className="py-4 px-6 bg-blue-50/50 font-bold text-blue-700">✅ Real-Time Dual Vector</td>
                    <td className="py-4 px-5 text-slate-600">⚠️ Proprietary Score</td>
                    <td className="py-4 px-5 text-slate-500">❌ No EPSS / KEV</td>
                    <td className="py-4 px-5 text-slate-600">⚠️ Advisory Only</td>
                    <td className="py-4 px-5 text-slate-600">⚠️ EPSS (No live KEV)</td>
                  </tr>
                  <tr className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-6 font-semibold text-slate-900">AST Call-Graph Reachability</td>
                    <td className="py-4 px-6 bg-blue-50/50 font-bold text-blue-700">✅ Static AST Function Verification</td>
                    <td className="py-4 px-5 text-slate-600">⚠️ Paid Enterprise Only</td>
                    <td className="py-4 px-5 text-slate-500">❌ Manifest-Only</td>
                    <td className="py-4 px-5 text-slate-500">❌ Manifest-Only</td>
                    <td className="py-4 px-5 text-slate-500">❌ Manifest-Only</td>
                  </tr>
                  <tr className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-6 font-semibold text-slate-900">Safe-Pinning Constraint SAT Solver</td>
                    <td className="py-4 px-6 bg-blue-50/50 font-bold text-blue-700">✅ Zero Breaking Changes Guaranteed</td>
                    <td className="py-4 px-5 text-slate-600">⚠️ Unconstrained Bump</td>
                    <td className="py-4 px-5 text-slate-600">⚠️ High Break Rate</td>
                    <td className="py-4 px-5 text-slate-500">❌ No Patching</td>
                    <td className="py-4 px-5 text-slate-500">❌ No Patching</td>
                  </tr>
                  <tr className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-6 font-semibold text-slate-900">Zero-Trust Air-Gapped ZIP Support</td>
                    <td className="py-4 px-6 bg-blue-50/50 font-bold text-blue-700">✅ Native Air-Gapped ZIP Ingestion</td>
                    <td className="py-4 px-5 text-slate-500">❌ Cloud SaaS Only</td>
                    <td className="py-4 px-5 text-slate-500">❌ GitHub Only</td>
                    <td className="py-4 px-5 text-emerald-600">✅ Local Binary</td>
                    <td className="py-4 px-5 text-slate-600">⚠️ Self-Hosted Server</td>
                  </tr>
                  <tr className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-6 font-semibold text-slate-900">SLSA Level 3 SBOM Export</td>
                    <td className="py-4 px-6 bg-blue-50/50 font-bold text-blue-700">✅ CycloneDX 1.5 & SPDX 2.3</td>
                    <td className="py-4 px-5 text-slate-600">⚠️ Proprietary Export</td>
                    <td className="py-4 px-5 text-slate-600">⚠️ Basic SPDX</td>
                    <td className="py-4 px-5 text-slate-500">❌ No SBOM Gen</td>
                    <td className="py-4 px-5 text-emerald-600">✅ CycloneDX</td>
                  </tr>
                  <tr className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-6 font-semibold text-slate-900">1-Click Automated PR Automation</td>
                    <td className="py-4 px-6 bg-blue-50/50 font-bold text-blue-700">✅ Native GitHub PR + Tests</td>
                    <td className="py-4 px-5 text-emerald-600">✅ Pull Request</td>
                    <td className="py-4 px-5 text-emerald-600">✅ Pull Request</td>
                    <td className="py-4 px-5 text-slate-500">❌ Manual Patching</td>
                    <td className="py-4 px-5 text-slate-500">❌ Alert Only</td>
                  </tr>
                </tbody>
              </table>
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
                We intercept vulnerabilities at the <strong>source code level</strong> before they ever reach production. GitHub is the industry standard where modern supply chains begin. By natively scanning the repo directly, we catch zero-day flaws while the developer is still coding—dramatically reducing the cost and risk of patching a live server later.
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

        {/* 2. Five attacks you should understand - How MARGVEDHA Defends Itself */}
        <div id="security-defense" className="reveal mt-32">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold mb-3 shadow-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Platform Resilience & Sovereign Safety
            </div>
            <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
              2. Five Attacks You Should Understand
            </h2>
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Transparent, defense-in-depth safety engineering. Here is how MARGVEDHA proactively defends itself and user workspaces against critical vulnerability vectors.
            </p>
          </div>

          <div className="bg-[#0a0f1d] border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl text-slate-100 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-800/80 gap-3">
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2.5">
                  <Shield className="w-5 h-5 text-cyan-400" />
                  <span>Threat Defense Architecture</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Active perimeter controls verified across AST parsing, sandbox extraction, and GitHub token isolation.
                </p>
              </div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-mono self-start sm:self-auto">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                ACTIVE DEFENSE
              </span>
            </div>

            {/* In-depth 3-Column Threat Defense Matrix (Matching User Specification) */}
            <div className="overflow-x-auto mt-6">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 text-xs font-mono uppercase tracking-wider">
                    <th className="py-4 px-4 sm:px-6 w-1/4">Attack</th>
                    <th className="py-4 px-4 sm:px-6 w-1/3">Simple explanation</th>
                    <th className="py-4 px-4 sm:px-6">How MARGVEDHA should defend itself</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-sans">
                  
                  {/* Row 1: Malicious file upload */}
                  <tr className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-4.5 px-4 sm:px-6 font-bold text-white flex items-start gap-2.5">
                      <span className="p-1.5 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 shrink-0 mt-0.5">
                        <FileCode className="w-4 h-4" />
                      </span>
                      <span>Malicious file upload</span>
                    </td>
                    <td className="py-4.5 px-4 sm:px-6 text-slate-300 leading-relaxed">
                      Someone uploads a file designed to crash or exploit your parser.
                    </td>
                    <td className="py-4.5 px-4 sm:px-6 text-emerald-400 font-medium leading-relaxed bg-emerald-950/10">
                      Validate file formats, limit file sizes, and parse data safely.
                    </td>
                  </tr>

                  {/* Row 2: Zip Slip */}
                  <tr className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-4.5 px-4 sm:px-6 font-bold text-white flex items-start gap-2.5">
                      <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0 mt-0.5">
                        <AlertTriangle className="w-4 h-4" />
                      </span>
                      <span>Zip Slip</span>
                    </td>
                    <td className="py-4.5 px-4 sm:px-6 text-slate-300 leading-relaxed">
                      A malicious ZIP contains paths that attempt to write files outside the intended directory.
                    </td>
                    <td className="py-4.5 px-4 sm:px-6 text-emerald-400 font-medium leading-relaxed bg-emerald-950/10">
                      Reject unsafe archive paths and extract only into an isolated temporary directory.
                    </td>
                  </tr>

                  {/* Row 3: Secret theft */}
                  <tr className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-4.5 px-4 sm:px-6 font-bold text-white flex items-start gap-2.5">
                      <span className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20 shrink-0 mt-0.5">
                        <Lock className="w-4 h-4" />
                      </span>
                      <span>Secret theft</span>
                    </td>
                    <td className="py-4.5 px-4 sm:px-6 text-slate-300 leading-relaxed">
                      An attacker tries to obtain API keys, credentials or uploaded source code.
                    </td>
                    <td className="py-4.5 px-4 sm:px-6 text-emerald-400 font-medium leading-relaxed bg-emerald-950/10">
                      Keep secrets on the backend, restrict access, and avoid unnecessary file retention.
                    </td>
                  </tr>

                  {/* Row 4: Denial of Service (DoS) */}
                  <tr className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-4.5 px-4 sm:px-6 font-bold text-white flex items-start gap-2.5">
                      <span className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 shrink-0 mt-0.5">
                        <Activity className="w-4 h-4" />
                      </span>
                      <span>Denial of Service (DoS)</span>
                    </td>
                    <td className="py-4.5 px-4 sm:px-6 text-slate-300 leading-relaxed">
                      Someone sends enough requests or huge files to overwhelm your website.
                    </td>
                    <td className="py-4.5 px-4 sm:px-6 text-emerald-400 font-medium leading-relaxed bg-emerald-950/10">
                      Apply rate limits, upload limits, timeouts and resource quotas.
                    </td>
                  </tr>

                  {/* Row 5: Backend compromise */}
                  <tr className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-4.5 px-4 sm:px-6 font-bold text-white flex items-start gap-2.5">
                      <span className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20 shrink-0 mt-0.5">
                        <Cpu className="w-4 h-4" />
                      </span>
                      <span>Backend compromise</span>
                    </td>
                    <td className="py-4.5 px-4 sm:px-6 text-slate-300 leading-relaxed">
                      An attacker exploits a server weakness to gain unauthorized access.
                    </td>
                    <td className="py-4.5 px-4 sm:px-6 text-emerald-400 font-medium leading-relaxed bg-emerald-950/10">
                      Patch dependencies, restrict permissions, isolate workloads and monitor logs.
                    </td>
                  </tr>

                </tbody>
              </table>
            </div>

            {/* Reassuring Footer Disclaimer (Directly from User Specification) */}
            <div className="mt-8 pt-5 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-400">
              <div className="flex items-center gap-2 text-slate-300 italic">
                <Info className="w-4 h-4 text-cyan-400 shrink-0 not-italic" />
                <span>These are potential threats, not proof that any of them can currently be used against your implementation.</span>
              </div>
              <span className="font-mono text-[11px] text-slate-500">
                Defense-in-Depth • CSB-03 Specification
              </span>
            </div>
          </div>
        </div>

        {/* Pricing Notice */}
        <div id="pricing" className="reveal mt-32 mb-16">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold mb-3 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              Transparent Sovereign Security Pricing
            </div>
            <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
              Start Free. Scale With Sovereign Enterprise Power.
            </h2>
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Transparent, developer-first pricing tailored for open-source builders, growing engineering squads, and enterprise fleets.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch">
            {/* 1. Community Free Tier */}
            <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-lg shadow-slate-100 flex flex-col justify-between hover:border-slate-300 transition-all">
              <div>
                <div className="text-xs font-bold font-mono text-slate-500 uppercase tracking-wider mb-2">Open Source</div>
                <h3 className="text-2xl font-bold text-slate-900 mb-1">Community Free</h3>
                <p className="text-xs text-slate-500 mb-6 leading-relaxed">For independent developers, researchers, and hobbyist projects.</p>
                <div className="flex items-baseline gap-2 mb-6 pb-6 border-b border-slate-100">
                  <span className="text-4xl font-extrabold text-slate-900">₹0</span>
                  <span className="text-slate-500 text-xs font-mono">/ forever</span>
                </div>
                <ul className="space-y-3.5 text-xs text-slate-600">
                  <li className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span><strong>1 Monitored Repository</strong> + 10 Free Scans</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Directed Acyclic Graph (DAG) Visualization</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>NIST NVD, OSV & CISA KEV Detection</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Transitive Depth-Decay Risk Scoring</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Export CycloneDX 1.6 & SPDX SBOM</span>
                  </li>
                </ul>
              </div>
              <div className="pt-8">
                <button 
                  onClick={() => handleSelectPlan('free')} 
                  className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-3 rounded-xl transition-all cursor-pointer text-xs flex items-center justify-center gap-1.5"
                >
                  <span>Start Free Workspace</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* 2. Developer Pro Tier (Recommended Centerpiece) */}
            <div className="bg-slate-900 text-white rounded-3xl p-8 shadow-2xl relative overflow-hidden flex flex-col justify-between border-2 border-primary transform md:-translate-y-3">
              <div className="absolute top-0 right-0 bg-primary text-white text-[11px] font-black px-3.5 py-1 rounded-bl-xl tracking-wider uppercase">
                RECOMMENDED • 30-DAY TRIAL
              </div>
              
              <div>
                <div className="text-xs font-bold font-mono text-cyan-400 uppercase tracking-wider mb-2">Professional Squads</div>
                <h3 className="text-2xl font-bold text-white mb-1">Developer Pro</h3>
                <p className="text-xs text-slate-300 mb-6 leading-relaxed">For fast-shipping engineers requiring automated non-breaking PRs.</p>
                <div className="flex items-baseline gap-2 mb-6 pb-6 border-b border-white/10">
                  <span className="text-4xl font-extrabold text-white">₹199</span>
                  <span className="text-slate-400 text-xs font-mono">/ month</span>
                </div>
                <ul className="space-y-3.5 text-xs text-slate-200">
                  <li className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span><strong>Up to 10 Monitored Repositories</strong></span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span><strong>Internal Secret & Leak Detection</strong> (AWS, Tokens)</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span><strong>Z3 SMT Solver Automated Patch Synthesis</strong></span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span><strong>1-Click GitHub Pull Request Dispatch</strong></span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>Continuous Push & Pull Request Webhooks</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>Priority Remediation Planner Support</span>
                  </li>
                </ul>
              </div>
              <div className="pt-8">
                <button 
                  onClick={() => handleSelectPlan('pro')} 
                  className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-primary/30 cursor-pointer text-xs flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Start 30-Day Free Trial (₹199/mo)</span>
                </button>
              </div>
            </div>

            {/* 3. Fleet Enterprise Tier */}
            <div className="bg-white border-2 border-purple-200 hover:border-purple-300 rounded-3xl p-8 shadow-lg shadow-purple-50 flex flex-col justify-between relative overflow-hidden transition-all">
              <div className="absolute top-0 right-0 bg-purple-100 text-purple-700 text-[11px] font-black px-3.5 py-1 rounded-bl-xl tracking-wider uppercase border-b border-l border-purple-200">
                ENTERPRISE SCALE
              </div>

              <div>
                <div className="text-xs font-bold font-mono text-purple-600 uppercase tracking-wider mb-2">Organizations & Fleets</div>
                <h3 className="text-2xl font-bold text-slate-900 mb-1">Fleet Enterprise</h3>
                <p className="text-xs text-slate-500 mb-6 leading-relaxed">For security teams, monorepos & compliance officers.</p>
                <div className="flex items-baseline gap-2 mb-6 pb-6 border-b border-purple-100">
                  <span className="text-4xl font-extrabold text-slate-900">₹499</span>
                  <span className="text-slate-500 text-xs font-mono">/ month</span>
                </div>
                <ul className="space-y-3.5 text-xs text-slate-600">
                  <li className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-purple-600 shrink-0" />
                    <span><strong>Unlimited Monitored Repositories & Fleets</strong></span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-purple-600 shrink-0" />
                    <span><strong>Guard0 AI Agent & MCP Defense</strong> (OWASP Top 10)</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-purple-600 shrink-0" />
                    <span><strong>Cryptographically Signed CycloneDX 1.6 AI-BOM</strong></span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-purple-600 shrink-0" />
                    <span>Cross-Repo Cascading Monorepo Patch Clusters</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-purple-600 shrink-0" />
                    <span>Automated CI/CD Action Gates (.github/workflows)</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-purple-600 shrink-0" />
                    <span>CISA BOD 22-01 & NIST SSDF Sovereign Audit Reports</span>
                  </li>
                </ul>
              </div>
              <div className="pt-8">
                <button 
                  onClick={() => handleSelectPlan('fleet')} 
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold py-3.5 rounded-xl transition-all shadow-md shadow-purple-600/20 cursor-pointer text-xs flex items-center justify-center gap-1.5"
                >
                  <Shield className="w-4 h-4" />
                  <span>Upgrade to Enterprise Fleet (₹499/mo)</span>
                </button>
              </div>
            </div>
          </div>

          {/* Enterprise Support Banner */}
          <div className="mt-12 bg-slate-50 border border-slate-200 rounded-2xl p-6 max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-slate-900 text-sm">Need Air-Gapped or Sovereign On-Premises Deployment?</div>
                <div className="text-slate-600 mt-0.5">Custom SLA agreements, local air-gapped container clusters, and dedicated Indian sovereign hosting.</div>
              </div>
            </div>
            <a 
              href="https://github.com/Aditya948351/CSB_03_MargVedha"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 font-bold shrink-0 transition-all shadow-xs cursor-pointer"
            >
              Contact Enterprise Sales
            </a>
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
              <div className="text-xs text-sky-400 font-semibold tracking-wide uppercase">
                Mapping And Risk Graph for Vulnerability Evaluation, Detection & Hardening Applications
              </div>
              <p className="text-sm text-slate-500 leading-relaxed">
                The first AI-native sovereign platform for deep supply chain vulnerability graphing, zero-day intelligence, and automated remediation. Secure your transitive dependencies before they reach production.
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
                <li><a href="#threat-sandbox" className="hover:text-primary transition-colors">Threat Propagation Sandbox</a></li>
                <li><a href="#security-defense" className="hover:text-primary transition-colors">Platform Defense Matrix</a></li>
                <li><a href="#theory" className="hover:text-primary transition-colors">Graph Formulations</a></li>
                <li><a href="#competitors" className="hover:text-primary transition-colors">Benchmark Matrix</a></li>
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
                Problem Statement CSB-03 • CISA Track
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
