# API Contract

The following outlines the REST API endpoints the React frontend expects the future Python/FastAPI backend to implement.

## Endpoints

### 1. Upload Project Archive
`POST /api/v1/scan`

Uploads a ZIP archive for analysis.

**Request:**
`multipart/form-data`
- `file`: The ZIP archive containing project manifests/lockfiles.
- `project_name` (optional): Override the inferred project name.

**Response (202 Accepted):**
```json
{
  "scan_id": "uuid-1234",
  "status": "processing"
}
```

### 2. Get Scan Status/Results
`GET /api/v1/scan/{scan_id}`

Retrieves the full results of a scan.

**Response (200 OK):**
```json
{
  "scan_id": "uuid-1234",
  "status": "completed",
  "uploaded_at": "2026-10-09T10:00:00Z",
  "projects": [
    {
      "id": "proj:frontend",
      "name": "frontend",
      "source_file": "package.json",
      "lockfile": "package-lock.json",
      "ecosystem": "npm",
      "dependency_count": 142
    }
  ],
  "graph": {
    "nodes": [ ... ],
    "edges": [ ... ]
  },
  "findings": [ ... ]
}
```

### 3. Simulate Upgrade
`POST /api/v1/scan/{scan_id}/simulate`

Simulates the impact of a proposed dependency upgrade on the graph.

**Request:**
```json
{
  "upgrades": [
    {
      "package": "lodash",
      "target_version": "4.17.21"
    }
  ]
}
```

**Response (200 OK):**
```json
{
  "before_graph": { ... },
  "after_graph": { ... },
  "resolved_findings": ["finding-123"],
  "new_findings": []
}
```

## Data Schema Core Types

See the frontend `src/types/index.ts` for the complete TypeScript representation of the `Finding`, `Project`, and `RiskBreakdown` schemas used by these endpoints.
