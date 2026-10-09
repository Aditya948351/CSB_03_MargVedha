import { Bell, Search, User } from 'lucide-react';

export default function TopBar() {
  return (
    <header className="h-16 bg-surface border-b border-border flex items-center justify-between px-6 shrink-0">
      <div className="flex items-center flex-1">
        <div className="relative w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-text-muted" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-border rounded-md leading-5 bg-background text-text placeholder-text-muted focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm"
            placeholder="Search packages, CVEs, or projects..."
          />
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <button className="p-2 text-text-muted hover:text-text rounded-full hover:bg-surface-hover transition-colors relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-danger"></span>
        </button>
        <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30 text-primary">
          <User className="h-5 w-5" />
        </div>
      </div>
    </header>
  );
}
