import React from 'react';
import { 
  LayoutDashboard, 
  ShieldCheck, 
  FileSpreadsheet, 
  BarChart3, 
  GraduationCap, 
  Activity, 
  Cpu, 
  ShieldAlert,
  ChevronRight,
  ExternalLink
} from 'lucide-react';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: null },
  { id: 'predict', label: 'Fraud Prediction', icon: ShieldAlert, badge: 'Real-time' },
  { id: 'batch', label: 'CSV File Analysis', icon: FileSpreadsheet, badge: 'Batch' },
  { id: 'performance', label: 'Model Performance', icon: BarChart3, badge: 'Metrics' },
  { id: 'about', label: 'About Project', icon: GraduationCap, badge: 'CSE' },
];

export function Sidebar({ activePage, setActivePage, isMobileOpen, setIsMobileOpen, backendStatus }) {
  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed top-0 bottom-0 left-0 z-50 w-72 bg-white dark:bg-navy-900 border-r border-slate-200 dark:border-slate-800
        flex flex-col transition-transform duration-300 ease-in-out
        lg:translate-x-0 ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Logo Header */}
        <div className="h-20 px-6 flex items-center gap-3 border-b border-slate-100 dark:border-slate-800/80">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-brand-600 to-teal-400 flex items-center justify-center text-white shadow-lg shadow-brand-500/25">
            <ShieldCheck className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-slate-900 via-brand-700 to-teal-600 dark:from-white dark:via-slate-100 dark:to-brand-400 bg-clip-text text-transparent">
                FraudShield AI
              </span>
            </div>
            <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
              Financial ML Classification
            </p>
          </div>
        </div>

        {/* Model Badge */}
        <div className="px-4 py-3 m-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/50">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-300">
            <span className="flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-brand-500" />
              Active ML Engine
            </span>
            <span className="px-1.5 py-0.5 rounded text-[10px] bg-brand-500/10 text-brand-600 dark:text-brand-400 font-mono">
              v1.0
            </span>
          </div>
          <div className="mt-1 font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            Random Forest
            <span className="text-[11px] font-normal text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded">
              99.94% Acc
            </span>
          </div>
        </div>

        {/* Navigation List */}
        <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto">
          <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Analytics & Operations
          </div>
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActivePage(item.id);
                  setIsMobileOpen(false);
                }}
                className={`
                  w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-medium transition-all duration-150
                  ${isActive 
                    ? 'bg-brand-600 text-white shadow-md shadow-brand-600/25 dark:shadow-none' 
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'}
                `}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`
                    text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full
                    ${isActive 
                      ? 'bg-white/20 text-white' 
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'}
                  `}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* System Health Status Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-navy-950/40">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                  backendStatus.online ? 'bg-emerald-400' : 'bg-rose-400'
                }`} />
                <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                  backendStatus.online ? 'bg-emerald-500' : 'bg-rose-500'
                }`} />
              </span>
              <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                {backendStatus.online ? 'Backend API Online' : 'Backend Disconnected'}
              </span>
            </div>
            <span className="text-[10px] font-mono text-slate-400">
              PORT: 5000
            </span>
          </div>
          <p className="mt-2 text-[11px] text-slate-400 dark:text-slate-500">
            B.Tech CSE Capstone Project &copy; 2026
          </p>
        </div>
      </aside>
    </>
  );
}
