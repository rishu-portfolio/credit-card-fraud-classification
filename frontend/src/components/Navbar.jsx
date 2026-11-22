import React from 'react';
import { Menu, Sun, Moon, Database, Activity, RefreshCw, Download } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { api } from '../services/api';

const PAGE_TITLES = {
  dashboard: { title: 'Executive Overview', desc: 'Real-time financial transaction monitoring & ML metrics' },
  predict: { title: 'Live Fraud Prediction', desc: 'Single-transaction scoring with explainable AI feature impact' },
  batch: { title: 'CSV Batch Processing', desc: 'High-throughput file analysis and bulk fraud classification' },
  performance: { title: 'Model Evaluation & Benchmarking', desc: 'ROC-AUC, Precision-Recall, and algorithm comparison' },
  about: { title: 'Project Documentation', desc: 'Final-year B.Tech CSE thesis background, architecture & scope' },
};

export function Navbar({ activePage, setIsMobileOpen, backendStatus, onRefreshStatus }) {
  const { theme, toggleTheme } = useTheme();
  const current = PAGE_TITLES[activePage] || { title: 'Dashboard', desc: '' };

  return (
    <header className="sticky top-0 z-30 h-20 bg-white/80 dark:bg-navy-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 sm:px-8 flex items-center justify-between">
      {/* Left: Mobile trigger & Page titles */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setIsMobileOpen(true)}
          className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none"
          aria-label="Toggle Navigation"
        >
          <Menu className="w-6 h-6" />
        </button>

        <div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            {current.title}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
            {current.desc}
          </p>
        </div>
      </div>

      {/* Right: Actions & Theme Toggle */}
      <div className="flex items-center gap-3">
        {/* Backend Connectivity Status Pill */}
        <div 
          onClick={onRefreshStatus}
          title="Click to re-check API connection"
          className="cursor-pointer hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 text-slate-700 dark:text-slate-300 hover:border-brand-500 transition-colors"
        >
          <span className={`w-2 h-2 rounded-full ${backendStatus.online ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
          <span>{backendStatus.online ? 'API Online' : 'API Offline'}</span>
          <RefreshCw className="w-3 h-3 text-slate-400 hover:rotate-180 transition-transform duration-300" />
        </div>

        {/* Sample CSV Download Link */}
        <a
          href={api.getSampleCsvUrl()}
          download="credit_card_transactions_sample.csv"
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-brand-50 dark:bg-brand-950/40 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800/60 hover:bg-brand-100 dark:hover:bg-brand-900/40 transition-colors"
          title="Download official sample transactions CSV for batch testing"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Sample CSV</span>
        </a>

        {/* Dark/Light Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition-all duration-200"
          aria-label="Toggle color theme"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
          {theme === 'dark' ? (
            <Sun className="w-5 h-5 text-amber-400" />
          ) : (
            <Moon className="w-5 h-5 text-slate-600" />
          )}
        </button>
      </div>
    </header>
  );
}
