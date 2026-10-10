import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import CytoscapeComponent from 'react-cytoscapejs';
import { useAppStore } from '../store';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { 
  Network, GitBranch, Activity, Sparkles, UploadCloud, 
  ShieldCheck, AlertTriangle, ArrowRight, X, Layers 
} from 'lucide-react';

export default function GraphExplorer() {
  const { graph, findings } = useAppStore(state => state.scanResult);
  const { isDemoMode, loadDemoWorkspace, clearDemoWorkspace } = useAppStore();
  const [selectedNode, setSelectedNode] = useState<any>(null);

  const hasNodes = graph && Array.isArray(graph.nodes) && graph.nodes.length > 0;

  const elements = useMemo(() => {
    if (!hasNodes) return [];
    
    const nodes = (graph.nodes || []).map((n: any) => {
      const data = n.data || n;
      let color = '#6366f1'; // Indigo for default/clean
      let shadowColor = '#818cf8';
      let shape = 'hexagon';
      let size = 36;
      
      const rawType = (data.type || '').toLowerCase();
      if (rawType === 'project') {
        color = '#10b981'; // Green for root project
        shadowColor = '#34d399';
        shape = 'diamond';
        size = 44;
      } else if (rawType === 'vulnerability') {
        color = '#ef4444'; // Red for Vulnerability
        shadowColor = '#f87171';
        shape = 'triangle';
        size = 40;
      } else if (rawType.includes('package')) {
        const rawLabel = data.label || data.name || data.id || '';
        const pkgName = rawLabel.split('@')[0].replace(/^pkg:(npm|pypi)\//, '');
        const isVulnerable = (findings || []).some((f: any) => f.package === pkgName || (data.id && data.id.includes(f.package)));
        if (isVulnerable) {
          color = '#f59e0b'; // Amber for vulnerable package
          shadowColor = '#fbbf24';
          shape = 'round-rectangle';
          size = 40;
        } else {
          color = '#6366f1'; // Indigo for clean package
          shadowColor = '#818cf8';
          shape = 'ellipse';
        }
      }

      return {
        data: {
          ...data,
          id: data.id,
          label: data.label || data.name || data.id,
          type: data.type
        },
        style: {
          'background-color': color,
          'shape': shape,
          'shadow-color': shadowColor,
          'width': size,
          'height': size,
        }
      };
    });

    const edges = (graph.edges || []).map((e: any, i: number) => {
      const data = e.data || e;
      const rawType = (data.type || '').toLowerCase();
      const isVuln = rawType === 'vulnerability' || rawType === 'has_vulnerability';
      return {
        data: {
          id: data.id || `e${i}`,
          source: data.source || data.from,
          target: data.target || data.to,
          type: data.type
        },
        style: {
          'line-color': isVuln ? '#ef4444' : '#cbd5e1',
          'target-arrow-color': isVuln ? '#ef4444' : '#cbd5e1',
          'line-style': isVuln ? 'dashed' : 'solid',
          'width': isVuln ? 3 : 2,
        }
      };
    });

    return [...nodes, ...edges];
  }, [graph, findings, hasNodes]);

  const cyStylesheet = [
    {
      selector: 'node',
      style: {
        'label': 'data(label)',
        'color': '#1e293b',
        'font-family': 'Inter, sans-serif',
        'font-size': '12px',
        'font-weight': '700',
        'text-valign': 'bottom',
        'text-margin-y': '8px',
        'background-color': 'data(style.background-color)',
        'shape': 'data(style.shape)',
        'width': 'data(style.width)',
        'height': 'data(style.height)',
        'border-width': 3,
        'border-color': '#ffffff',
        'shadow-blur': 20,
        'shadow-color': 'data(style.shadow-color)',
        'shadow-opacity': 0.6,
        'shadow-offset-y': 4,
        'transition-property': 'background-color, shadow-blur, shadow-opacity',
        'transition-duration': '300ms'
      }
    },
    {
      selector: 'edge',
      style: {
        'width': 'data(style.width)',
        'line-color': 'data(style.line-color)',
        'target-arrow-color': 'data(style.target-arrow-color)',
        'line-style': 'data(style.line-style)',
        'target-arrow-shape': 'chevron',
        'curve-style': 'bezier',
        'opacity': 0.75,
        'transition-property': 'line-color, target-arrow-color',
        'transition-duration': '300ms'
      }
    },
    {
      selector: 'node:selected',
      style: {
        'border-color': '#0f172a',
        'border-width': 4,
        'shadow-blur': 30,
        'shadow-opacity': 0.9,
      }
    }
  ];

  return (
    <div className="flex flex-col h-full space-y-4">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 font-sans">Dependency Graph Explorer</h1>
          <p className="text-sm text-slate-500 mt-1">
            Interactive topological supply-chain network visualizing transitive vulnerability paths.
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
        </div>
      </div>

      {/* Demo Workspace Banner */}
      {isDemoMode && hasNodes && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="size-4 text-amber-600" />
            <span>Currently previewing sample demo dependency graph (mock projects & attack chains).</span>
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
      {/* EMPTY / FIRST-TIME STATE (When user hasn't scanned or connected GitHub)  */}
      {/* ========================================================================= */}
      {!hasNodes ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-8 sm:p-12 shadow-sm space-y-8">
          <div className="max-w-2xl mx-auto text-center space-y-3">
            <div className="size-16 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-primary mx-auto shadow-sm">
              <Network className="size-8 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              No Dependency Graph Available
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed text-balance">
              You haven't scanned any project manifests or connected your GitHub repositories yet. MARGVEDHA's topological engine builds an interactive Directed Acyclic Graph (DAG) displaying root projects, direct packages, deep transitive dependencies, and active CVE contagion flows once analyzed.
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
                  Upload a <code className="font-mono text-slate-800">package.json</code> or <code className="font-mono text-slate-800">requirements.txt</code> to instantly map your dependencies.
                </p>
              </div>
              <Link
                to="/import"
                className="w-full bg-primary hover:bg-primary-hover text-white text-xs font-bold py-2 px-3 rounded-lg text-center transition-all flex items-center justify-center gap-1.5"
              >
                <span>Upload & Scan</span>
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
                  Link your personal GitHub account in Settings to monitor repositories and live sync dependency DAGs.
                </p>
              </div>
              <Link
                to="/settings"
                className="w-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-2 px-3 rounded-lg text-center transition-all flex items-center justify-center gap-1.5"
              >
                <span>Connect GitHub</span>
                <ArrowRight className="size-3.5" />
              </Link>
            </div>

            <div className="bg-slate-50 hover:bg-amber-50/50 border border-slate-200 hover:border-amber-300 rounded-xl p-5 transition-all space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="size-10 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                  <Sparkles className="size-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-sm">Preview Sample Graph</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  See how the topological engine visualizes 3 multi-repo projects, transitive chains, and CISA KEV threats.
                </p>
              </div>
              <button
                onClick={loadDemoWorkspace}
                className="w-full bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold py-2 px-3 rounded-lg text-center transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
              >
                <span>🧪 Load Demo Graph</span>
                <ArrowRight className="size-3.5" />
              </button>
            </div>
          </div>

          {/* Graph Legend Explanation Guide */}
          <div className="max-w-4xl mx-auto pt-6 border-t border-slate-100">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 text-center">
              Topological Graph Key & Representation
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center gap-2.5">
                <span className="size-3.5 rotate-45 bg-emerald-500 rounded-[2px] inline-block shrink-0"></span>
                <div>
                  <div className="font-bold text-slate-800">Green Diamond</div>
                  <div className="text-[11px] text-slate-500">Root Application</div>
                </div>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center gap-2.5">
                <span className="size-3.5 bg-blue-500 rounded-sm inline-block shrink-0"></span>
                <div>
                  <div className="font-bold text-slate-800">Blue Square</div>
                  <div className="text-[11px] text-slate-500">Clean Package</div>
                </div>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center gap-2.5">
                <span className="size-3.5 bg-amber-500 rounded-sm inline-block shrink-0"></span>
                <div>
                  <div className="font-bold text-slate-800">Amber Square</div>
                  <div className="text-[11px] text-slate-500">Vulnerable Package</div>
                </div>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center gap-2.5">
                <span className="size-3.5 border-l-[7px] border-l-transparent border-r-[7px] border-r-transparent border-b-[12px] border-b-red-500 inline-block shrink-0"></span>
                <div>
                  <div className="font-bold text-slate-800">Red Triangle</div>
                  <div className="text-[11px] text-slate-500">Active CVE Threat</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ========================================================================= */
        /* INTERACTIVE CYTOSCAPE GRAPH (When nodes are present)                      */
        /* ========================================================================= */
        <div className="flex flex-1 gap-4 overflow-hidden relative min-h-[500px]">
          <div className="flex-1 bg-slate-50 relative overflow-hidden shadow-inner bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:24px_24px] rounded-2xl border border-slate-200">
            {/* Floating Legend Panel */}
            <div className="absolute top-4 left-4 z-20 bg-white/80 backdrop-blur-xl p-4 rounded-xl border border-white shadow-xl shadow-slate-200/50 text-xs space-y-2.5 pointer-events-auto transition-all hover:bg-white/95">
              <div className="font-bold text-slate-900 uppercase tracking-wider text-[10px] mb-3 border-b border-slate-200 pb-2 flex items-center gap-2">
                <Sparkles className="size-3.5 text-indigo-500" />
                <span>Graph Legend & Meaning</span>
              </div>
              <div className="flex items-center gap-3 text-slate-700 font-medium">
                <span className="w-4 h-4 rotate-45 bg-emerald-500 rounded-[3px] inline-block shadow-[0_2px_10px_rgba(16,185,129,0.4)]"></span>
                <span>Root Project</span>
              </div>
              <div className="flex items-center gap-3 text-slate-700 font-medium">
                <span className="w-4 h-4 bg-indigo-500 rounded-full inline-block shadow-[0_2px_10px_rgba(99,102,241,0.4)]"></span>
                <span>Clean Package</span>
              </div>
              <div className="flex items-center gap-3 text-slate-700 font-medium">
                <span className="w-4 h-4 bg-amber-500 rounded-[4px] inline-block shadow-[0_2px_10px_rgba(245,158,11,0.4)]"></span>
                <span>Vulnerable Package</span>
              </div>
              <div className="flex items-center gap-3 text-slate-700 font-medium">
                <span className="w-4 h-4 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[14px] border-b-red-500 inline-block drop-shadow-[0_4px_8px_rgba(239,68,68,0.5)]"></span>
                <span>Active CVE / Threat</span>
              </div>
              <div className="pt-2 mt-2 border-t border-slate-200 flex items-center gap-3 text-[11px] text-slate-500 font-medium">
                <span className="w-5 h-0.5 bg-red-500 inline-block border-b-2 border-red-500 border-dashed"></span>
                <span>Threat Flow Pattern</span>
              </div>
            </div>

            <CytoscapeComponent
              elements={elements}
              stylesheet={cyStylesheet as any}
              style={{ width: '100%', height: '100%' }}
              layout={{ 
                name: 'cose', 
                padding: 60,
                nodeRepulsion: 1500000,
                idealEdgeLength: 150,
                edgeElasticity: 200,
                gravity: 0.2,
                numIter: 1500,
                animate: true,
                animationDuration: 800,
                randomize: true
              }}
              cy={(cy) => {
                cy.on('tap', 'node', (evt) => {
                  setSelectedNode(evt.target.data());
                });
                cy.on('tap', function(event) {
                  if(event.target === cy) {
                    setSelectedNode(null);
                  }
                });
              }}
            />
          </div>

          {selectedNode && (
            <div className="w-80 shrink-0 overflow-y-auto">
              <Card className="shadow-md border-slate-200">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-base font-bold">Node Details</CardTitle>
                  <button 
                    onClick={() => setSelectedNode(null)}
                    className="p-1 hover:bg-slate-100 rounded-md text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    <X className="size-4" />
                  </button>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="text-xs text-text-muted uppercase tracking-wider mb-1">Type</div>
                    <Badge>{selectedNode.type}</Badge>
                  </div>
                  <div>
                    <div className="text-xs text-text-muted uppercase tracking-wider mb-1">Identifier</div>
                    <div className="font-mono text-sm break-all font-semibold text-slate-900">{selectedNode.id}</div>
                  </div>
                  
                  {(selectedNode.type?.toLowerCase() === 'vulnerability' || selectedNode.severity) && (
                    <div>
                      <div className="text-xs text-text-muted uppercase tracking-wider mb-1">Severity</div>
                      <Badge variant="danger">CVSS {selectedNode.severity || '7.5'}</Badge>
                    </div>
                  )}

                  {selectedNode.version && (
                    <div>
                      <div className="text-xs text-text-muted uppercase tracking-wider mb-1">Version</div>
                      <div className="font-mono text-sm">{selectedNode.version}</div>
                    </div>
                  )}

                  <div className="pt-2 border-t border-slate-100">
                    <Link
                      to="/remediation"
                      className="w-full bg-primary hover:bg-primary-hover text-white text-xs font-bold py-2 px-3 rounded-lg text-center transition-all block"
                    >
                      View Z3 Remediation
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
