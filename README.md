<div align="center">
  <img src="MargVedha_Logo.png" alt="MARGVEDHA Logo" width="600" />

  <h1>MARGVEDHA</h1>
  
  <p><strong>M</strong>apping <strong>A</strong>nd <strong>R</strong>isk <strong>G</strong>raph for <strong>V</strong>ulnerability <strong>E</strong>valuation, <strong>D</strong>etection & <strong>H</strong>ardening <strong>A</strong>pplications</p>

  <p><em>Trace the Risk. Secure the Path.</em></p>

  <p>
    <a href="https://reactjs.org/"><img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" /></a>
    <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" /></a>
    <a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" /></a>
    <a href="https://js.cytoscape.org/"><img src="https://img.shields.io/badge/Cytoscape.js-000000?style=for-the-badge&logo=javascript&logoColor=white" alt="Cytoscape.js" /></a>
  </p>
</div>

<hr />

## 🛡️ The Problem

A single vulnerable open-source dependency can silently compromise thousands of downstream applications. Security teams constantly struggle to visualize how a newly disclosed CVE propagates through their intricate dependency trees, leading to alert fatigue and inefficient patch management. 

*(Addressing CISA Problem Statement: CSB-03 — Supply-Chain Vulnerability Propagation Graph)*

## 💡 The Solution

**MARGVEDHA** is a premium, interactive software supply-chain security platform. Unlike traditional SCA scanners that merely dump lists of vulnerable packages, MARGVEDHA transforms raw dependency and advisory data into an **explainable, interactive, and evidence-based security investigation experience**. 

We empower developers to not only see *what* is vulnerable, but exactly *how* it's connected, and *what* will happen if they fix it.

---

## ✨ Key Capabilities

### 🔍 Explainable Propagation Graphs
Ditch the flat tables. Explore a fully interactive dependency graph powered by Cytoscape.js. Trace the exact transitive path from your root project down to a vulnerable sub-dependency. 

### ⚖️ Evidence-Tiered Risk Scoring
Not all vulnerabilities pose the same threat. We prioritize findings using an evidence-based risk heuristic combining **CVSS Severity**, **CISA KEV (Known Exploited Vulnerabilities)** membership, **EPSS** probabilities, and dependency topology (direct vs. transitive). 

### 🛠️ Interactive Remediation Planner
Answer the critical question: *"What should I fix first?"* 
Select candidate dependency upgrades and instantly run a **simulated before-and-after graph comparison**. See exactly how many findings will be resolved and which projects will be impacted—before ever touching a package manager.

### 🏢 Multi-Project Shared Risk Analysis
Upload your entire workspace and visualize overlapping risks. Identify the high-leverage "choke points"—single vulnerable dependencies that are shared across multiple codebases—to maximize your remediation ROI.

---

## 🏗️ Architecture

MARGVEDHA is built with a resilient, two-layer architecture, separating the interactive UI from the core scanning logic. 

**Layer A (Demonstration Experience - Current):** 
A high-performance React frontend utilizing Vite and Tailwind CSS v4 to deliver a dark-themed, premium cybersecurity aesthetic. It currently runs deterministically using mock JSON fixtures to guarantee a reliable, offline-capable demonstration.

**Layer B (Analysis Foundation - Planned Backend):**
A Python/FastAPI service designed to orchestrate ecosystem lockfile parsing, NetworkX graph traversal, and batch queries to the live OSV.dev vulnerability intelligence API.

*Read more in our [Architecture Documentation](docs/architecture.md) and [API Contracts](docs/api-contract.md).*

---

## 🚀 Getting Started (Demo Mode)

The application currently boots into an offline-ready **Demo Mode**. This pre-loads a deterministic workspace (containing 3 projects, a shared vulnerability, and simulated OSV findings) so you can evaluate the entire triage workflow immediately.

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- npm (v9 or higher)

### Installation

```bash
# Clone the repository
git clone https://github.com/Aditya948351/CSB_03_MargVedha.git
cd CSB_03_MargVedha/frontend

# Install dependencies
npm install

# Start the local development server
npm run dev
```

Navigate to `http://localhost:5173` to explore the MARGVEDHA dashboard.

---

## 📚 Documentation

For a deeper dive into the system design, algorithms, and technical decisions behind MARGVEDHA, please review the provided documentation:

- [Architecture & System Design](docs/architecture.md)
- [Prototype Limitations & Roadmap](docs/prototype-limitations.md)
- [REST API Contracts](docs/api-contract.md)
- [Judge Demonstration Script](docs/demo-script.md)

---

<div align="center">
  <sub>Built for the CISA Supply-Chain Vulnerability Propagation Challenge</sub>
</div>
