import { create } from 'zustand';
import { demoScanResult } from '../fixtures/demoData';

interface AppState {
  scanResult: any;
  setScanResult: (result: any) => void;
  isDemoMode: boolean;
  setIsDemoMode: (isDemo: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  scanResult: demoScanResult,
  setScanResult: (result) => set({ scanResult: result, isDemoMode: false }),
  isDemoMode: true,
  setIsDemoMode: (isDemo) => set({ isDemoMode: isDemo }),
}));
