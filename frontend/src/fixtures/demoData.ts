import type { ScanResult, Project, PackageVersion, Vulnerability, Finding, RemediationCandidate } from '../types';

export const demoProjects: Project[] = [
  {
    id: "proj:frontend-app",
    name: "frontend-app",
    source_file: "package.json",
    lockfile: "package-lock.json",
    ecosystem: "npm",
    dependency_count: 142
  },
  {
    id: "proj:admin-dashboard",
    name: "admin-dashboard",
    source_file: "package.json",
    lockfile: "package-lock.json",
    ecosystem: "npm",
    dependency_count: 85
  },
  {
    id: "proj:legacy-api",
    name: "legacy-api",
    source_file: "requirements.txt",
    ecosystem: "PyPI",
    dependency_count: 24
  }
];

export const demoNodes: (Project | PackageVersion | Vulnerability | any)[] = [
  ...demoProjects.map(p => ({ ...p, type: 'Project' })),
  
  // Shared dependency
  { id: "pkg:npm/lodash@4.17.19", type: "PackageVersion", ecosystem: "npm", name: "lodash", version: "4.17.19" },
  { id: "vuln:GHSA-35jh-r3h4-6jhm", type: "Vulnerability", aliases: ["CVE-2021-23337"], severity: 7.5, fixed_versions: ["4.17.21"], title: "Command Injection in lodash" },

  // Transitive path in frontend-app
  { id: "pkg:npm/express@4.18.2", type: "PackageVersion", ecosystem: "npm", name: "express", version: "4.18.2" },
  { id: "pkg:npm/body-parser@1.20.1", type: "PackageVersion", ecosystem: "npm", name: "body-parser", version: "1.20.1" },
  { id: "pkg:npm/qs@6.11.0", type: "PackageVersion", ecosystem: "npm", name: "qs", version: "6.11.0" },
  { id: "vuln:GHSA-hrpp-h998-j396", type: "Vulnerability", aliases: ["CVE-2022-24999"], severity: 7.5, fixed_versions: ["6.11.1"], title: "Prototype Pollution in qs" },

  // Direct PyPI vulnerability
  { id: "pkg:pypi/jinja2@2.11.2", type: "PackageVersion", ecosystem: "PyPI", name: "jinja2", version: "2.11.2" },
  { id: "vuln:GHSA-xrrc-28j2-r2xp", type: "Vulnerability", aliases: ["CVE-2024-22195"], severity: 8.2, fixed_versions: ["2.11.3"], title: "XSS in Jinja2" }
];

export const demoEdges: any[] = [
  // frontend-app deps
  { source: "proj:frontend-app", target: "pkg:npm/express@4.18.2", type: "DEPENDS_ON", dependency_type: "direct" },
  { source: "pkg:npm/express@4.18.2", target: "pkg:npm/body-parser@1.20.1", type: "DEPENDS_ON", dependency_type: "transitive" },
  { source: "pkg:npm/body-parser@1.20.1", target: "pkg:npm/qs@6.11.0", type: "DEPENDS_ON", dependency_type: "transitive" },
  { source: "proj:frontend-app", target: "pkg:npm/lodash@4.17.19", type: "DEPENDS_ON", dependency_type: "direct" },

  // admin-dashboard deps
  { source: "proj:admin-dashboard", target: "pkg:npm/lodash@4.17.19", type: "DEPENDS_ON", dependency_type: "direct" },

  // legacy-api deps
  { source: "proj:legacy-api", target: "pkg:pypi/jinja2@2.11.2", type: "DEPENDS_ON", dependency_type: "direct" },

  // Vulnerability edges
  { source: "pkg:npm/lodash@4.17.19", target: "vuln:GHSA-35jh-r3h4-6jhm", type: "HAS_VULNERABILITY" },
  { source: "pkg:npm/qs@6.11.0", target: "vuln:GHSA-hrpp-h998-j396", type: "HAS_VULNERABILITY" },
  { source: "pkg:pypi/jinja2@2.11.2", target: "vuln:GHSA-xrrc-28j2-r2xp", type: "HAS_VULNERABILITY" },
];

