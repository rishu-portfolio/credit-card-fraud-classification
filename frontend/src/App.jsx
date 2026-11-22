import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { Dashboard } from './pages/Dashboard';
import { FraudPrediction } from './pages/FraudPrediction';
import { BatchAnalysis } from './pages/BatchAnalysis';
import { ModelPerformance } from './pages/ModelPerformance';
import { AboutProject } from './pages/AboutProject';
import { api } from './services/api';

export function App() {
  const [activePage, setActivePage] = useState('dashboard');
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [backendStatus, setBackendStatus] = useState({ online: false, checking: true, error: null });

  const checkBackend = async () => {
    try {
      const res = await api.checkHealth();
      setBackendStatus({ online: res?.status === 'healthy', checking: false, error: null });
    } catch (err) {
      setBackendStatus({ online: false, checking: false, error: err.message });
    }
  };

  useEffect(() => {
    checkBackend();
    // Periodic health check every 30 seconds
    const interval = setInterval(checkBackend, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-navy-950 text-slate-800 dark:text-slate-100 flex">
      {/* Sidebar Navigation */}
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
        backendStatus={backendStatus}
      />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-72 flex flex-col min-w-0">
        <Navbar
          activePage={activePage}
          setIsMobileOpen={setIsMobileOpen}
          backendStatus={backendStatus}
          onRefreshStatus={checkBackend}
        />

        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          {activePage === 'dashboard' && <Dashboard setActivePage={setActivePage} />}
          {activePage === 'predict' && <FraudPrediction />}
          {activePage === 'batch' && <BatchAnalysis />}
          {activePage === 'performance' && <ModelPerformance />}
          {activePage === 'about' && <AboutProject />}
        </main>
      </div>
    </div>
  );
}

export default App;
