# Prototype Limitations

MARGVEDHA has been built in two distinct layers:
1. **Layer A (Demonstration Experience)**: The interactive frontend.
2. **Layer B (Analysis Foundation)**: The backend parsing and graph generation logic.

For the initial prototype, Layer A is fully implemented while Layer B uses deterministic fixtures.

## Implemented Functionality

- **Explainable Graph Visualization**: The UI fully supports rendering complex multi-project dependency graphs using Cytoscape.js.
- **Dependency Paths**: The UI can trace and highlight the path from a root project through intermediate dependencies to a vulnerable package.
- **Risk Prioritization**: The UI implements the presentation of a multi-factor risk score (CVSS, KEV, EPSS, Topology).
- **Remediation Planner Interface**: The UI allows selecting candidate upgrades and comparing before/after graph states.
- **Evidence-Tiered Labeling**: Findings are explicitly labeled with their evidence state (e.g., `ADVISORY_MATCH`, `PATH_REACHABLE`).

## Simulated Functionality (Demo Mode)

The following features are demonstrated using pre-calculated fixtures. They will be implemented in the FastAPI backend in the next milestone:

- **Manifest Parsing**: The current demo does not parse live ZIP uploads. It simulates a successful parse of a mixed npm/PyPI workspace.
- **OSV.dev Vulnerability Lookup**: The demo uses pre-recorded OSV advisory data (e.g., CVE-2021-23337) rather than making live API calls.
- **Graph Traversal**: The shortest-path calculations to link projects to vulnerabilities are pre-computed in the fixtures.
- **Fix Simulation**: The remediation planner's before/after states use deterministic mock data rather than invoking a live dependency resolver.

## Planned Live Functionality

Once the FastAPI backend is integrated:
1. Uploading a ZIP will trigger an isolated temporary directory extraction.
2. The system will parse `package-lock.json`, `poetry.lock`, etc.
3. The system will batch-query the live OSV.dev API.
4. The system will use NetworkX to dynamically calculate graph paths and centrality.

## Explicit Non-Goals (Out of Scope)

- **Runtime Exploitability / Call-Graph Reachability**: MARGVEDHA identifies structural dependency paths (*potential exposure*). It does not perform static code analysis to prove that a vulnerable function is actually called at runtime.
- **Automated PR Generation**: MARGVEDHA is a triage and planning tool. It will suggest a patch order but will not automatically commit code changes to your repository.
- **Container Scanning**: The tool focuses on application software supply chains (manifests/lockfiles), not OS-level package managers like `apt` or `apk`.
