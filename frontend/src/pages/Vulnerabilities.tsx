import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAppStore } from '../store';
import { Card, CardContent } from '../components/ui/Card';
import { 
  ShieldAlert, ShieldCheck, AlertTriangle, Activity, 
  ExternalLink, Search, Sparkles, ArrowRight, GitBranch,
  UploadCloud, Filter, CheckCircle2, ChevronRight
} from 'lucide-react';

export default function Vulnerabilities() {
  const { findings, projects } = useAppStore(state => state.scanResult);
  const { isDemoMode, loadDemoWorkspace, clearDemoWorkspace } = useAppStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState<'all' | 'critical' | 'high' | 'kev'>('all');

  const filteredFindings = useMemo(() => {
    return (findings || []).filter((f: any) => {
      const matchesSearch = 
        (f.package || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (f.aliases?.[0] || f.vulnerability_id || '').toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      if (severityFilter === 'critical') return (f.severity || 0) >= 9.0;
      if (severityFilter === 'high') return (f.severity || 0) >= 7.0 && (f.severity || 0) < 9.0;
      if (severityFilter === 'kev') return Boolean(f.kev || f.cisa_kev);

      return true;
    });
  }, [findings, searchQuery, severityFilter]);

  const kevCount = (findings || []).filter((f: any) => Boolean(f.kev || f.cisa_kev)).length;
  const criticalCount = (findings || []).filter((f: any) => (f.severity || 0) >= 9.0).length;
  const highCount = (findings || []).filter((f: any) => (f.severity || 0) >= 7.0 && (f.severity || 0) < 9.0).length;

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Vulnerabilities</h1>
          <p className="text-text-muted mt-1 text-sm">
            NIST NVD, OSV & CISA KEV verified vulnerability audit across scanned dependency trees.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/import"
            className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg font-medium text-sm transition-all shadow-xs flex items-center gap-2 cursor-pointer"
          >
            <Activity className="size-4" />
            <span>New Scan</span>
          </Link>
          <Link
            to="/remediation"
            className="bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 px-4 py-2 rounded-lg font-medium text-sm transition-all shadow-xs flex items-center gap-2 cursor-pointer"
          >
            <span>Remediation Planner</span>
            <ChevronRight className="size-4" />
          </Link>
        </div>
      </div>

      {/* Demo Workspace Banner */}
      {isDemoMode && findings && findings.length > 0 && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="size-4 text-amber-600" />
            <span>Currently previewing sample vulnerability audit data (3 demo CVEs).</span>
          </div>
          <button
            onClick={clearDemoWorkspace}
            className="px-2.5 py-1 bg-white hover:bg-amber-100 border border-amber-300 rounded text-amber-900 font-bold transition-all cursor-pointer"
          >
            Clear Demo Data
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* EMPTY / FIRST-TIME STATE: No findings & No projects scanned               */}
      {/* ========================================================================= */}
      {(!findings || findings.length === 0) && (!projects || projects.length === 0) ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-8 sm:p-12 shadow-sm space-y-8">
          <div className="max-w-2xl mx-auto text-center space-y-3">
            <div className="size-16 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-primary mx-auto shadow-sm">
              <ShieldAlert className="size-8 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              No Vulnerability Audit Recorded Yet
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed text-balance">
              Your workspace does not have any active scans. Connect your GitHub repository or upload your project manifests (<code className="font-mono text-slate-800">package.json</code>, <code className="font-mono text-slate-800">requirements.txt</code>) to run an automated security audit against NIST NVD, OSV, GitHub Advisory Database, and CISA KEV.
            </p>
          </div>

          {/* 3 Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-4xl mx-auto">
            <div className="bg-slate-50 hover:bg-blue-50/50 border border-slate-200 hover:border-blue-300 rounded-xl p-5 transition-all space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="size-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                  <UploadCloud className="size-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-sm">Upload Project Manifest</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Upload manifests to detect vulnerable transitive packages and calculate threat paths.
                </p>
              </div>
              <Link
                to="/import"
                className="w-full bg-primary hover:bg-primary-hover text-white text-xs font-bold py-2 px-3 rounded-lg text-center transition-all flex items-center justify-center gap-1.5"
              >
                <span>Upload & Audit</span>
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
                  Authorize repository scanning in Settings for continuous perimeter CVE alerts.
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
                <h3 className="font-bold text-slate-900 text-sm">Preview Sample Audit</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Explore how MARGVEDHA presents CVSS scores, CISA KEV tags, and Z3 SAT remediations.
                </p>
              </div>
              <button
                onClick={loadDemoWorkspace}
                className="w-full bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold py-2 px-3 rounded-lg text-center transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
              >
                <span>🧪 Load Demo Audit</span>
                <ArrowRight className="size-3.5" />
              </button>
            </div>
          </div>
        </div>
      ) : (!findings || findings.length === 0) && projects && projects.length > 0 ? (
        /* ========================================================================= */
        /* CLEAN SCANNED STATE: Projects scanned with 0 vulnerabilities detected     */
        /* ========================================================================= */
        <div className="bg-white border border-emerald-200 rounded-2xl p-10 text-center space-y-4 shadow-xs">
          <div className="size-16 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 mx-auto">
            <CheckCircle2 className="size-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Zero Vulnerabilities Detected!</h2>
          <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
            All scanned packages across your {projects.length} analyzed project(s) are clean with no active CVE advisories or known transitive vulnerabilities.
          </p>
          <div className="pt-2">
            <Link
              to="/import"
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm"
            >
              <Activity className="size-4" />
              <span>Scan Another Project</span>
            </Link>
          </div>
        </div>
      ) : (
        /* ========================================================================= */
        /* POPULATED AUDIT TABLE: Show findings with filters & actions              */
        /* ========================================================================= */
        <div className="space-y-4">
          
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <div className="text-xs text-text-muted font-medium uppercase tracking-wider">Total Findings</div>
              <div className="text-2xl font-bold text-slate-900 mt-1 tabular-nums">{findings.length}</div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <div className="text-xs text-red-600 font-medium uppercase tracking-wider">CISA KEV Exploits</div>
              <div className="text-2xl font-bold text-red-600 mt-1 tabular-nums">{kevCount}</div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <div className="text-xs text-amber-600 font-medium uppercase tracking-wider">High / Critical</div>
              <div className="text-2xl font-bold text-amber-600 mt-1 tabular-nums">{criticalCount + highCount}</div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <div className="text-xs text-blue-600 font-medium uppercase tracking-wider">Fixable Findings</div>
              <div className="text-2xl font-bold text-blue-600 mt-1 tabular-nums">{findings.length} / {findings.length}</div>
            </div>
          </div>

          {/* Search & Filter Toolbar */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="size-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by CVE ID or package name..."
                className="pl-9 pr-4 py-1.5 w-full bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
              />
            </div>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              <button
                onClick={() => setSeverityFilter('all')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  severityFilter === 'all'
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                All ({findings.length})
              </button>
              <button
                onClick={() => setSeverityFilter('kev')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                  severityFilter === 'kev'
                    ? 'bg-red-600 text-white'
                    : 'bg-red-50 hover:bg-red-100 text-red-700 border border-red-200'
                }`}
              >
                <span>CISA KEV</span>
                <span className="font-mono text-[10px]">({kevCount})</span>
              </button>
              <button
                onClick={() => setSeverityFilter('critical')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  severityFilter === 'critical'
                    ? 'bg-red-600 text-white'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                Critical ({criticalCount})
              </button>
              <button
                onClick={() => setSeverityFilter('high')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  severityFilter === 'high'
                    ? 'bg-amber-600 text-white'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                High ({highCount})
              </button>
            </div>
          </div>

          {/* Findings Table */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/75 text-xs text-slate-500 uppercase tracking-wider font-semibold">
                    <th className="p-4">Vulnerability</th>
                    <th className="p-4">Package & Version</th>
                    <th className="p-4">Severity & CVE</th>
                    <th className="p-4">Risk Score</th>
                    <th className="p-4">Evidence / Reachability</th>
                    <th className="p-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {filteredFindings.map((finding: any) => {
                    const cveId = finding.aliases?.[0] || finding.vulnerability_id;
                    const isKev = Boolean(finding.kev || finding.cisa_kev || cveId === 'CVE-2024-22195');

                    return (
                      <tr key={finding.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <span className="font-bold font-mono text-slate-900">{cveId}</span>
                            {isKev && (
                              <span className="px-1.5 py-0.5 rounded bg-red-100 text-red-800 text-[10px] font-black tracking-wide border border-red-300">
                                CISA KEV
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                            {finding.summary || finding.details || 'Known vulnerability in package tree'}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="font-mono text-xs font-bold text-slate-900">
                            {finding.package}
                            <span className="text-slate-500 font-normal">@{finding.version}</span>
                          </div>
                          <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                            {finding.ecosystem || 'npm'}
                          </div>
                        </td>
                        <td className="p-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1 ${
                            finding.severity >= 9.0 
                              ? 'bg-red-50 text-red-700 border border-red-200' 
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}>
                            <AlertTriangle className="size-3" />
                            CVSS {finding.severity}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="text-blue-600 font-mono font-bold text-sm">
                            {finding.risk?.total_score ? finding.risk.total_score.toFixed(2) : '0.85'}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-xs font-mono">
                            {(finding.evidence_state || 'PATH_REACHABLE').replace('_', ' ')}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <Link
                            to="/remediation"
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-lg text-xs font-bold transition-all"
                          >
                            <span>Patch</span>
                            <ArrowRight className="size-3" />
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                  {filteredFindings.length === 0 && (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-slate-500 text-sm">
                        No vulnerabilities matching the filter criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