export const demoFindings: Finding[] = [
  {
    id: "finding:GHSA-35jh:lodash:4.17.19",
    vulnerability_id: "GHSA-35jh-r3h4-6jhm",
    aliases: ["CVE-2021-23337"],
    package: "lodash",
    ecosystem: "npm",
    version: "4.17.19",
    severity: 7.5,
    fixed_versions: ["4.17.21"],
    evidence_state: "PROJECT_CONTAINS",
    affected_projects: ["proj:frontend-app", "proj:admin-dashboard"],
    paths: [
      ["proj:frontend-app", "pkg:npm/lodash@4.17.19"],
      ["proj:admin-dashboard", "pkg:npm/lodash@4.17.19"]
    ],
    risk: {
      cvss: 7.5,
      kev: false,
      epss: 0.05,
      topology: "direct",
      fix_available: true,
      shared_count: 2,
      total_score: 0.65
    }
  },
  {
    id: "finding:GHSA-hrpp:qs:6.11.0",
    vulnerability_id: "GHSA-hrpp-h998-j396",
    aliases: ["CVE-2022-24999"],
    package: "qs",
    ecosystem: "npm",
    version: "6.11.0",
    severity: 7.5,
    fixed_versions: ["6.11.1"],
    evidence_state: "PATH_REACHABLE",
    affected_projects: ["proj:frontend-app"],
    paths: [
      ["proj:frontend-app", "pkg:npm/express@4.18.2", "pkg:npm/body-parser@1.20.1", "pkg:npm/qs@6.11.0"]
    ],
    risk: {
      cvss: 7.5,
      kev: false,
      epss: 0.02,
      topology: "transitive",
      fix_available: true,
      shared_count: 1,
      total_score: 0.45
    }
  },
  {
    id: "finding:GHSA-xrrc:jinja2:2.11.2",
    vulnerability_id: "GHSA-xrrc-28j2-r2xp",
    aliases: ["CVE-2024-22195"],
    package: "jinja2",
    ecosystem: "PyPI",
    version: "2.11.2",
    severity: 8.2,
    fixed_versions: ["2.11.3"],
    evidence_state: "ADVISORY_MATCH", // Requirements.txt so only advisory match
    affected_projects: ["proj:legacy-api"],
    paths: [
      ["proj:legacy-api", "pkg:pypi/jinja2@2.11.2"]
    ],
    risk: {
      cvss: 8.2,
      kev: true, // Let's pretend it's in KEV for demo purposes
      epss: 0.12,
      topology: "direct",
      fix_available: true,
      shared_count: 1,
      total_score: 0.88 // High due to KEV
    }
  }
];

export const demoScanResult: ScanResult = {
  scan_id: "demo-scan-001",
  status: "completed",
  uploaded_at: new Date().toISOString(),
  projects: demoProjects,
  graph: {
    nodes: demoNodes,
    edges: demoEdges
  },
  findings: demoFindings
};

export const demoRemediationCandidates: RemediationCandidate[] = [
  {
    package: "lodash",
    target_version: "4.17.21",
    resolves_findings: 1,
    risk_reduced: 0.65,
    affected_projects: ["proj:frontend-app", "proj:admin-dashboard"],
    potential_breaking_change: false
  },
  {
    package: "jinja2",
    target_version: "2.11.3",
    resolves_findings: 1,
    risk_reduced: 0.88,
    affected_projects: ["proj:legacy-api"],
    potential_breaking_change: false
  },
  {
    package: "express",
    target_version: "4.19.0", // Upgrading express might update qs transitively
    resolves_findings: 1,
    risk_reduced: 0.45,
    affected_projects: ["proj:frontend-app"],
    potential_breaking_change: true
  }
];
