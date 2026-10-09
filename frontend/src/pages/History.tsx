import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Clock, ShieldAlert, Layers } from 'lucide-react';
import { getScanHistory } from '../firebase';

import { useAppStore } from '../store';

export default function History() {
  const [scans, setScans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const user = useAppStore(state => state.user);

  useEffect(() => {
    async function loadScans() {
      const history = await getScanHistory(user ? user.uid : 'anonymous');
      setScans(history);
      setLoading(false);
    }
    loadScans();
  }, [user]);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Scan History</h1>
      <p className="text-text-muted max-w-3xl">
        Review previously completed workspace scans stored securely in Firebase Firestore.
      </p>

      {loading ? (
        <div className="text-center text-text-muted py-12">Loading history from Firebase...</div>
      ) : scans.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center text-text-muted">
            <Clock className="w-12 h-12 mb-4 opacity-50" />
            <p>No scan history found.</p>
            <p className="text-sm">Run a New Analysis to save your first scan to Firestore.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {scans.map((scan) => (
            <Card key={scan.id} className="hover:border-primary/50 transition-colors">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="space-y-1">
                  <div className="font-mono text-primary font-bold">
                    {scan.scan_id || scan.id}
                  </div>
                  <div className="text-xs text-text-muted flex items-center gap-2">
                    <Clock className="w-3 h-3" />
                    {new Date(scan.uploaded_at).toLocaleString()}
                  </div>
                </div>
                
                <div className="flex gap-6">
                  <div className="flex flex-col items-end">
                    <div className="text-sm font-semibold flex items-center gap-1">
                      <Layers className="w-4 h-4 text-text-muted" />
                      {scan.project_count || 1}
                    </div>
                    <span className="text-[10px] text-text-muted uppercase">Projects</span>
                  </div>
                  
                  <div className="flex flex-col items-end">
                    <div className="text-sm font-semibold flex items-center gap-1">
                      <ShieldAlert className="w-4 h-4 text-danger" />
                      {scan.finding_count || 0}
                    </div>
                    <span className="text-[10px] text-text-muted uppercase">Findings</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
