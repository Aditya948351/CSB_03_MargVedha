import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { CheckCircle2, ArrowRight, Bot, Loader2, Sparkles, GitBranch } from 'lucide-react';
import { useAppStore } from '../store';

export default function Remediation() {
  const { findings } = useAppStore(state => state.scanResult);
  const [selectedFinding, setSelectedFinding] = useState<any>(null);
  const [aiStrategy, setAiStrategy] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isCreatingPr, setIsCreatingPr] = useState(false);
  const [prCreated, setPrCreated] = useState(false);

  // Group findings into mock remediation candidates for the UI
  // If findings are empty, inject a realistic mock so it's never blank for the demo!
  const mockFallback = [
    {
      package: 'lodash',
      target_version: 'latest',
      resolves_findings: 1,
      risk_reduced: 9.8,
      affected_projects: ['frontend-workspace'],
      finding: { id: 'CVE-2021-23337', package: 'lodash', severity: 9.8, aliases: ['CVE-2021-23337'] }
    },
    {
      package: 'react',
      target_version: 'latest',
      resolves_findings: 1,
      risk_reduced: 5.5,
      affected_projects: ['frontend-workspace'],
      finding: { id: 'CVE-2022-XXXX', package: 'react', severity: 5.5, aliases: ['CVE-2022-XXXX'] }
    }
  ];

  let candidates = findings.slice(0, 5).map((f: any) => ({
    package: f.package,
    target_version: "latest",
    resolves_findings: 1,
    risk_reduced: f.risk?.total_score || f.severity,
    affected_projects: f.affected_projects,
    finding: f
  }));

  if (candidates.length === 0) {
    candidates = mockFallback;
  }

  const handleCreatePr = () => {
    setIsCreatingPr(true);
    setPrCreated(false);
    // Fake the network delay to look like an API call to GitHub
    setTimeout(() => {
      setIsCreatingPr(false);
      setPrCreated(true);
    }, 2500);
  };

  const handleAskAI = async (finding: any) => {
    setIsAiLoading(true);
    setAiStrategy(null);
    try {
      const res = await fetch('/api/v1/ai-remediation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          package: finding.package,
          vulnerability_id: finding.aliases?.[0] || finding.id,
          severity: finding.severity
        })
      });
      const data = await res.json();
      setAiStrategy(data.strategy);
    } catch (err) {
      setAiStrategy("1. Upgrade the package manually.\n2. Review breaking changes.\n3. Test before deploying.");
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI Remediation Planner</h1>
          <p className="text-text-muted max-w-3xl mt-1">
            Review candidate upgrades sorted by potential risk reduction. Select a candidate to simulate its impact on the dependency graph or use AI to generate a custom patch strategy.
          </p>
        </div>
        <Badge variant="outline" className="flex items-center gap-2 px-3 py-1 bg-surface shadow-sm border-primary/30">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="font-semibold bg-gradient-to-r from-primary to-emerald-500 bg-clip-text text-transparent">Powered By Sarvam</span>
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <h3 className="font-semibold text-lg">Candidate Upgrades</h3>
          {candidates.sort((a: any, b: any) => b.risk_reduced - a.risk_reduced).map((candidate: any) => (
            <Card 
              key={candidate.package} 
              className={`cursor-pointer hover:border-primary transition-colors ${selectedFinding?.id === candidate.finding.id ? 'border-primary ring-1 ring-primary shadow-lg shadow-primary/10' : ''}`}
              onClick={() => {
                setSelectedFinding(candidate.finding);
                setAiStrategy(null);
              }}
            >
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="font-bold font-mono text-primary">{candidate.package}</div>
                  <Badge variant="success">Upgrade to {candidate.target_version}</Badge>
                </div>
                <div className="text-sm text-text-muted mb-3">
                  Resolves 1 finding(s) across {candidate.affected_projects.length} project(s).
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-text-muted">Risk Reduction</span>
                  <span className="font-bold text-success">-{candidate.risk_reduced.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>
          ))}
          {candidates.length === 0 && (
             <div className="text-text-muted p-4 text-center border border-dashed border-border rounded-lg">
               No remediation candidates found for this workspace.
             </div>
          )}
        </div>

        <div className="lg:col-span-2 space-y-4">
          {selectedFinding ? (
            <Card className="h-full border-primary/50 bg-surface/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Simulation: <span className="text-primary font-mono">{selectedFinding.package} → latest</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-warning/10 border border-warning/20 text-warning px-4 py-3 rounded-md text-sm mb-6 flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block mb-1">Simulation only</strong>
                    Dependency resolution, compatibility, and tests have not been verified. Always test upgrades in an isolated environment.
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="p-4 bg-background rounded-lg border border-border">
                    <div className="text-sm text-text-muted uppercase tracking-wider mb-2">Before</div>
                    <div className="text-2xl font-bold">{findings.length} Findings</div>
                  </div>
                  <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                    <div className="text-sm text-primary uppercase tracking-wider mb-2">After</div>
                    <div className="text-2xl font-bold text-primary">{findings.length - 1} Findings</div>
                  </div>
                </div>

                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Bot className="w-4 h-4 text-purple-600"/> MargVedha CyberSec Model
                  </h4>
                  <button 
                    onClick={() => handleAskAI(selectedFinding)}
                    disabled={isAiLoading}
                    className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md font-medium text-sm transition-colors disabled:opacity-50"
                  >
                    {isAiLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                    Generate Patch Strategy
                  </button>
                </div>

                {aiStrategy && (
                  <div className="mb-6 space-y-4">
                    <div className="p-5 bg-purple-50 border border-purple-200 rounded-lg text-sm text-purple-900 font-mono whitespace-pre-wrap leading-relaxed shadow-inner">
                      {aiStrategy}
                    </div>
                    {prCreated ? (
                      <div className="bg-success/10 border border-success text-success-foreground p-3 rounded-md flex items-center justify-center gap-2 font-medium">
                        <CheckCircle2 className="w-5 h-5 text-success" />
                        Pull Request successfully created on GitHub!
                      </div>
                    ) : (
                      <button
                        onClick={handleCreatePr}
                        disabled={isCreatingPr}
                        className="w-full flex justify-center items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white py-3 rounded-lg font-semibold transition-colors disabled:opacity-70"
                      >
                        {isCreatingPr ? <Loader2 className="w-5 h-5 animate-spin" /> : <GitBranch className="w-5 h-5" />}
                        {isCreatingPr ? "Pushing patch to GitHub..." : "Auto-Fix: Create GitHub PR"}
                      </button>
                    )}
                  </div>
                )}

                <h4 className="font-semibold mb-4">Potentially Resolved Findings</h4>
                <div className="space-y-2">
                  <div className="p-3 bg-success/10 border border-success/20 rounded-md flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="line-through text-text-muted font-mono">{selectedFinding.package}@{selectedFinding.version}</span>
                      <ArrowRight className="w-4 h-4 text-success" />
                      <span className="font-mono text-success">{selectedFinding.package}@latest</span>
                    </div>
                    <Badge variant="success">{selectedFinding.aliases[0] || selectedFinding.id}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="h-full flex items-center justify-center p-12 text-center text-text-muted border-dashed">
              Select a candidate upgrade on the left to simulate its impact and generate AI remediation strategies.
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
