import { useAppStore } from '../store';

export default function Vulnerabilities() {
  const { findings } = useAppStore(state => state.scanResult);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Vulnerabilities</h1>
      <div className="bg-surface border border-border rounded-lg overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border bg-surface-hover/50">
              <th className="p-4 font-medium text-text-muted">Vulnerability</th>
              <th className="p-4 font-medium text-text-muted">Package</th>
              <th className="p-4 font-medium text-text-muted">Severity</th>
              <th className="p-4 font-medium text-text-muted">Risk Score</th>
              <th className="p-4 font-medium text-text-muted">Evidence State</th>
            </tr>
          </thead>
          <tbody>
            {findings.map(finding => (
              <tr key={finding.id} className="border-b border-border hover:bg-surface-hover/30 transition-colors">
                <td className="p-4 font-medium">{finding.aliases[0] || finding.vulnerability_id}</td>
                <td className="p-4">
                  <div className="font-mono text-sm">{finding.package}@{finding.version}</div>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${finding.severity >= 9 ? 'bg-danger/20 text-danger' : 'bg-warning/20 text-warning'}`}>
                    CVSS {finding.severity}
                  </span>
                </td>
                <td className="p-4 text-primary font-bold">{finding.risk.total_score.toFixed(2)}</td>
                <td className="p-4 text-sm text-text-muted">{finding.evidence_state.replace('_', ' ')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
