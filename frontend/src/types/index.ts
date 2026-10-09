export type EvidenceState = 
  | 'ADVISORY_MATCH'
  | 'PROJECT_CONTAINS'
  | 'PATH_REACHABLE';

export interface Project {
  id: string;
  type?: string;
  name?: string;
  source_file: string;
  lockfile?: string;
  ecosystem: string;
  dependency_count: number;
}

export interface PackageVersion {
  id: string;
  type?: string;
  name?: string;
  ecosystem: string;
  version: string;
}

export interface Vulnerability {
  id: string;
  type?: string;
  name?: string;
  aliases: string[];
  severity: number;
  fixed_versions: string[];
  title?: string;
  description?: string;
}

export interface DependencyEdge {
  from?: string;
  to?: string;
  source?: string;
  target?: string;
  type: 'DEPENDS_ON' | 'AFFECTS' | 'HAS_VULNERABILITY';
  dependency_type?: 'direct' | 'transitive';
  declared_range?: string;
}

export interface RiskBreakdown {
  cvss: number;
  kev: boolean;
  epss: number;
  topology: 'direct' | 'transitive';
  fix_available: boolean;
  shared_count: number;
  total_score: number;
}

export interface Finding {
  id: string;
  vulnerability_id: string;
  aliases: string[];
  package: string;
  ecosystem: string;
  version: string;
  severity: number;
  fixed_versions: string[];
  evidence_state: EvidenceState;
  affected_projects: string[];
  paths: string[][]; // Array of node ID paths from project to vulnerability
  risk: RiskBreakdown;
}

export interface RemediationCandidate {
  package: string;
  target_version: string;
  resolves_findings: number;
  risk_reduced: number;
  affected_projects: string[];
  potential_breaking_change: boolean;
}

export interface ScanResult {
  scan_id: string;
  status: 'completed' | 'processing' | 'failed';
  uploaded_at: string;
  projects: Project[];
  graph: {
    nodes: (Project | PackageVersion | Vulnerability)[];
    edges: DependencyEdge[];
  };
  findings: Finding[];
}
