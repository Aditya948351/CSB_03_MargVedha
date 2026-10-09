# MARGVEDHA Judge Demo Script

This script provides a reproducible, 3-minute demonstration workflow for hackathon judges, utilizing the deterministic demo workspace.

## Setup
1. Ensure the frontend is running: `npm run dev`
2. Open the application in a modern browser (e.g., Chrome).
3. Maximize the window.

## Workflow

### 1. Introduction (Dashboard)
- **Action**: Start on the `/dashboard` page.
- **Talking Track**: "Welcome to MARGVEDHA. Unlike standard SCA tools that just list vulnerabilities, we map exactly how risk propagates through your supply chain. Here we've loaded a workspace containing 3 projects. You can instantly see our risk exposure and which findings have available fixes."

### 2. Explainable Graph (Graph Explorer)
- **Action**: Click "Dependency Graph" in the sidebar.
- **Action**: Pan and zoom the Cytoscape graph to show the interconnected nodes.
- **Action**: Click the orange warning node for `qs@6.11.0` (or `lodash`).
- **Talking Track**: "If we look at our dependency tree, the green diamonds are our root projects. The red triangles are known vulnerabilities. Notice how the vulnerability connects back through multiple packages to reach our `frontend-app`. We don't just say you're vulnerable; we show you the exact transitive path."

### 3. Evidence and Risk (Vulnerabilities Table)
- **Action**: Click "Vulnerabilities" in the sidebar.
- **Talking Track**: "In our findings view, we rank risk not just by CVSS, but by exploit evidence like the CISA KEV catalog and EPSS probabilities. Crucially, we label the *Evidence State*. An advisory match in a Python `requirements.txt` is different from a verified path in a locked npm tree. We make that uncertainty explicit."

### 4. Remediation Planner (The Differentiator)
- **Action**: Click "Remediation Planner" in the sidebar.
- **Talking Track**: "This is our core innovation. Developers don't just need a list of problems; they need a patch order. Here, we suggest candidate upgrades ranked by the risk they reduce. If we simulate upgrading `lodash`..."
- **Action**: Point to the Simulation panel.
- **Talking Track**: "...we can see exactly how the graph would change, resolving findings across multiple projects simultaneously, before we ever touch a package manager."

### 5. Multi-Project Analysis
- **Action**: Click "Multi-Project" in the sidebar.
- **Talking Track**: "Because MARGVEDHA supports batch analysis, we can identify shared vulnerable dependencies like `lodash` that affect multiple repositories in your portfolio, allowing you to prioritize the highest-impact organizational fixes first."

### 6. Conclusion
- **Talking Track**: "In summary, MARGVEDHA makes supply chain risk visual, explainable, and actionable."

## Fallback Plan
If the development server fails to start during the demo, open the `docs/` folder to present the `architecture.md` and `api-contract.md` to demonstrate the rigorous technical design and separation of concerns that went into the prototype.
