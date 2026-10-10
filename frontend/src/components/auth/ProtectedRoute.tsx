import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppStore } from '../../store';
import { Loader2, ShieldCheck } from 'lucide-react';

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, authLoading } = useAppStore();
  const location = useLocation();

  // 1. While Firebase verifies existing session on initial load
  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white space-y-4 font-sans">
        <div className="size-16 rounded-2xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 shadow-[0_0_35px_rgba(59,130,246,0.25)]">
          <ShieldCheck className="size-8 text-blue-400 animate-pulse" />
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-300 font-medium">
          <Loader2 className="size-4 animate-spin text-blue-400" />
          <span>Verifying MARGVEDHA Enterprise Session...</span>
        </div>
      </div>
    );
  }

  // 2. If user is NOT authenticated, strictly block access and redirect to login
  if (!user) {
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  // 3. User is authenticated, permit access to workspace
  return <>{children}</>;
}
