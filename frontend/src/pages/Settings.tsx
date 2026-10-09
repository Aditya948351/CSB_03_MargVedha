import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';

import { useAppStore } from '../store';

export default function Settings() {
  const { user, scanCount } = useAppStore();

  return (
    <div className="space-y-6 max-w-4xl">
      <h1 className="text-3xl font-bold tracking-tight">Settings & Account</h1>

      {user && (
        <Card>
          <CardHeader>
            <CardTitle>Subscription & Quota</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4 border-b border-border pb-6">
              <img src={user.photoURL || `https://ui-avatars.com/api/?name=${user.email}`} alt="Avatar" className="w-16 h-16 rounded-full" />
              <div>
                <h3 className="text-xl font-bold text-slate-900">{user.displayName || 'Google User'}</h3>
                <p className="text-sm text-text-muted">{user.email}</p>
                <div className="mt-2 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                  Standard Tier
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm font-medium text-slate-700">
                <span>Free Tier Usage</span>
                <span>{scanCount} / 10 Scans Used</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3">
                <div 
                  className={`h-3 rounded-full transition-all ${scanCount >= 10 ? 'bg-red-500' : 'bg-primary'}`} 
                  style={{ width: `${Math.min(100, (scanCount / 10) * 100)}%` }}
                ></div>
              </div>
              {scanCount >= 10 ? (
                <div className="bg-red-50 text-red-700 p-4 rounded-lg mt-4 text-sm font-medium border border-red-200">
                  You have reached your 10 free scans. Future scans will require the Pro Tier at ₹500/scan.
                  <button className="block mt-3 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors">
                    Upgrade to Pro Plan
                  </button>
                </div>
              ) : (
                <div className="bg-blue-50 text-blue-700 p-4 rounded-lg mt-4 text-sm border border-blue-200 flex justify-between items-center">
                  <span>You have {10 - scanCount} free scans remaining.</span>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors">
                    Upgrade to Pro Early
                  </button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
      
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
