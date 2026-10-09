import { demoRemediationCandidates, demoFindings } from '../fixtures/demoData';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { CheckCircle2, ArrowRight } from 'lucide-react';

export default function Remediation() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Remediation Planner</h1>
      <p className="text-text-muted max-w-3xl">
        Review candidate upgrades sorted by potential risk reduction. Select a candidate to simulate its impact on the dependency graph and prioritize your patching efforts.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <h3 className="font-semibold text-lg">Candidate Upgrades</h3>
          {demoRemediationCandidates.sort((a, b) => b.risk_reduced - a.risk_reduced).map(candidate => (
            <Card key={candidate.package} className="cursor-pointer hover:border-primary transition-colors">
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="font-bold font-mono text-primary">{candidate.package}</div>
                  <Badge variant="success">Upgrade to {candidate.target_version}</Badge>
                </div>
                <div className="text-sm text-text-muted mb-3">
                  Resolves {candidate.resolves_findings} finding(s) across {candidate.affected_projects.length} project(s).
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-text-muted">Risk Reduction</span>
                  <span className="font-bold text-success">-{candidate.risk_reduced.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="lg:col-span-2 space-y-4">
          <Card className="h-full border-primary/50 bg-surface/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Simulation: <span className="text-primary font-mono">lodash → 4.17.21</span>
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
                  <div className="text-2xl font-bold">{demoFindings.length} Findings</div>
                </div>
                <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                  <div className="text-sm text-primary uppercase tracking-wider mb-2">After</div>
                  <div className="text-2xl font-bold text-primary">{demoFindings.length - 1} Findings</div>
                </div>
              </div>

              <h4 className="font-semibold mb-4">Potentially Resolved Findings</h4>
              <div className="space-y-2">
                <div className="p-3 bg-success/10 border border-success/20 rounded-md flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="line-through text-text-muted font-mono">lodash@4.17.19</span>
                    <ArrowRight className="w-4 h-4 text-success" />
                    <span className="font-mono text-success">lodash@4.17.21</span>
                  </div>
                  <Badge variant="success">CVE-2021-23337</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
