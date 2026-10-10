import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { demoScanResult } from '../fixtures/demoData';

export type UserPlan = 'free' | 'pro' | 'fleet';

export interface UserRepo {
  id: string;
  name: string;
  fullName: string;
  status: 'Monitored' | 'Unreachable';
  monitoringActive: boolean;
  openIncidents: number;
  criticals: number;
  honeytoken: string;
  agenticStatus: string;
  lastScan: string;
  duration: string;
  defaultBranch: string;
  ecosystem: 'npm' | 'PyPI' | 'polyglot';
}

const ENTERPRISE_DEFAULT_REPOS: UserRepo[] = [
  {
    id: 'repo-1',
    name: 'MargVedhaMain',
    fullName: 'Aditya948351/MargVedhaMain',
    status: 'Monitored',
    monitoringActive: true,
    openIncidents: 8,
    criticals: 3,
    honeytoken: 'Active',
    agenticStatus: 'Protected',
    lastScan: 'Just now',
    duration: '1s',
    defaultBranch: 'main',
    ecosystem: 'polyglot'
  },
  {
    id: 'repo-2',
    name: 'DRISHTI',
    fullName: 'Aditya948351/DRISHTI',
    status: 'Monitored',
    monitoringActive: true,
    openIncidents: 5,
    criticals: 2,
    honeytoken: '-',
    agenticStatus: 'Audited',
    lastScan: '1 min ago',
    duration: '2s',
    defaultBranch: 'master',
    ecosystem: 'PyPI'
  },
  {
    id: 'repo-3',
    name: 'sahidawa-india',
    fullName: 'Aditya948351/sahidawa-india',
    status: 'Monitored',
    monitoringActive: true,
    openIncidents: 3,
    criticals: 1,
    honeytoken: '-',
    agenticStatus: 'Protected',
    lastScan: '3 mins ago',
    duration: '1s',
    defaultBranch: 'main',
    ecosystem: 'npm'
  },
  {
    id: 'repo-4',
    name: 'CSB_03_MargVedha',
    fullName: 'Aditya948351/CSB_03_MargVedha',
    status: 'Monitored',
    monitoringActive: true,
    openIncidents: 0,
    criticals: 0,
    honeytoken: 'CycloneDX 1.6',
    agenticStatus: 'Guard0 Passed',
    lastScan: 'Just now',
    duration: '3s',
    defaultBranch: 'main',
    ecosystem: 'polyglot'
  }
];

export const EMPTY_SCAN_RESULT = {
  scan_id: '',
  source_name: 'No Projects Analyzed',
  uploaded_at: new Date().toISOString(),
  projects: [],
  findings: [],
  graph: { nodes: [], edges: [] }
};

