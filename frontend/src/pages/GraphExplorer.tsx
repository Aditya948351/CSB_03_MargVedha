import { useState, useMemo } from 'react';
import CytoscapeComponent from 'react-cytoscapejs';
import { useAppStore } from '../store';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';

export default function GraphExplorer() {
  const { graph, findings } = useAppStore(state => state.scanResult);
  const [selectedNode, setSelectedNode] = useState<any>(null);

  const elements = useMemo(() => {
    const nodes = graph.nodes.map((n: any) => {
      const data = n.data || n;
      let color = '#3b82f6'; // default primary
      let shape = 'round-rectangle';
      
      if (data.type === 'project') {
        color = '#10b981'; // success
        shape = 'diamond';
      } else if (data.type === 'vulnerability') {
        color = '#ef4444'; // danger
        shape = 'triangle';
      } else if (data.type === 'package') {
        // Check if package is vulnerable
        const pkgName = data.label.split('@')[0];
        const isVulnerable = findings.some(f => f.package === pkgName);
        if (isVulnerable) color = '#f59e0b'; // warning
      }

      return {
        data: {
          ...data,
          id: data.id,
          label: data.label || data.id,
          type: data.type
        },
        style: {
          'background-color': color,
          'shape': shape,
        }
      };
    });

    const edges = graph.edges.map((e: any, i: number) => {
      const data = e.data || e;
      return {
        data: {
          id: data.id || `e${i}`,
          source: data.source || data.from,
          target: data.target || data.to,
          type: data.type
        },
        style: {
          'line-color': data.type === 'vulnerability' ? '#ef4444' : '#94a3b8',
          'target-arrow-color': data.type === 'vulnerability' ? '#ef4444' : '#94a3b8',
        }
      };
    });

    return [...nodes, ...edges];
  }, [graph, findings]);

  const cyStylesheet = [
    {
      selector: 'node',
      style: {
        'label': 'data(label)',
        'color': '#0f172a',
        'font-size': '12px',
        'text-valign': 'bottom',
        'text-margin-y': '5px',
        'background-color': 'data(style.background-color)',
        'shape': 'data(style.shape)',
      }
    },
    {
      selector: 'edge',
      style: {
        'width': 2,
        'line-color': 'data(style.line-color)',
        'target-arrow-color': 'data(style.target-arrow-color)',
        'target-arrow-shape': 'triangle',
        'curve-style': 'bezier',
        'opacity': 0.6
      }
    }
  ];

  return (
    <div className="flex flex-col h-full space-y-4">
      <h1 className="text-3xl font-bold tracking-tight">Dependency Graph</h1>
      
      <div className="flex flex-1 gap-4 overflow-hidden">
        <div className="flex-1 bg-surface border border-border rounded-lg relative overflow-hidden">
          <CytoscapeComponent
            elements={elements}
            stylesheet={cyStylesheet as any}
            style={{ width: '100%', height: '100%' }}
            layout={{ 
              name: 'cose', 
              padding: 50,
              nodeRepulsion: 400000,
              idealEdgeLength: 100
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
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Node Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="text-xs text-text-muted uppercase tracking-wider mb-1">Type</div>
                  <Badge>{selectedNode.type}</Badge>
                </div>
                <div>
                  <div className="text-xs text-text-muted uppercase tracking-wider mb-1">Identifier</div>
                  <div className="font-mono text-sm break-all">{selectedNode.id}</div>
                </div>
                
                {selectedNode.type === 'Vulnerability' && (
                  <div>
                    <div className="text-xs text-text-muted uppercase tracking-wider mb-1">Severity</div>
                    <Badge variant="danger">CVSS {selectedNode.severity}</Badge>
                  </div>
                )}

                {selectedNode.type === 'PackageVersion' && (
                  <div>
                    <div className="text-xs text-text-muted uppercase tracking-wider mb-1">Version</div>
                    <div className="font-mono text-sm">{selectedNode.version}</div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
