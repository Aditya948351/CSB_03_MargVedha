import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { useAppStore } from '../store';
import { ShieldAlert, Package, Layers, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
  const { projects, findings, graph, uploaded_at } = useAppStore(state => state.scanResult);
  
  const criticalFindings = findings.filter((f: any) => f.severity >= 9.0);
  const highFindings = findings.filter((f: any) => f.severity >= 7.0 && f.severity < 9.0);
  const fixableFindings = findings.filter((f: any) => f.risk.fix_available);
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Security Overview</h1>
          <p className="text-text-muted mt-1">Workspace analysis completed at {new Date(uploaded_at).toLocaleString()}</p>
        </div>
        <Link 
          to="/import"
          className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-md font-medium transition-colors flex items-center gap-2"
        >
          <Activity className="w-4 h-4" />
          New Analysis
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-text-muted">Total Projects</CardTitle>
            <Layers className="w-4 h-4 text-text-muted" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projects.length}</div>
            <p className="text-xs text-text-muted mt-1">{graph.nodes.length} total nodes analyzed</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-text-muted">Vulnerabilities</CardTitle>
            <ShieldAlert className="w-4 h-4 text-danger" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{findings.length}</div>
            <p className="text-xs text-danger mt-1">{criticalFindings.length} Critical, {highFindings.length} High</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-text-muted">Fixable Findings</CardTitle>
            <Package className="w-4 h-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{fixableFindings.length}</div>
            <p className="text-xs text-text-muted mt-1">Updates available for {Math.round((fixableFindings.length / findings.length) * 100)}%</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-text-muted">Risk Score</CardTitle>
            <Activity className="w-4 h-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">B-</div>
            <p className="text-xs text-text-muted mt-1">Based on EPSS & KEV exposure</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top Prioritized Findings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {findings.sort((a, b) => b.risk.total_score - a.risk.total_score).slice(0, 3).map(finding => (
                <div key={finding.id} className="flex items-start justify-between p-3 rounded-md bg-background border border-border">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-text">{finding.package}</span>
                      <Badge variant={finding.severity >= 9 ? 'danger' : 'warning'}>CVSS {finding.severity}</Badge>
                      {finding.risk.kev && <Badge variant="danger">KEV</Badge>}
                    </div>
                    <div className="text-sm text-text-muted mt-1">
                      {finding.aliases.join(', ')} • Affected: {finding.affected_projects.length} projects
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-primary">{finding.risk.total_score.toFixed(2)}</div>
                    <div className="text-[10px] text-text-muted uppercase tracking-wider">Risk Score</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Findings by Severity</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center pt-6">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={[
                { name: 'Critical', count: criticalFindings.length, fill: '#ef4444' },
                { name: 'High', count: highFindings.length, fill: '#f59e0b' },
                { name: 'Medium', count: findings.length - criticalFindings.length - highFindings.length, fill: '#3b82f6' }
              ]}>
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{fill: '#1f2937'}}
                  contentStyle={{ backgroundColor: '#151b28', borderColor: '#2d3748', color: '#f8fafc' }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
