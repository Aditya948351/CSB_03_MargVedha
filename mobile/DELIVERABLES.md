# MARGVEDHA Mobile App Deliverables

## 1. Existing Application Inspected
- **Web Frontend**: React, Tailwind CSS, Zustand, and Cytoscape.js for dependency graph visualization. It runs on Vite. The web app is tailored for deep investigation (running scans, viewing graphs).
- **Python Backend**: FastAPI application running on port 8000. It accepts manifest uploads via `POST /api/v1/analyze`, extracts dependencies, queries OSV.dev, generates a NetworkX graph, and utilizes a Hugging Face API for remediation strategies.
- **Data Persistence**: Firebase Firestore logs high-level scan metadata.

## 2. Features Implemented & Files Created
I built a mobile companion tailored for **monitoring and quick response**. All work was done in the newly initialized `mobile/` directory using React Native (Expo).
- `mobile/src/theme.ts`: Consistent color palette matching the Web Dark Mode (Navy, Charcoal, Cyan).
- `mobile/src/store.ts`: Shared Zustand state implementation for the mobile client.
- `mobile/src/screens/HomeScreen.tsx`: Security dashboard summarizing monitored projects, risks, and recent alerts.
- `mobile/src/screens/AlertsScreen.tsx`: Alerts inbox displaying vulnerability severity and affected packages.
- `mobile/src/screens/ProjectsScreen.tsx`: List of connected repositories and their current risk status.
- `mobile/src/screens/RemediationScreen.tsx`: Track and manage mitigation actions.
- `mobile/src/navigation/TabNavigator.tsx`: Native bottom-tab routing.

## 3. Functional Workflows
- **Navigation**: Seamless bottom-tab routing between Home, Alerts, Projects, and Remediation screens.
- **Monitoring**: The Home screen correctly computes dynamic aggregates (Critical vs. High risks) based on the global state.
- **Remediation Tracking**: Users can mark an alert as "Resolved" in the Remediation screen, which instantly removes it from the global Zustand store and updates the Home screen metrics dynamically.

## 4. Backend Endpoints & Integrations
- Since the current FastAPI backend is highly specialized to run "on-demand" scans via `POST /api/v1/analyze`, the mobile app's architecture is prepared to fetch from a standard REST API via the `API_BASE` constant. 
- **Missing Backend Work Needed**: To fully power the mobile app in production, the Python backend requires new `GET` endpoints:
  - `GET /api/v1/findings` (to populate the Alerts inbox)
  - `GET /api/v1/projects` (to populate the Monitored Projects screen)
  - Firebase Cloud Messaging integration for push notifications.

## 5. Demo-only Functionality
- **Realistic Mock Data**: Since the `GET` endpoints described above don't exist yet, `src/store.ts` contains a `setTimeout` function that injects realistic `CVE-2021-23337` finding objects to flawlessly simulate the CISA CSB-03 problem statement for the judges.
- All mock data is clearly isolated in the Zustand `fetchDashboardData()` action, making the switch to the real API trivial once the backend endpoints are written.

## 6. How to Run the App
To show this app to the judges on your phone or an emulator:
1. Open a new terminal.
2. Navigate into the folder: `cd mobile`
3. Start Expo: `npm start` (or `npx expo start`)
4. Download the **Expo Go** app on your iPhone or Android and scan the QR code generated in the terminal!
