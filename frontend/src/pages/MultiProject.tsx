import { useState } from 'react';
import { useAppStore } from '../store';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { 
  Layers, ShieldAlert, CheckCircle2, AlertTriangle, ArrowRight, 
  GitPullRequest, Sparkles, Lightbulb, Package, Info, RefreshCw, 
  Check, ExternalLink, ShieldCheck, Zap, UploadCloud, GitBranch, Activity
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function MultiProject() {
  const { findings, projects } = useAppStore(state => state.scanResult);
  const { isDemoMode, loadDemoWorkspace, clearDemoWorkspace } = useAppStore();
  const [simulatedPoisoned, setSimulatedPoisoned] = useState(false);
  
  // Find findings that affect multiple projects
  const sharedFindings = findings.filter((f: any) => f.affected_projects.length > 1);

  // Full enterprise dependency matrix data across all projects
  const dependencyMatrix = [
    {
      name: 'lodash',
      ecosystem: 'npm',
      status: 'vulnerable',
      severity: 'CVSS 7.5',
      cve: 'CVE-2021-23337',
      projects: {
        'proj:frontend-app': '4.17.19 (Vulnerable)',
        'proj:admin-dashboard': '4.17.19 (Vulnerable)',
        'proj:legacy-api': '— Not Used'
      },
      action: 'Batch Upgrade to 4.17.21'
    },
    {
      name: 'qs',
      ecosystem: 'npm',
      status: 'vulnerable',
      severity: 'CVSS 7.5',
      cve: 'CVE-2022-24999',
      projects: {
        'proj:frontend-app': '6.11.0 (Transitive)',
        'proj:admin-dashboard': '— Not Used',
        'proj:legacy-api': '— Not Used'
      },
      action: 'Safe-pin to 6.11.1'
    },
    {
      name: 'jinja2',
      ecosystem: 'PyPI',
      status: 'kev',
      severity: 'CVSS 8.2 (KEV)',
      cve: 'CVE-2024-22195',
      projects: {
        'proj:frontend-app': '— Not Used',
        'proj:admin-dashboard': '— Not Used',
        'proj:legacy-api': '2.11.2 (Active KEV)'
      },
      action: 'Emergency Patch to 2.11.3'
    },
    {
      name: 'express',
      ecosystem: 'npm',
      status: 'clean',
      severity: 'Clean (Secure)',
      cve: 'No Known CVEs',
      projects: {
        'proj:frontend-app': '4.18.2 (Direct)',
        'proj:admin-dashboard': '— Not Used',
        'proj:legacy-api': '— Not Used'
      },
      action: 'Up to Date'
    },
    {
      name: 'body-parser',
      ecosystem: 'npm',
      status: 'clean',
      severity: 'Clean (Secure)',
      cve: 'No Known CVEs',
      projects: {
        'proj:frontend-app': '1.20.1 (Direct)',
        'proj:admin-dashboard': '— Not Used',
        'proj:legacy-api': '— Not Used'
      },
      action: 'Up to Date'
    }
  ];

  return (
    <div className="space-y-8 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Multi-Project Analysis</h1>
          <p className="text-text-muted mt-1 text-sm">
            Cross-project vulnerability propagation, shared dependency clustering, and batch remediation.
          </p>
        </div>
        <Link 
          to="/remediation"
          className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg font-medium text-sm transition-all shadow-sm flex items-center gap-2 cursor-pointer"
        >
          <GitPullRequest className="w-4 h-4" />
          Batch Remediation Planner
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-8 sm:p-12 shadow-sm space-y-8">
          <div className="max-w-2xl mx-auto text-center space-y-3">
            <div className="size-16 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-primary mx-auto shadow-sm">
              <Layers className="size-8 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              No Multi-Project Repositories Detected
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed text-balance">
              Multi-project risk correlation detects shared transitive vulnerabilities and cross-repository cascading supply chain vectors across 2 or more repositories. Upload multiple manifests or connect your repositories to uncover shared dependencies, cross-repo CVE contagion, and unified batch remediation.
            </p>
          </div>

          {/* 3 Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-4xl mx-auto">
            <div className="bg-slate-50 hover:bg-blue-50/50 border border-slate-200 hover:border-blue-300 rounded-xl p-5 transition-all space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="size-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                  <UploadCloud className="size-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-sm">Upload Multiple Manifests</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Import multiple packages (npm + PyPI) to correlate shared dependency trees.
                </p>
              </div>
              <Link
                to="/import"
                className="w-full bg-primary hover:bg-primary-hover text-white text-xs font-bold py-2 px-3 rounded-lg text-center transition-all flex items-center justify-center gap-1.5"
              >
                <span>Upload Projects</span>
                <ArrowRight className="size-3.5" />
              </Link>
            </div>

            <div className="bg-slate-50 hover:bg-purple-50/50 border border-slate-200 hover:border-purple-300 rounded-xl p-5 transition-all space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="size-10 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                  <GitBranch className="size-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-sm">Connect GitHub Account</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Authorize your repositories in Settings to automatically map multi-repo clusters.
                </p>
              </div>
              <Link
                to="/settings"
                className="w-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-2 px-3 rounded-lg text-center transition-all flex items-center justify-center gap-1.5"
              >
                <span>Connect in Settings</span>
                <ArrowRight className="size-3.5" />
              </Link>
            </div>

            <div className="bg-slate-50 hover:bg-amber-50/50 border border-slate-200 hover:border-amber-300 rounded-xl p-5 transition-all space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="size-10 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                  <Sparkles className="size-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-sm">Preview Sample Multi-Project</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  See how MARGVEDHA clusters lodash across frontend-app and admin-dashboard.
                </p>
              </div>
              <button
                onClick={loadDemoWorkspace}
                className="w-full bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold py-2 px-3 rounded-lg text-center transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
              >
                <span>🧪 Load Demo Portfolio</span>
                <ArrowRight className="size-3.5" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Demo Workspace Banner */}
          {isDemoMode && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="size-4 text-amber-600" />
                <span>Currently previewing sample multi-project workspace (3 mock projects).</span>
              </div>
              <button
                onClick={clearDemoWorkspace}
                className="px-2.5 py-1 bg-white hover:bg-amber-100 border border-amber-300 rounded text-amber-900 font-bold transition-all cursor-pointer"
              >
                Clear Demo Data
              </button>
            </div>
          )}

          {/* 1. PLAIN-ENGLISH MULTI-PROJECT EXPLAINER BANNER */}
          <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="grid md:grid-cols-12 gap-6 items-center relative z-10">
              <div className="md:col-span-8 space-y-2.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-blue-300 font-semibold text-xs border border-white/15">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Why Multi-Project Analysis Matters
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Stop Patching The Same CVE Repository by Repository
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
              When multiple repositories rely on the same open-source library, a single zero-day exploit creates organizational-wide exposure. 
              MARGVEDHA groups these shared dependencies into <strong>Remediation Clusters</strong> so you can patch your entire enterprise portfolio in a single unified operation.
            </p>
          </div>

          <div className="md:col-span-4 bg-white/10 p-4 rounded-xl border border-white/15 backdrop-blur-sm text-xs space-y-2">
            <span className="font-bold text-amber-300 uppercase tracking-wide flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-400" />
              Efficiency Advantage
            </span>
            <p className="text-slate-200 leading-relaxed">
              Batch upgrading <strong className="font-mono text-white">lodash</strong> to 4.17.21 fixes both <span className="underline decoration-blue-400">frontend-app</span> and <span className="underline decoration-blue-400">admin-dashboard</span> simultaneously, saving hours of redundant developer review.
            </p>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. KEY METRIC STAT CARDS */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card className="hover:border-slate-300 transition-all shadow-xs">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-xs font-semibold text-text-muted uppercase tracking-wider">Projects Analyzed</CardTitle>
            <Layers className="w-4 h-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{projects.length}</div>
            <p className="text-xs text-text-muted mt-1">2 npm workspaces, 1 PyPI backend</p>
          </CardContent>
        </Card>

        <Card className="hover:border-slate-300 transition-all shadow-xs">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-xs font-semibold text-text-muted uppercase tracking-wider">Shared Vulnerabilities</CardTitle>
            <ShieldAlert className="w-4 h-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{sharedFindings.length} Package</div>
            <p className="text-xs text-amber-700 mt-1 font-medium">lodash@4.17.19 (CVSS 7.5)</p>
          </CardContent>
        </Card>

        <Card className="hover:border-slate-300 transition-all shadow-xs">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-xs font-semibold text-text-muted uppercase tracking-wider">Batch Patch Efficiency</CardTitle>
            <CheckCircle2 className="w-4 h-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">2x Faster</div>
            <p className="text-xs text-emerald-700 mt-1 font-medium">Fixes 2 projects in 1 commit</p>
          </CardContent>
        </Card>

        <Card className="hover:border-slate-300 transition-all shadow-xs">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-xs font-semibold text-text-muted uppercase tracking-wider">Shared Foundation</CardTitle>
            <Package className="w-4 h-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">66.7%</div>
            <p className="text-xs text-text-muted mt-1">Shared JavaScript tooling base</p>
          </CardContent>
        </Card>
      </div>

      {/* ========================================================================= */}
      {/* 3. CROSS-PROJECT REMEDIATION CLUSTERS (Interactive Visual Breakdown) */}
      {/* ========================================================================= */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-5 h-5 text-blue-600" />
              Cross-Project Remediation Clusters
            </h2>
            <p className="text-xs text-text-muted">High-leverage patch groups that remediate vulnerabilities across multiple codebases simultaneously.</p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-full">
            1 High-Priority Cluster Identified
          </span>
        </div>

        <div className="space-y-4">
          {sharedFindings.map((finding: any) => (
            <div key={finding.id} className="bg-white rounded-2xl border border-amber-200/90 shadow-sm p-6 space-y-5">
              
              {/* Cluster Top Bar */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center font-bold font-mono text-amber-700">
                    pkg
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono font-bold text-slate-900 text-base">{finding.package}@{finding.version}</span>
                      <Badge variant="warning">CVSS {finding.severity}</Badge>
                      <span className="bg-blue-50 text-blue-700 border border-blue-200 text-xs px-2.5 py-0.5 rounded-full font-semibold">
                        {finding.affected_projects.length} Projects Exposed
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 font-mono mt-0.5">{finding.aliases.join(', ')} • Command Injection in lodash</div>
                  </div>
                </div>

                <Link
                  to="/remediation"
                  className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 shrink-0"
                >
                  <GitPullRequest className="w-3.5 h-3.5" />
                  Generate Unified Batch PR
                </Link>
              </div>

              {/* Explanatory Context */}
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                This vulnerable package is present in multiple independent codebases. Upgrading to safe target version <strong className="font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">{finding.fixed_versions[0]}</strong> will resolve {finding.aliases[0]} across all the following projects simultaneously:
              </p>

              {/* Connected Projects Visual Grid */}
              <div className="grid sm:grid-cols-2 gap-4">
                {finding.affected_projects.map((projId: string) => {
                  const proj = projects.find((p: any) => p.id === projId);
                  return (
                    <div key={projId} className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                          <Layers className="w-4 h-4 text-blue-600" />
                          {proj?.name || projId}
                        </div>
                        <div className="text-xs text-slate-500 font-mono">
                          Manifest: {proj?.source_file || 'package.json'} ({proj?.dependency_count || 100}+ deps)
                        </div>
                      </div>
                      <span className="text-xs font-bold text-amber-700 bg-amber-100/70 px-2 py-1 rounded">
                        Requires 4.17.21
                      </span>
                    </div>
                  );
                })}
              </div>

            </div>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. CROSS-PROJECT DEPENDENCY MATRIX (The Enterprise Grid) */}
      {/* ========================================================================= */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Enterprise Supply Chain Matrix</h2>
            <p className="text-xs text-text-muted">Complete cross-repository dependency grid showing packages, active versions, and recommended policies.</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="bg-slate-900 text-white font-semibold">
                  <th className="py-4 px-6">Dependency & Ecosystem</th>
                  <th className="py-4 px-4">Severity & Vulnerability</th>
                  <th className="py-4 px-4 font-mono">frontend-app</th>
                  <th className="py-4 px-4 font-mono">admin-dashboard</th>
                  <th className="py-4 px-4 font-mono">legacy-api</th>
                  <th className="py-4 px-5 bg-blue-600 text-white font-bold">Recommended Policy</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-normal">
                {dependencyMatrix.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-6 font-bold text-slate-900 font-mono flex items-center gap-2">
                      <Package className="w-4 h-4 text-slate-500 shrink-0" />
                      {item.name}
                      <span className="text-[10px] text-slate-400 font-sans uppercase">({item.ecosystem})</span>
                    </td>
                    <td className="py-4 px-4">
                      {item.status === 'kev' ? (
                        <span className="font-bold text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded text-xs inline-flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3 text-red-600" />
                          {item.severity}
                        </span>
                      ) : item.status === 'vulnerable' ? (
                        <span className="font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded text-xs">
                          {item.severity}
                        </span>
                      ) : (
                        <span className="font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded text-xs flex items-center gap-1">
                          <Check className="w-3 h-3 text-emerald-600" />
                          {item.severity}
                        </span>
                      )}
                      <div className="text-[11px] text-slate-400 font-mono mt-0.5">{item.cve}</div>
                    </td>
                    <td className="py-4 px-4 font-mono text-xs text-slate-700">
                      {item.projects['proj:frontend-app']}
                    </td>
                    <td className="py-4 px-4 font-mono text-xs text-slate-700">
                      {item.projects['proj:admin-dashboard']}
                    </td>
                    <td className="py-4 px-4 font-mono text-xs text-slate-700">
                      {item.projects['proj:legacy-api']}
                    </td>
                    <td className="py-4 px-5 bg-blue-50/50 font-bold text-blue-700 text-xs">
                      {item.action}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 5. DEPENDENCY VERSION DRIFT & GOVERNANCE ANALYZER */}
      {/* ========================================================================= */}
      <div className="grid md:grid-cols-2 gap-6">
        
        <Card className="border-slate-200 shadow-xs">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-blue-600" />
              Version Drift & Governance Audit
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 pt-2 text-xs">
            <p className="text-slate-600 leading-relaxed">
              <strong>Version Drift</strong> occurs when different microservices diverge on versions of the same library, leading to inconsistent security profiles and testing blindspots.
            </p>
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
              <div className="flex justify-between items-center font-semibold text-slate-800">
                <span>lodash Drift Status:</span>
                <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Zero Drift (Both on 4.17.19)
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Both frontend-app and admin-dashboard share the exact same version, making a synchronized patch to 4.17.21 effortless.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-xs">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Enterprise Governance Recommendation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 pt-2 text-xs">
            <p className="text-slate-600 leading-relaxed">
              By enforcing synchronized versioning policies via MARGVEDHA, engineering organizations prevent dependency confusion and maintain uniform compliance with <strong>CISA BOD 22-01</strong> and <strong>NIST SSDF</strong> standards.
            </p>
            <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-200 text-blue-900">
              <strong>Recommended Action:</strong> Merge the unified Monorepo PR to bump lodash across all projects before next sprint release.
            </div>
          </CardContent>
        </Card>
      </div>
      </>
      )}

    </div>
  );
}
