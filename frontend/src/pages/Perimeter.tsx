import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Shield, GitBranch, Layers, AlertTriangle, CheckCircle2, 
  RotateCcw, Sparkles, Plus, Search, Trash2, Power, 
  RefreshCw, Lock, ArrowUpRight, Check, Copy, X, 
  Bot, ChevronRight, FileCode, ShieldAlert, Key, Zap
} from 'lucide-react';
import { useAppStore } from '../store';
import type { UserRepo } from '../store';
import { demoScanResult } from '../fixtures/demoData';

interface SecretIncident {
  id: string;
  occurredDate: string;
  validity: 'Valid' | 'Revoked';
  type: string;
  severity: 'Critical' | 'High' | 'Medium';
  filePath: string;
  repo: string;
  author: string;
  status: 'Active Vector' | 'Mitigated';
  cveMatch: string;
}

const SAMPLE_INCIDENTS: SecretIncident[] = [
  {
    id: 'inc-1',
    occurredDate: '2 mins ago',
    validity: 'Valid',
    type: 'Hardcoded Production Secret (AWS_ACCESS_KEY)',
    severity: 'Critical',
    filePath: 'config/production.json:L14',
    repo: 'Active Monitored Repository',
    author: 'CI/CD Pipeline',
    status: 'Active Vector',
    cveMatch: 'Potential unauthorized cloud infra takeover. Honeytoken trigger armed.'
  },
  {
    id: 'inc-2',
    occurredDate: '10 mins ago',
    validity: 'Valid',
    type: 'Transitive CVE-2021-23337 (lodash@4.17.19)',
    severity: 'Critical',
    filePath: 'package-lock.json -> express -> body-parser',
    repo: 'Active Monitored Repository',
    author: 'Transitive Dependency Graph',
    status: 'Active Vector',
    cveMatch: 'Command Injection via template parsing. Z3 SAT Patch Available: 4.17.21'
  }
];

