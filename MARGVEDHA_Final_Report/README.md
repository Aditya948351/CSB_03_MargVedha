# MARGVEDHA Final Technical Report (LaTeX Master Dossier)

This folder contains the complete, publication-grade LaTeX report for **MARGVEDHA** (*Mapping And Risk Graph for Vulnerability Evaluation, Detection & Hardening Applications*), engineered in full compliance with Problem Statement **CSB-03: Supply-Chain Vulnerability Propagation Graph** (CISA Security Track).

---

## 📁 Folder Contents

- `main.tex`: Master LaTeX document incorporating all 11 comprehensive chapters, Title page, Copyright & Scope Disclaimer, Table of Contents, List of Figures, List of Tables, Glossary, Algorithms, Tables, and BibTeX citations.
- `references.bib`: Verified BibTeX bibliography file containing peer-reviewed academic papers (IEEE, USENIX, ACM, Springer), federal standards (CISA BOD 22-01, NIST SSDF SP 800-218), and official databases (OSV.dev, EPSS, CVSS).
- `MargVedha_Logo.png`: The official project logo embedded on the cover/first page.
- `README.md`: Compilation guide and documentation summary.

---

## 📋 Fulfilled Requirements

1. **Title / First Page Standards:**
   - **MargVedha Logo** properly placed and scaled (`\includegraphics[width=4.5cm]{MargVedha_Logo.png}`).
   - **Full Form displayed prominently:** *Mapping And Risk Graph for Vulnerability Evaluation, Detection & Hardening Applications*.
   - **Tagline:** *Trace the Risk. Secure the Path.*
   - **Problem Statement ID:** CSB-03 (CISA Supply-Chain Security Track).
   - **Formal Copyright Notice:** © 2026 MARGVEDHA Project Consortium. All Rights Reserved.

2. **Index & Pagination Structure:**
   - Comprehensive **Table of Contents**, **List of Figures**, **List of Tables**, and **Glossary of Technical Terms**.
   - **Main index terms (Chapters) on separate pages:** Each major chapter automatically begins on a new page via `\chapter{...}`.
   - **Sub-indexes / sections on the same page:** All `\section`, `\subsection`, and `\subsubsection` elements flow naturally within their respective chapters.
   - **Page Budget:** Rigorously calibrated to remain within the **30 pages max** ceiling when compiled with standard 1-inch margins.

3. **Core Topics Synthesized from Both Research PDFs:**
   - **Foundations & Glossary:** SCA, SBOM, PURL, CVE, CWE, CVSS, EPSS, KEV, DAGs.
   - **The Five Evidence States Framework:** Semantic distinction between `ADVISORY_MATCH`, `PROJECT_CONTAINS`, `PATH_REACHABLE`, `CODE_REACHABLE`, and `EXPLOITABLE`.
   - **Current System Review & Competitive Analysis:** Detailed comparison matrix against OSV-Scanner, Snyk, Dependabot, Dependency-Track, and Trivy.
   - **Feasibility Analysis:** Technical, Operational, Computational ($O(V+E)$ BFS bounds), Data, and Economic feasibility.
   - **System Architecture & DAG Schema:** Multi-project NetworkX graph traversal, reverse reachability algorithm, and API endpoints.
   - **Explainable Multi-Factor Risk Scoring:** CVSS base + CISA KEV (1.3×) + Degree Centrality + Multi-Project Shared Dependency clustering.
   - **Automated Remediation & Fix Simulation:** Candidate upgrades, before/after graph mutation, and Sarvam AI patch generation.
   - **Empirical Benchmarks & Real-World Case Studies:** Lodash (CVE-2021-23337), QS (CVE-2022-24999), and Jinja2 (CVE-2024-22195).
   - **Enterprise, Societal & Sovereign Cyber Defense Impact:** Protection of Indian software supply chains and mitigation of developer alert fatigue.
   - **Ethical & Technical Limitations:** Non-runtime exploitability guarantee, static path vs call-graph limits, and future eBPF roadmap.

---

## 🛠️ How to Compile to PDF

### Option 1: Overleaf (Recommended - Zero Installation)
1. Zip this entire `MARGVEDHA_Final_Report` directory (containing `main.tex`, `references.bib`, and `MargVedha_Logo.png`).
2. Go to [Overleaf.com](https://www.overleaf.com/) and click **New Project** $\to$ **Upload Project**.
3. Upload the zip file.
4. Set compiler to **pdfLaTeX** (default) and click **Recompile**.

### Option 2: Local TeX Distribution (TeXLive, MiKTeX, MacTeX)
Open a terminal in `e:\SKN_Fusion_20\MARGVEDHA_Final_Report` and run:

```bash
pdflatex main.tex
bibtex main
pdflatex main.tex
pdflatex main.tex
```

*(Running pdflatex twice resolves all table of contents entries, figure numbers, and BibTeX citations.)*

### Option 3: VS Code / Tectonic
If you have VS Code with the **LaTeX Workshop** extension installed, simply open `main.tex` and press `Ctrl+Alt+B` to build.
