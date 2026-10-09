import { useAppStore } from '../store';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Layers } from 'lucide-react';

export default function MultiProject() {
  const { findings, projects } = useAppStore(state => state.scanResult);
  
  // Find findings that affect multiple projects
  const sharedFindings = findings.filter(f => f.affected_projects.length > 1);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Multi-Project Analysis</h1>
          <p className="text-text-muted mt-1">Cross-project vulnerability propagation and shared dependency clustering.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-text-muted">Projects Analyzed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projects.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-text-muted">Shared Vulnerabilities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{sharedFindings.length}</div>
          </CardContent>
        </Card>
      </div>

      <h3 className="text-xl font-bold mt-8 mb-4 flex items-center gap-2">
        <Layers className="w-5 h-5 text-primary" />
        Cross-Project Remediation Clusters
      </h3>

      <div className="space-y-4">
        {sharedFindings.map(finding => (
          <Card key={finding.id} className="border-warning/30">
            <CardHeader className="pb-3 border-b border-border">
              <div className="flex justify-between items-center">
                <CardTitle className="font-mono text-primary">{finding.package}@{finding.version}</CardTitle>
                <div className="flex gap-2">
                  <Badge variant="warning">CVSS {finding.severity}</Badge>
                  <Badge>{finding.affected_projects.length} Projects Affected</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="text-sm text-text-muted mb-4">
                This vulnerable package is present in multiple projects. Upgrading to <span className="font-mono text-success">{finding.fixed_versions[0]}</span> will remediate {finding.aliases[0]} across all the following projects simultaneously:
              </p>
              <div className="flex flex-wrap gap-2">
                {finding.affected_projects.map(projId => {
                  const proj = projects.find(p => p.id === projId);
                  return (
                    <div key={projId} className="px-3 py-2 bg-background border border-border rounded-md text-sm font-medium">
                      {proj?.name || projId}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        ))}

        {sharedFindings.length === 0 && (
          <div className="p-8 text-center border border-border border-dashed rounded-lg text-text-muted">
            No shared vulnerabilities found across the currently analyzed projects.
          </div>
        )}
      </div>
    </div>
  );
}
