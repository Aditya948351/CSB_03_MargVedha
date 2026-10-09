import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, GitBranch, Globe, Loader2, Shield, Activity, Database, Cpu } from 'lucide-react';
import { useAppStore } from '../store';

const processingSteps = [
  "Initializing MARGVEDHA core systems...",
  "Extracting workspace manifests...",
  "Constructing abstract syntax trees...",
  "Parsing dependencies from package.json/requirements.txt...",
  "Querying live OSV.dev vulnerability database...",
  "Cross-referencing CVE signatures...",
  "Building NetworkX topology graph...",
  "Calculating betweenness centrality modifiers...",
  "Evaluating EPSS & CVSS threat scores...",
  "Mapping transitive vulnerability vectors...",
  "Finalizing risk propagation..."
];

export default function ProjectImport() {
  const [activeTab, setActiveTab] = useState<'zip' | 'github' | 'website'>('zip');
  const [file, setFile] = useState<File | null>(null);
  const [githubUrl, setGithubUrl] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState('');
  
  // Animation states
  const [progress, setProgress] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);
  
  const navigate = useNavigate();
  const setScanResult = useAppStore(state => state.setScanResult);

  useEffect(() => {
    let progressInterval: number;
    let stepInterval: number;
    
    if (isAnalyzing) {
      setProgress(0);
      setStepIndex(0);
      
      // Fake progress up to 99%
      progressInterval = window.setInterval(() => {
        setProgress(p => {
          if (p >= 99) return 99;
          // slow down as it gets closer to 99
          const increment = Math.max(0.5, (99 - p) / 20);
          return p + increment;
        });
      }, 100);
      
      // Cycle text steps
      stepInterval = window.setInterval(() => {
        setStepIndex(s => (s < processingSteps.length - 1 ? s + 1 : s));
      }, 800);
    }
    
    return () => {
      clearInterval(progressInterval);
      clearInterval(stepInterval);
    };
  }, [isAnalyzing]);

  const handleUpload = async () => {
    setIsAnalyzing(true);
    setError('');
    
    try {
      const formData = new FormData();
      if (activeTab === 'zip' && file) {
        formData.append('file', file);
      } else if (activeTab === 'github' && githubUrl) {
        formData.append('github_url', githubUrl);
      } else if (activeTab === 'website' && websiteUrl) {
        formData.append('website_url', websiteUrl);
      } else {
        throw new Error('Please provide the required input for the selected method.');
      }

      const res = await fetch('/api/v1/analyze', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || 'Analysis failed. Please check the backend connection.');
      }

      const scanResult = await res.json();
      setProgress(100);
      
      // Save metadata to Firebase Firestore
      try {
        const { saveScanResult } = await import('../firebase');
        await saveScanResult(scanResult);
      } catch (err) {
        console.error("Firebase save failed:", err);
      }
      
      // slight delay at 100% for the effect
      setTimeout(() => {
        setScanResult(scanResult);
        navigate('/dashboard');
      }, 800);
      
    } catch (err: any) {
      setError(err.message || 'An error occurred during analysis.');
      setIsAnalyzing(false);
    }
  };

  if (isAnalyzing) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-md">
        <div className="max-w-xl w-full p-8 rounded-2xl bg-surface border border-primary/30 shadow-[0_0_50px_rgba(45,212,191,0.15)] flex flex-col items-center text-center space-y-8">
          <div className="relative flex items-center justify-center">
            <div className="absolute w-32 h-32 rounded-full border-t-2 border-primary animate-spin"></div>
            <div className="absolute w-28 h-28 rounded-full border-b-2 border-danger animate-[spin_1.5s_linear_reverse]"></div>
            <Shield className="w-12 h-12 text-primary animate-pulse" />
          </div>
          
          <div className="space-y-2 w-full">
            <h2 className="text-3xl font-bold tracking-widest text-primary animate-pulse">
              ANALYZING
            </h2>
            <div className="font-mono text-sm h-6 text-text-muted transition-all">
              {processingSteps[stepIndex]}
            </div>
          </div>
          
          <div className="w-full space-y-2">
            <div className="flex justify-between font-mono text-xs text-primary">
              <span>SYSTEM.SCAN_ACTIVE</span>
              <span>{progress.toFixed(1)}%</span>
            </div>
            <div className="w-full h-2 bg-background rounded-full overflow-hidden border border-border">
              <div 
                className="h-full bg-gradient-to-r from-primary to-primary-hover shadow-[0_0_10px_rgba(45,212,191,0.8)] transition-all duration-100 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
          
          <div className="grid grid-cols-3 w-full gap-4 pt-4 border-t border-border/50">
            <div className="flex flex-col items-center space-y-1">
              <Activity className="w-4 h-4 text-text-muted" />
              <span className="text-[10px] font-mono text-text-muted">HEURISTICS</span>
            </div>
            <div className="flex flex-col items-center space-y-1">
              <Database className="w-4 h-4 text-text-muted" />
              <span className="text-[10px] font-mono text-text-muted">OSV.DEV</span>
            </div>
            <div className="flex flex-col items-center space-y-1">
              <Cpu className="w-4 h-4 text-text-muted" />
              <span className="text-[10px] font-mono text-text-muted">NETWORKX</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pt-8 relative">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight text-white">Start New Analysis</h1>
        <p className="text-text-muted text-lg max-w-2xl mx-auto">
          Upload your workspace archive or provide a remote repository link to instantly build an explainable vulnerability propagation graph.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-md bg-danger/20 border border-danger text-danger text-center font-medium">
          {error}
        </div>
      )}

      <div className="bg-surface border border-border rounded-xl p-8 shadow-2xl">
        <div className="flex gap-4 border-b border-border pb-4 mb-8">
          <button 
            onClick={() => setActiveTab('zip')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-colors ${activeTab === 'zip' ? 'bg-primary text-white' : 'text-text-muted hover:bg-surface-hover'}`}
          >
            <UploadCloud className="w-5 h-5" />
            Upload Archive
          </button>
          <button 
            onClick={() => setActiveTab('github')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-colors ${activeTab === 'github' ? 'bg-primary text-white' : 'text-text-muted hover:bg-surface-hover'}`}
          >
            <GitBranch className="w-5 h-5" />
            GitHub Repository
          </button>
          <button 
            onClick={() => setActiveTab('website')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-colors ${activeTab === 'website' ? 'bg-primary text-white' : 'text-text-muted hover:bg-surface-hover'}`}
          >
            <Globe className="w-5 h-5" />
            Live Website
          </button>
        </div>

        {activeTab === 'zip' && (
          <div className="border-2 border-dashed border-border rounded-xl p-12 text-center hover:border-primary transition-colors bg-surface-hover/30">
            <UploadCloud className="w-16 h-16 text-text-muted mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Drag and drop your workspace</h3>
            <p className="text-text-muted mb-6">Support for .zip archives containing package.json, requirements.txt, or pom.xml</p>
            <input 
              type="file" 
              accept=".zip" 
              id="file-upload" 
              className="hidden" 
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
            <label 
              htmlFor="file-upload" 
              className="inline-flex cursor-pointer items-center justify-center rounded-md bg-white text-black px-6 py-3 font-medium hover:bg-gray-200 transition-colors"
            >
              Browse Files
            </label>
            {file && <p className="mt-4 text-primary font-medium">Selected: {file.name}</p>}
          </div>
        )}

        {activeTab === 'github' && (
          <div className="space-y-4">
            <label className="block text-sm font-medium text-text-muted">Repository URL (Public)</label>
            <input 
              type="text" 
              placeholder="https://github.com/Aditya948351/CSB_03_MargVedha"
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              className="w-full bg-background border border-border rounded-md px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
            />
            <p className="text-xs text-text-muted">We will download the repository, parse the manifests, and query OSV.dev for vulnerabilities.</p>
          </div>
        )}

        {activeTab === 'website' && (
          <div className="space-y-4">
            <label className="block text-sm font-medium text-text-muted">Live Website URL</label>
            <input 
              type="text" 
              placeholder="https://example.com"
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              className="w-full bg-background border border-border rounded-md px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
            />
            <p className="text-xs text-text-muted">Experimental: We will attempt to identify client-side libraries (like jQuery or React) used on the page.</p>
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-border flex justify-end">
          <button 
            disabled={isAnalyzing}
            onClick={handleUpload}
            className="bg-primary hover:bg-primary-hover text-white px-8 py-3 rounded-md font-bold text-lg transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Run Graph Analysis
          </button>
        </div>
      </div>
    </div>
  );
}
