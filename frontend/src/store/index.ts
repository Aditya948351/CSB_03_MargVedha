import { create } from 'zustand';
import { demoScanResult } from '../fixtures/demoData';

interface AppState {
  scanResult: any;
  setScanResult: (result: any) => void;
  isDemoMode: boolean;
  setIsDemoMode: (isDemo: boolean) => void;
  user: any | null;
  setUser: (user: any | null) => void;
  scanCount: number;
  setScanCount: (count: number) => void;
}

export const useAppStore = create<AppState>((set) => ({
  scanResult: demoScanResult,
  setScanResult: (result) => set({ scanResult: result, isDemoMode: false }),
  isDemoMode: true,
  setIsDemoMode: (isDemo) => set({ isDemoMode: isDemo }),
  user: null,
  setUser: (user) => set({ user }),
  scanCount: 0,
  setScanCount: (count) => set({ scanCount: count }),
}));