export default function Perimeter() {
  const { 
    user, 
    userPlan, 
    setUserPlan, 
    userRepos, 
    addUserRepo, 
    removeUserRepo, 
    toggleRepoMonitoring, 
    toggleAllRepoMonitoring, 
    setScanResult 
  } = useAppStore();

  const isSuperUser = user?.email === 'ap8548328@gmail.com';
  const hasFleetAccess = isSuperUser || userPlan === 'fleet';
  const hasProAccess = isSuperUser || userPlan === 'pro' || userPlan === 'fleet';

  const userAccountName = isSuperUser 
    ? 'Aditya Patil (Owner)' 
    : (user?.displayName || user?.email?.split('@')[0] || 'Community User');

  const [activeTab, setActiveTab] = useState<'sources' | 'incidents' | 'guard0' | 'cicd'>('sources');
  const [filterPill, setFilterPill] = useState<'monitored' | 'critical' | 'incidents' | 'all'>('monitored');
  const [searchQuery, setSearchQuery] = useState('');
  const [isScanningAll, setIsScanningAll] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [pricingModalOpen, setPricingModalOpen] = useState(false);
  const [copiedWorkflow, setCopiedWorkflow] = useState(false);

  // Add Repository Modal State
  const [addRepoModalOpen, setAddRepoModalOpen] = useState(false);
  const [inputRepoUrl, setInputRepoUrl] = useState('');
  const [inputEcosystem, setInputEcosystem] = useState<'npm' | 'PyPI' | 'polyglot'>('polyglot');
  const [addRepoError, setAddRepoError] = useState('');

  const currentLimit = isSuperUser || userPlan === 'fleet' ? 9999 : (userPlan === 'pro' ? 10 : 1);

  const handleAddRepository = (e: React.FormEvent) => {
    e.preventDefault();
    setAddRepoError('');
    if (!inputRepoUrl.trim()) {
      setAddRepoError('Please enter a GitHub repository name (e.g. owner/repo).');
      return;
    }

    const res = addUserRepo(inputRepoUrl, inputEcosystem);
    if (!res.success) {
      setAddRepoError(res.message);
      return;
    }

    setInputRepoUrl('');
    setAddRepoModalOpen(false);
    setToastMessage(res.message);
    setToastVisible(true);
  };

  const handleRegenerateDatabase = () => {
    setIsRegenerating(true);
    setTimeout(() => {
      setScanResult(demoScanResult);
      setIsRegenerating(false);
      setToastMessage('Database synchronized! Re-indexed your repositories with CISA KEV signatures.');
      setToastVisible(true);
    }, 1000);
  };

  const handleRescanAll = () => {
    setIsScanningAll(true);
    setTimeout(() => {
      setIsScanningAll(false);
      setToastMessage('Scan completed across all your connected sources.');
      setToastVisible(true);
    }, 1400);
  };

  const filteredRepos = userRepos.filter(repo => {
    if (filterPill === 'critical') return repo.criticals > 0;
    if (filterPill === 'incidents') return repo.openIncidents > 0;
    if (searchQuery) return repo.fullName.toLowerCase().includes(searchQuery.toLowerCase());
    return true;
  });

  const activeMonitoringCount = userRepos.filter(r => r.monitoringActive).length;

  const sampleWorkflow = `name: MARGVEDHA Security Gate

on:
  push:
    branches: [ main, master ]
  pull_request:
    branches: [ main, master ]

jobs:
  margvedha-audit:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: MARGVEDHA Topological DAG & CISA KEV Gate
        uses: margvedha/security-action@v2
        with:
          api-key: \${{ secrets.MARGVEDHA_API_KEY }}
          fail-on-kev: true
          fail-on-critical: true
          transitive-depth-limit: 8
          z3-solver-auto-pr: true`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(sampleWorkflow);
    setCopiedWorkflow(true);
    setTimeout(() => setCopiedWorkflow(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      
      {/* Toast Notification */}
      {toastVisible && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs text-emerald-800 shadow-sm">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-medium">{toastMessage}</span>
          </div>
          <button onClick={() => setToastVisible(false)} className="text-emerald-600 hover:text-emerald-800 p-1 cursor-pointer">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Top Header & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shadow-xs">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
              <span className="flex items-center gap-1 text-blue-600 font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                Perimeter
              </span>
              <span>/</span>
              <span>Internal Monitoring</span>
              <span>/</span>
              <span className="text-slate-800 font-bold">{userAccountName}</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2 mt-0.5 flex-wrap">
              Fleet Perimeter & Source Intelligence
              {isSuperUser ? (
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  👑 Enterprise Superuser (@Aditya948351)
                </span>
              ) : hasFleetAccess ? (
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                  Fleet Enterprise Plan Active
                </span>
              ) : hasProAccess ? (
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  Developer Pro Plan Active
                </span>
              ) : (
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                  Community Free Plan (1 Repo Limit)
                </span>
              )}
            </h1>
          </div>
        </div>

        <div className="flex items-center flex-wrap gap-2.5">
          {/* Add Repository Button */}
          <button
            onClick={() => setAddRepoModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Repository</span>
          </button>

          {/* Prototype Toggle All Button */}
          {userRepos.length > 0 && (
            <button
              onClick={toggleAllRepoMonitoring}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white border border-slate-200 text-xs font-mono font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-xs cursor-pointer"
              title="Toggle Monitoring for all your repositories"
            >
              <Power className="w-3.5 h-3.5 text-blue-600" />
              <span>Fleet Monitor: ON/OFF</span>
            </button>
          )}

          {/* Regenerate Database Button */}
          <button 
            onClick={handleRegenerateDatabase}
            disabled={isRegenerating}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all shadow-xs disabled:opacity-50 cursor-pointer"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${isRegenerating ? 'animate-spin' : ''}`} />
            <span>{isRegenerating ? 'Syncing...' : 'Sync Database'}</span>
          </button>

          {/* Plan Modal Trigger */}
          <button 
            onClick={() => setPricingModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold hover:bg-amber-100 transition-all shadow-xs cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>{hasFleetAccess ? 'Fleet Plan Active' : hasProAccess ? 'Pro Active' : 'Upgrade Plan'}</span>
          </button>
          
          {/* Rescan Button */}
          <button 
            onClick={handleRescanAll}
            disabled={isScanningAll || userRepos.length === 0}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary hover:bg-primary-hover text-white text-xs font-bold transition-all shadow-xs disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isScanningAll ? 'animate-spin' : ''}`} />
            {isScanningAll ? 'Scanning...' : 'Rescan Sources'}
          </button>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('sources')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
            activeTab === 'sources'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Layers className="w-4 h-4" />
          Sources ({userRepos.length} Connected)
        </button>

        <button
          onClick={() => setActiveTab('incidents')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
            activeTab === 'incidents'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <ShieldAlert className="w-4 h-4 text-red-500" />
          Internal Secret Incidents
          <span className="px-1.5 py-0.2 rounded-full bg-red-100 text-red-700 text-[11px] font-mono font-bold">
            {hasProAccess ? '2 Active' : '🔒 Pro'}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('guard0')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
            activeTab === 'guard0'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Bot className="w-4 h-4 text-purple-600" />
          Guard0 AI & MCP Supply Chain
          <span className="px-1.5 py-0.2 rounded-full bg-purple-100 text-purple-700 text-[11px] font-mono font-bold">
            {hasFleetAccess ? '12 Domains' : '🔒 Fleet'}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('cicd')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
            activeTab === 'cicd'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <GitBranch className="w-4 h-4 text-emerald-600" />
          CI/CD Gate Automation
        </button>
      </div>

      {/* 4 Core Fleet KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-5 relative overflow-hidden group hover:border-blue-400 transition-all shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span className="flex items-center gap-1.5 font-medium">
              <GitBranch className="w-4 h-4 text-blue-600" />
              Connected Repositories
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{userRepos.length}</span>
            <span className="text-xs text-slate-500">/ {currentLimit === 9999 ? '∞' : currentLimit} allowed</span>
          </div>
          <div 
            onClick={() => setAddRepoModalOpen(true)}
            className="mt-3 text-xs text-blue-600 hover:underline flex items-center gap-1 cursor-pointer font-medium"
          >
            <span>+ Add Repository</span>
            <ChevronRight className="w-3 h-3" />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 relative overflow-hidden group hover:border-emerald-400 transition-all shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span className="flex items-center gap-1.5 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Monitoring
            </span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-mono font-bold">
              {activeMonitoringCount} Active
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-emerald-600">
              {userRepos.length > 0 ? `${Math.round((activeMonitoringCount / userRepos.length) * 100)}%` : '0%'}
            </span>
            <span className="text-xs text-slate-500">monitored</span>
          </div>
          <div className="mt-3 text-[11px] text-slate-500 font-mono">
            Push & Pull Request Webhooks
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 relative overflow-hidden group hover:border-blue-400 transition-all shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span className="flex items-center gap-1.5 font-medium">
              <FileCode className="w-4 h-4 text-blue-600" />
              Dependency Analysis
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-blue-600">{userRepos.length}</span>
            <span className="text-xs text-slate-500">projects indexed</span>
          </div>
          <div className="mt-3 text-[11px] text-slate-500 font-mono">
            NetworkX DAG & OSV.dev sync
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 relative overflow-hidden group hover:border-purple-400 transition-all shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span className="flex items-center gap-1.5 font-medium">
              <Bot className="w-4 h-4 text-purple-600" />
              Guard0 AI Governance
            </span>
            <span className="px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200 text-xs font-mono font-bold">
              {hasFleetAccess ? 'Grade B+' : 'Enterprise'}
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-purple-600">
              {hasFleetAccess ? 'Active' : 'Locked'}
            </span>
            <span className="text-xs text-slate-500">{hasFleetAccess ? 'OWASP Agentic Top 10' : 'Requires Fleet Tier'}</span>
          </div>
          <div className="mt-3 text-[11px] text-slate-500 font-mono">
            CycloneDX 1.6 AI-BOM
          </div>
        </div>
      </div>

      {/* Main Tab Content */}
      {activeTab === 'sources' && (
        <div className="space-y-4">
          {/* Table Filter Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
              <button 
                onClick={() => setFilterPill('monitored')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  filterPill === 'monitored' 
                    ? 'bg-slate-900 text-white shadow-xs' 
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                Monitored ({userRepos.filter(r => r.monitoringActive).length})
              </button>
              <button 
                onClick={() => setFilterPill('critical')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  filterPill === 'critical' 
                    ? 'bg-red-600 text-white shadow-xs' 
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                Critical ({userRepos.filter(r => r.criticals > 0).length})
              </button>
              <button 
                onClick={() => setFilterPill('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  filterPill === 'all' 
                    ? 'bg-slate-900 text-white shadow-xs' 
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                All ({userRepos.length})
              </button>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Filter your sources..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white w-full sm:w-56 transition-all"
                />
              </div>

              <button
                onClick={() => setAddRepoModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Repo</span>
              </button>
            </div>
          </div>

          {/* Sources Table */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between text-xs text-slate-500 bg-slate-50/75">
              <span className="font-semibold text-slate-700">
                {filteredRepos.length} connected repositories ({userRepos.length} / {currentLimit === 9999 ? '∞' : currentLimit} on your plan)
              </span>
              <span className="font-mono text-blue-600 font-medium">
                User Scope: {user?.email || 'Current Session'}
              </span>
            </div>

            {filteredRepos.length === 0 ? (
              <div className="p-12 text-center space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center mx-auto text-blue-600">
                  <GitBranch className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">No Repositories Added Yet</h3>
                <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                  As a user, you have complete control over your account. Add your own GitHub repository to monitor transitive dependencies and CISA KEV risks.
                </p>
                <button
                  onClick={() => setAddRepoModalOpen(true)}
                  className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold shadow-xs transition-all cursor-pointer inline-flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Connect Your First Repository</span>
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50/50 text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
                      <th className="py-3 px-6">Source Repository</th>
                      <th className="py-3 px-4">Live Monitoring</th>
                      <th className="py-3 px-4">Open Incidents</th>
                      <th className="py-3 px-4">SBOM Spec</th>
                      <th className="py-3 px-4">Last Scanned</th>
                      <th className="py-3 px-4">Duration</th>
                      <th className="py-3 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {filteredRepos.map((repo) => (
                      <tr 
                        key={repo.id}
                        className="hover:bg-slate-50/80 transition-colors"
                      >
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 font-bold shrink-0">
                              <GitBranch className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="font-bold text-slate-900 flex items-center gap-2">
                                <span>{repo.fullName}</span>
                                <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-mono">
                                  {repo.defaultBranch}
                                </span>
                              </div>
                              <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                                <span className="font-mono">{repo.ecosystem}</span>
                                <span>•</span>
                                <span>Honeytoken: {repo.honeytoken}</span>
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="py-4 px-4">
                          <button
                            onClick={() => toggleRepoMonitoring(repo.id)}
                            className={`px-3 py-1 rounded-full text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                              repo.monitoringActive 
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                                : 'bg-slate-100 text-slate-600 border border-slate-200'
                            }`}
                          >
                            <span className={`w-2 h-2 rounded-full ${repo.monitoringActive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
                            {repo.monitoringActive ? 'ON (Monitored)' : 'OFF (Paused)'}
                          </button>
                        </td>

                        <td className="py-4 px-4">
                          {repo.openIncidents > 0 ? (
                            <span className="px-2 py-0.5 rounded bg-red-50 text-red-700 border border-red-200 text-xs font-mono font-bold flex items-center gap-1 w-fit">
                              <ShieldAlert className="w-3.5 h-3.5" />
                              {repo.openIncidents} open
                            </span>
                          ) : (
                            <span className="text-xs text-emerald-600 font-mono flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              0 threats
                            </span>
                          )}
                        </td>

                        <td className="py-4 px-4 font-mono text-xs text-slate-700">
                          <span className="px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200 text-[11px] font-bold">
                            CycloneDX 1.6
                          </span>
                        </td>

                        <td className="py-4 px-4 text-xs font-mono text-slate-600">
                          {repo.lastScan}
                        </td>

                        <td className="py-4 px-4 text-xs font-mono text-slate-500">
                          {repo.duration}
                        </td>

                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              to="/remediation"
                              className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-xs text-slate-800 font-medium transition-colors"
                            >
                              Remediate
                            </Link>

                            <Link 
                              to="/graph"
                              className="px-2.5 py-1 rounded bg-blue-50 hover:bg-blue-100 text-xs text-blue-700 border border-blue-200 font-semibold transition-colors flex items-center gap-1"
                            >
                              DAG
                              <ArrowUpRight className="w-3 h-3" />
                            </Link>

                            <button
                              onClick={() => {
                                if (confirm(`Remove ${repo.fullName} from your monitored list?`)) {
                                  removeUserRepo(repo.id);
                                }
                              }}
                              className="p-1.5 rounded hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                              title="Remove repository"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Plan Limits Notice */}
          {!hasProAccess && (
            <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-2.5 text-xs text-blue-950">
                <Lock className="w-4 h-4 text-blue-600 shrink-0" />
                <span>
                  <strong>Free Plan Quota:</strong> {userRepos.length} / 1 repository monitored. Upgrade to Developer Pro (₹199/mo) for 10 repos or Fleet (₹499/mo) for unlimited repos.
                </span>
              </div>
              <button
                onClick={() => {
                  setUserPlan('pro');
                  alert("Developer Pro Plan trial activated! You can now monitor up to 10 repositories.");
                }}
                className="px-4 py-2 rounded-lg bg-primary hover:bg-primary-hover text-white font-bold text-xs shrink-0 shadow-xs transition-all cursor-pointer"
              >
                Start Pro Trial (₹199/mo)
              </button>
            </div>
          )}
        </div>
      )}

      {/* Incidents View */}
      {activeTab === 'incidents' && !hasProAccess && (
        <div className="bg-white border border-amber-200 rounded-2xl p-8 text-center space-y-4 max-w-2xl mx-auto my-8 shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto text-amber-600">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Internal Secret & Leak Detection — Pro Feature</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Real-time detection of hardcoded AWS keys, database connection strings, GitHub credentials, and honeytokens across your code repositories is available on the Developer Pro tier.
          </p>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 font-mono">
            Current Plan: <span className="text-amber-600 font-bold">Community Free Tier</span>
          </div>
          <button
            onClick={() => {
              setUserPlan('pro');
              alert("Developer Pro Plan trial activated! Secret Incidents monitoring unlocked.");
            }}
            className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
          >
            Start 30-Day Free Trial (₹199/mo)
          </button>
        </div>
      )}

      {activeTab === 'incidents' && hasProAccess && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between text-xs text-slate-500 bg-slate-50/75">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded bg-blue-50 text-blue-700 font-mono font-bold">
                  Active Monitored Sources
                </span>
                <span>•</span>
                <span className="text-slate-700">2 active security vectors detected</span>
              </div>
            </div>

            <div className="divide-y divide-slate-100">
              {SAMPLE_INCIDENTS.map((inc) => (
                <div key={inc.id} className="p-6 hover:bg-slate-50 transition-colors space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2.5 rounded-lg ${inc.severity === 'Critical' ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-amber-50 text-amber-600 border border-amber-200'}`}>
                        {inc.type.includes('Secret') || inc.type.includes('Key') ? (
                          <Key className="w-5 h-5" />
                        ) : (
                          <ShieldAlert className="w-5 h-5" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-slate-900 text-base">{inc.type}</h4>
                          <span className={`px-2 py-0.2 rounded text-[10px] font-bold uppercase ${
                            inc.severity === 'Critical' 
                              ? 'bg-red-50 text-red-700 border border-red-200' 
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}>
                            {inc.severity}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 font-mono mt-1">
                          File: <span className="text-blue-600 font-semibold">{inc.filePath}</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 flex items-center justify-between text-xs">
                    <div className="text-slate-700">{inc.cveMatch}</div>
                    <Link 
                      to="/remediation"
                      className="px-3.5 py-1.5 rounded bg-primary hover:bg-primary-hover text-white text-xs font-bold flex items-center gap-1 transition-colors"
                    >
                      <Zap className="w-3.5 h-3.5" />
                      Solve with Z3 SAT
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Guard0 AI & MCP Supply Chain Tab */}
      {activeTab === 'guard0' && !hasFleetAccess && (
        <div className="bg-white border border-purple-200 rounded-2xl p-8 text-center space-y-4 max-w-2xl mx-auto my-8 shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-purple-50 border border-purple-200 flex items-center justify-center mx-auto text-purple-600">
            <Bot className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Guard0 AI & MCP Supply Chain Defense — Fleet Enterprise</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Autonomous AI agent safety auditing, OWASP Agentic Top 10 evaluation, MCP runtime proxies, and signed CycloneDX 1.6 AI-BOM generator are Enterprise Fleet features.
          </p>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 font-mono">
            Current Plan: <span className="text-purple-600 font-bold">{userPlan.toUpperCase()} Plan</span>
          </div>
          <button
            onClick={() => {
              setUserPlan('fleet');
              alert("Enterprise Fleet Plan activated! Guard0 AI & MCP governance unlocked.");
            }}
            className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
          >
            Upgrade to Enterprise Fleet (₹499/mo)
          </button>
        </div>
      )}

      {activeTab === 'guard0' && hasFleetAccess && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white rounded-2xl p-6 shadow-xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2 max-w-2xl">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-purple-200 border border-white/20 text-xs font-mono font-bold">
                    Guard0 Core Engine Active
                  </span>
                  <span className="text-xs text-purple-200 font-mono">OWASP Agentic Top 10 + NIST AI RMF</span>
                </div>
                <h3 className="text-2xl font-bold text-white">
                  AI Agent & Model Context Protocol (MCP) Supply Chain Defense
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Evaluates live runtime tools, MCP servers, system prompt boundaries, and inter-agent communication channels for your connected repositories.
                </p>
              </div>

              <div className="flex flex-col items-center justify-center p-6 bg-white/10 border border-white/20 rounded-xl min-w-[190px] text-center shadow-lg">
                <span className="text-xs font-mono text-purple-200 mb-1">AI Security Grade</span>
                <span className="text-5xl font-extrabold text-white">
                  B+
                </span>
                <span className="text-xs text-purple-200 mt-1 font-mono">Score: 86 / 100</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CI/CD Gate Tab */}
      {activeTab === 'cicd' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900">GitHub Actions Security Gate (.github/workflows)</h3>
                <p className="text-xs text-slate-500">Enforce zero CISA KEV regressions on pull requests for your connected repositories.</p>
              </div>
              <button
                onClick={copyToClipboard}
                className="px-3.5 py-1.5 rounded-lg bg-primary hover:bg-primary-hover text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {copiedWorkflow ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedWorkflow ? 'Copied YAML!' : 'Copy Workflow'}
              </button>
            </div>

            <pre className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono text-slate-200 overflow-x-auto">
              {sampleWorkflow}
            </pre>
          </div>
        </div>
      )}

      {/* Add Repository Modal */}
      {addRepoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl text-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <GitBranch className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-slate-900 text-lg">Add Repository</h3>
              </div>
              <button 
                onClick={() => setAddRepoModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddRepository} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  GitHub Repository (owner/repo or URL)
                </label>
                <input
                  type="text"
                  placeholder="e.g. facebook/react or https://github.com/my-org/my-app"
                  value={inputRepoUrl}
                  onChange={(e) => setInputRepoUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                  autoFocus
                />
                <span className="text-[11px] text-slate-500 mt-1 block">
                  You have full choice over which repositories you add and scan.
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Ecosystem Type
                </label>
                <select
                  value={inputEcosystem}
                  onChange={(e) => setInputEcosystem(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                >
                  <option value="polyglot">Polyglot (npm, PyPI, Go)</option>
                  <option value="npm">npm / JavaScript / TypeScript</option>
                  <option value="PyPI">PyPI / Python</option>
                </select>
              </div>

              {addRepoError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{addRepoError}</span>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAddRepoModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-primary hover:bg-primary-hover text-white shadow-xs transition-all cursor-pointer"
                >
                  Connect & Monitor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Plan Pricing Modal */}
      {pricingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-4xl w-full p-8 space-y-6 shadow-2xl text-slate-900 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-2xl font-bold text-slate-900">Upgrade Your Workspace</h3>
                <p className="text-xs text-slate-500 mt-1">Flexible plans for developers and security teams.</p>
              </div>
              <button onClick={() => setPricingModalOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Pro Plan */}
              <div className="p-6 rounded-2xl border-2 border-blue-500 bg-blue-50/30 flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-blue-700 text-xl">Developer Pro</h4>
                  <div className="mt-2 text-3xl font-extrabold text-slate-900">₹199<span className="text-xs text-slate-500">/mo</span></div>
                  <ul className="mt-4 space-y-2 text-xs text-slate-700">
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-blue-600" /> Up to 10 Monitored Repositories</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-blue-600" /> Internal Secret Incident Detection</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-blue-600" /> Z3 SAT Automated Patch Synthesis</li>
                  </ul>
                </div>
                <button
                  onClick={() => {
                    setUserPlan('pro');
                    setPricingModalOpen(false);
                    alert("Developer Pro activated! You can now monitor up to 10 repositories.");
                  }}
                  className="mt-6 w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs cursor-pointer shadow-xs transition-all"
                >
                  Start 30-Day Free Trial (₹199/mo)
                </button>
              </div>

              {/* Fleet Enterprise */}
              <div className="p-6 rounded-2xl border-2 border-purple-500 bg-purple-50/30 flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-purple-700 text-xl">Fleet Enterprise</h4>
                  <div className="mt-2 text-3xl font-extrabold text-slate-900">₹499<span className="text-xs text-slate-500">/mo</span></div>
                  <ul className="mt-4 space-y-2 text-xs text-slate-700">
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-purple-600" /> Unlimited Monitored Repositories</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-purple-600" /> Guard0 AI Agent & MCP Defense</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-purple-600" /> CycloneDX 1.6 Signed AI-BOM</li>
                  </ul>
                </div>
                <button
                  onClick={() => {
                    setUserPlan('fleet');
                    setPricingModalOpen(false);
                    alert("Fleet Enterprise tier activated! Unlimited repositories unlocked.");
                  }}
                  className="mt-6 w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs cursor-pointer shadow-xs transition-all"
                >
                  Upgrade to Enterprise Fleet
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
