import { NavLink, Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Network, 
  ShieldAlert, 
  Wrench, 
  Layers, 
  Settings,
  Activity,
  Clock,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { cn } from '../../utils/classnames';

const navItems = [
  { path: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { path: '/perimeter', label: 'Perimeter (Fleet)', icon: ShieldCheck },
  { path: '/import', label: 'New Analysis', icon: Activity },
  { path: '/graph', label: 'Dependency Graph', icon: Network },
  { path: '/vulnerabilities', label: 'Vulnerabilities', icon: ShieldAlert },
  { path: '/remediation', label: 'Remediation Planner', icon: Wrench },
  { path: '/multi-project', label: 'Multi-Project', icon: Layers },
  { path: '/history', label: 'Scan History', icon: Clock },
  { path: '/settings', label: 'Settings', icon: Settings },
];

import { useAppStore } from '../../store';

export default function Sidebar() {
  const { isDemoMode, user, scanCount, userPlan } = useAppStore();
  return (
    <aside className="w-64 bg-surface border-r border-border flex flex-col">
      <div className="h-16 flex items-center px-6 border-b border-border">
        <div className="flex items-center w-full">
          <img src="/MargVedha_Logo.png" alt="MARGVEDHA Logo" className="w-full h-auto max-h-12 object-contain" />
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="px-3 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                isActive 
                  ? "bg-primary/10 text-primary" 
                  : "text-text-muted hover:bg-surface-hover hover:text-text"
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* 30-Day Free Trial Card matching GitGuardian */}
        <div className="px-3 pt-4">
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-primary/30 rounded-xl p-3 text-xs space-y-2 shadow-lg">
            <div className="flex items-center gap-1.5 font-bold text-white">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Get a 30-day free trial</span>
            </div>
            <p className="text-[11px] text-text-muted leading-tight">
              Try all fleet perimeter & Guard0 agentic features to improve developer security.
            </p>
            <Link
              to="/perimeter"
              className="block text-center py-1.5 px-2 rounded-lg bg-primary hover:bg-primary-hover text-white text-[11px] font-bold transition-colors shadow-sm shadow-primary/30"
            >
              Start trial (₹199 / mo)
            </Link>
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-border">
        {user ? (
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between px-3 py-2">
              <div className="flex items-center gap-2 overflow-hidden">
                <img src={user.photoURL || `https://ui-avatars.com/api/?name=${user.email}`} alt="Avatar" className="w-8 h-8 rounded-full shrink-0" />
                <div className="flex flex-col overflow-hidden">
                  <span className="text-sm font-semibold truncate text-slate-900">{user.displayName || user.email}</span>
                  <span className="text-[10px] font-bold text-primary">
                    {user?.email === 'ap8548328@gmail.com' 
                      ? '👑 Enterprise Superuser' 
                      : userPlan === 'fleet' 
                        ? 'Fleet Plan Active' 
                        : userPlan === 'pro' 
                          ? 'Pro Plan Active' 
                          : 'Community Free Tier'}
                  </span>
                </div>
              </div>
              <button 
                onClick={async () => {
                  const { auth } = await import('../../firebase');
                  await auth.signOut();
                  useAppStore.getState().setUser(null);
                  window.location.href = '/';
                }}
                className="text-slate-400 hover:text-red-500 transition-colors p-1"
                title="Log Out"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
              </button>
            </div>
            <div className="px-3 pb-2">
              {user?.email === 'ap8548328@gmail.com' || userPlan !== 'free' ? (
                <div className="flex items-center justify-between text-xs py-1 px-2 rounded-lg bg-emerald-50 text-emerald-800 font-bold border border-emerald-200">
                  <span>Full Access Status</span>
                  <span>Unlimited</span>
                </div>
              ) : (
                <>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-medium text-slate-600">Free Scans</span>
                    <span className="font-bold text-primary">{Math.max(0, 10 - scanCount)}/10</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-1.5">
                    <div className="bg-primary h-1.5 rounded-full" style={{ width: `${Math.min(100, (scanCount / 10) * 100)}%` }}></div>
                  </div>
                </>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3 px-3 py-2 rounded-md bg-surface-hover/50 border border-border">
            <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <div className="flex flex-col">
              <span className="text-xs font-medium text-text">System Status</span>
              <span className="text-[10px] text-text-muted">{isDemoMode ? 'Demo Mode Active' : 'Live Data Active'}</span>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
