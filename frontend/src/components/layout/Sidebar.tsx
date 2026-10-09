import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Network, 
  ShieldAlert, 
  Wrench, 
  Layers, 
  Settings,
  Activity
} from 'lucide-react';
import { cn } from '../../utils/classnames';

const navItems = [
  { path: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { path: '/import', label: 'New Analysis', icon: Activity },
  { path: '/graph', label: 'Dependency Graph', icon: Network },
  { path: '/vulnerabilities', label: 'Vulnerabilities', icon: ShieldAlert },
  { path: '/remediation', label: 'Remediation Planner', icon: Wrench },
  { path: '/multi-project', label: 'Multi-Project', icon: Layers },
  { path: '/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar() {
  return (
    <aside className="w-64 bg-surface border-r border-border flex flex-col">
      <div className="h-16 flex items-center px-6 border-b border-border">
        <div className="flex items-center gap-2 text-primary font-bold text-xl tracking-wide">
          <Network className="w-6 h-6" />
          <span>MARGVEDHA</span>
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
      </div>

      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-3 px-3 py-2 rounded-md bg-surface-hover/50 border border-border">
          <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
          <div className="flex flex-col">
            <span className="text-xs font-medium text-text">System Status</span>
            <span className="text-[10px] text-text-muted">Demo Mode Active</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
