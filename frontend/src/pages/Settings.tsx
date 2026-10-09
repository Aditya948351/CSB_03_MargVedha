import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';

export default function Settings() {
  return (
    <div className="space-y-6 max-w-4xl">
      <h1 className="text-3xl font-bold tracking-tight">Settings & Data Transparency</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Analysis Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center p-4 bg-background border border-border rounded-md">
            <div>
              <div className="font-medium">Analysis Mode</div>
              <div className="text-sm text-text-muted">Current operational mode of the platform.</div>
            </div>
            <div className="px-3 py-1 bg-primary/20 text-primary border border-primary/30 rounded-full text-xs font-bold uppercase">
              Demo Workspace
            </div>
          </div>
          <div className="flex justify-between items-center p-4 bg-background border border-border rounded-md">
            <div>
              <div className="font-medium">Data Retention</div>
              <div className="text-sm text-text-muted">Handling of uploaded project archives.</div>
            </div>
            <div className="text-sm">
              Ephemeral (Deleted after scan)
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Vulnerability Intelligence Sources</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center border-b border-border pb-4">
            <div>
              <div className="font-medium">OSV.dev API</div>
              <div className="text-sm text-text-muted">Primary source for open-source vulnerability mapping.</div>
            </div>
            <span className="text-success text-sm flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-success"></span> Connected
            </span>
          </div>
          <div className="flex justify-between items-center border-b border-border pb-4">
            <div>
              <div className="font-medium">CISA KEV Catalog</div>
              <div className="text-sm text-text-muted">Known Exploited Vulnerabilities tracking.</div>
            </div>
            <span className="text-success text-sm flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-success"></span> Cached
            </span>
          </div>
          <div className="flex justify-between items-center">
            <div>
              <div className="font-medium">FIRST EPSS</div>
              <div className="text-sm text-text-muted">Exploit Prediction Scoring System probabilities.</div>
            </div>
            <span className="text-success text-sm flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-success"></span> Active
            </span>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Risk Scoring Methodology</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-text-muted mb-4">
            MARGVEDHA prioritizes findings using a weighted heuristic that incorporates multiple evidence sources to reduce alert fatigue.
          </p>
          <div className="bg-background border border-border rounded-md p-4 font-mono text-sm">
            risk_score = <br/>
            &nbsp;&nbsp;0.30 * (cvss / 10.0) + <br/>
            &nbsp;&nbsp;0.35 * (is_kev ? 1.0 : 0.0) + <br/>
            &nbsp;&nbsp;0.15 * epss_probability + <br/>
            &nbsp;&nbsp;0.10 * topology_factor + <br/>
            &nbsp;&nbsp;0.05 * fix_availability + <br/>
            &nbsp;&nbsp;0.05 * shared_project_count
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
