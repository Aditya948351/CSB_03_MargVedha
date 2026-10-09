# MARGVEDHA
**M**apping **A**nd **R**isk **G**raph for **V**ulnerability **E**valuation, **D**etection & **H**ardening **A**pplications

*Trace the Risk. Secure the Path.*

## Problem Statement

CSB-03 — Supply-Chain Vulnerability Propagation Graph (CISA)

A single vulnerable open-source package can silently affect thousands of downstream applications. Security teams struggle to see how far a newly disclosed CVE has actually propagated through their dependency tree.

## Key Features

- **Explainable Vulnerability Propagation Graph**: See exactly how vulnerabilities reach your projects through transitive dependencies.
- **Evidence-Tiered Labeling**: Differentiate between "advisory match", "potential exposure", and "reachable path".
- **Remediation Planner**: Compare before-and-after states to see the impact of candidate dependency upgrades before you apply them.
- **Multi-Project Analysis**: Understand how a shared vulnerable package affects multiple codebases in your portfolio.

## Technology Stack

- **Frontend**: React, TypeScript, Vite, Tailwind CSS v4, Lucide Icons, Recharts
- **Graph Visualization**: Cytoscape.js (`react-cytoscapejs`)
- **Backend (Planned)**: Python, FastAPI, NetworkX, OSV.dev API, CISA KEV Data

## Architecture Overview

MARGVEDHA separates its demonstration UI from the core scanning logic through explicit data contracts. The frontend React application visualizes dependency graphs and findings using deterministic sample fixtures, representing how it will integrate with the future Python/FastAPI analysis service.

See [Architecture](docs/architecture.md) for more details.

## Prerequisites

- Node.js 18+
- npm 9+

## Installation

```bash
cd frontend
npm install
```

## Development Commands

```bash
# Start the development server (Demo Mode)
npm run dev

# Run type checking and build for production
npm run build
```

## Demo Mode

The application currently runs in a deterministic **Demo Mode** using the bundled sample workspace. This ensures a reliable, repeatable demonstration of the core workflow (graph exploration, finding explanation, and remediation simulation) without requiring live network calls to vulnerability databases.

To access the demo, start the development server (`npm run dev`) and navigate to the dashboard.

## Current Limitations

See [Prototype Limitations](docs/prototype-limitations.md) for a complete breakdown of current capabilities versus planned live integrations.

## Future Roadmap

1. Implement the FastAPI Python backend with NetworkX.
2. Integrate real `package-lock.json` parsing.
3. Integrate live batch queries to the OSV.dev API.
4. Integrate the CISA KEV catalog for enriched risk scoring.