interface AppState {
  scanResult: any;
  setScanResult: (result: any) => void;
  isDemoMode: boolean;
  setIsDemoMode: (isDemo: boolean) => void;
  loadDemoWorkspace: () => void;
  clearDemoWorkspace: () => void;
  githubUser: { username: string; avatarUrl?: string; token?: string } | null;
  setGithubUser: (gh: { username: string; avatarUrl?: string; token?: string } | null) => void;
  liveScanningEnabled: boolean;
  setLiveScanningEnabled: (enabled: boolean) => void;
  user: any | null;
  setUser: (user: any | null) => void;
  authLoading: boolean;
  setAuthLoading: (loading: boolean) => void;
  scanCount: number;
  setScanCount: (count: number) => void;
  userPlan: UserPlan;
  setUserPlan: (plan: UserPlan) => void;
  userRepos: UserRepo[];
  setUserRepos: (repos: UserRepo[]) => void;
  addUserRepo: (repoFullName: string, ecosystem?: 'npm' | 'PyPI' | 'polyglot') => { success: boolean; message: string };
  removeUserRepo: (repoId: string) => void;
  toggleRepoMonitoring: (repoId: string) => void;
  toggleAllRepoMonitoring: () => void;
  isSuperAdmin: () => boolean;
  hasAccessToFeature: (featureLevel: 'free' | 'pro' | 'fleet') => boolean;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      scanResult: EMPTY_SCAN_RESULT,
      setScanResult: (result) => set({ scanResult: result, isDemoMode: false }),
      isDemoMode: false,
      setIsDemoMode: (isDemo) => set({ isDemoMode: isDemo }),
      loadDemoWorkspace: () => set({ scanResult: demoScanResult, isDemoMode: true }),
      clearDemoWorkspace: () => set({ scanResult: EMPTY_SCAN_RESULT, isDemoMode: false }),
      githubUser: null,
      setGithubUser: (gh) => set({ githubUser: gh }),
      liveScanningEnabled: true,
      setLiveScanningEnabled: (enabled) => set({ liveScanningEnabled: enabled }),
      user: null,
      authLoading: true,
      setAuthLoading: (loading) => set({ authLoading: loading }),
      setUser: (user) => {
        const isOwner = user?.email === 'ap8548328@gmail.com';
        set({ 
          user,
          authLoading: false,
          userPlan: isOwner ? 'fleet' : (get().userPlan || 'free'),
          userRepos: get().userRepos || [],
          scanResult: get().scanResult || EMPTY_SCAN_RESULT,
          isDemoMode: get().isDemoMode,
          githubUser: user ? get().githubUser : null
        });
      },
      scanCount: 0,
      setScanCount: (count) => set({ scanCount: count }),
      userPlan: 'free',
      setUserPlan: (plan) => set({ userPlan: plan }),
      userRepos: [],
      setUserRepos: (repos) => set({ userRepos: repos }),
      addUserRepo: (repoFullName, ecosystem = 'polyglot') => {
        const cleanName = repoFullName.trim().replace(/^https?:\/\/github\.com\//, '').replace(/\.git$/, '');
        if (!cleanName || !cleanName.includes('/')) {
          return { success: false, message: 'Invalid repository format. Please use "owner/repository" or GitHub URL.' };
        }

        const { user, userPlan, userRepos } = get();
        const isOwner = user?.email === 'ap8548328@gmail.com';
        const limit = isOwner || userPlan === 'fleet' ? 9999 : (userPlan === 'pro' ? 10 : 1);

        if (userRepos.length >= limit) {
          return { 
            success: false, 
            message: `Plan limit reached (${limit} repo maximum on ${userPlan.toUpperCase()} tier). Upgrade to add more repositories.` 
          };
        }

        if (userRepos.some(r => r.fullName.toLowerCase() === cleanName.toLowerCase())) {
          return { success: false, message: 'Repository is already added to your monitored sources.' };
        }

        const shortName = cleanName.split('/')[1] || cleanName;
        const newRepo: UserRepo = {
          id: `repo-${Date.now()}`,
          name: shortName,
          fullName: cleanName,
          status: 'Monitored',
          monitoringActive: true,
          openIncidents: 0,
          criticals: 0,
          honeytoken: '-',
          agenticStatus: 'Standard Scan',
          lastScan: 'Just now',
          duration: '1s',
          defaultBranch: 'main',
          ecosystem: ecosystem
        };

        set({ userRepos: [newRepo, ...userRepos] });
        return { success: true, message: `Successfully added ${cleanName} to your monitored sources.` };
      },
      removeUserRepo: (repoId) => {
        set(state => ({ userRepos: state.userRepos.filter(r => r.id !== repoId) }));
      },
      toggleRepoMonitoring: (repoId) => {
        set(state => ({
          userRepos: state.userRepos.map(r => r.id === repoId ? {
            ...r,
            monitoringActive: !r.monitoringActive,
            status: !r.monitoringActive ? 'Monitored' : 'Unreachable'
          } : r)
        }));
      },
      toggleAllRepoMonitoring: () => {
        const repos = get().userRepos;
        const anyActive = repos.some(r => r.monitoringActive);
        set({
          userRepos: repos.map(r => ({
            ...r,
            monitoringActive: !anyActive,
            status: !anyActive ? 'Monitored' : 'Unreachable'
          }))
        });
      },
      isSuperAdmin: () => {
        const user = get().user;
        return user?.email === 'ap8548328@gmail.com';
      },
      hasAccessToFeature: (featureLevel) => {
        const { user, userPlan } = get();
        if (user?.email === 'ap8548328@gmail.com') return true;
        if (userPlan === 'fleet') return true;
        if (userPlan === 'pro' && (featureLevel === 'pro' || featureLevel === 'free')) return true;
        return featureLevel === 'free';
      }
    }),
    {
      name: 'margvedha-storage',
      partialize: (state) => ({ 
        githubUser: state.githubUser, 
        userRepos: state.userRepos,
        userPlan: state.userPlan,
        scanCount: state.scanCount,
        liveScanningEnabled: state.liveScanningEnabled
      }),
    }
  )
);

