import { create } from 'zustand';
import { Platform } from 'react-native';

const API_BASE = 'https://csb-03-margvedha.onrender.com/api/v1';

export interface Finding {
  id: string;
  package: string;
  version: string;
  severity: number;
  aliases: string[];
  affected_projects: string[];
  evidence_state: string;
  risk: any;
}

export interface AppState {
  findings: Finding[];
  projects: any[];
  lastScanTime: string | null;
  isLoading: boolean;
  error: string | null;
  fetchDashboardData: () => Promise<void>;
  markAsResolved: (id: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  findings: [],
  projects: [],
  lastScanTime: null,
  isLoading: false,
  error: null,
  
  fetchDashboardData: async () => {
    set({ isLoading: true, error: null });
    try {
      // In a real app we'd fetch this from the backend. Since the current backend
      // only returns data after a POST to /analyze, and doesn't persist to a GET endpoint
      // (other than what we push to Firebase), we will mock some data here for demo
      // based on the CISA problem statement.
      setTimeout(() => {
        set({
          findings: [
            {
              id: 'CVE-2021-23337',
              package: 'lodash',
              version: '4.17.19',
              severity: 9.8,
              aliases: ['GHSA-p6mc-m468-83gw'],
              affected_projects: ['frontend-monorepo', 'auth-service'],
              evidence_state: 'Found in transitive dependencies',
              risk: { total_score: 9.8 }
            },
            {
              id: 'CVE-2022-21824',
              package: 'console.table',
              version: '0.1.0',
              severity: 7.5,
              aliases: ['GHSA-5rrq-pxf6-6jx5'],
              affected_projects: ['auth-service'],
              evidence_state: 'Found in direct dependencies',
              risk: { total_score: 7.5 }
            }
          ],
          projects: [
            { name: 'frontend-monorepo', status: 'monitored', finding_count: 1 },
            { name: 'auth-service', status: 'monitored', finding_count: 2 },
          ],
          lastScanTime: new Date().toISOString(),
          isLoading: false
        });
      }, 1000);
    } catch (e: any) {
      set({ error: e.message, isLoading: false });
    }
  },

  markAsResolved: (id: string) => {
    set((state) => ({
      findings: state.findings.filter(f => f.id !== id)
    }));
  }
}));
