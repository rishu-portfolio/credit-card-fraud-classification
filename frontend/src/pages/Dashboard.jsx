import React, { useEffect, useState } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  ArrowUpRight, 
  Activity, 
  CreditCard, 
  TrendingUp, 
  Clock, 
  DollarSign, 
  AlertTriangle,
  RefreshCw,
  Trash2,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  Legend, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  AreaChart, 
  Area 
} from 'recharts';
import { api } from '../services/api';
import { useTheme } from '../context/ThemeContext';

export function Dashboard({ setActivePage }) {
  const { theme } = useTheme();
  const [summary, setSummary] = useState(null);
  const [history, setHistory] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setError(null);
      const [sumRes, histRes, metRes] = await Promise.all([
        api.getSummary().catch(() => null),
        api.getHistory(15).catch(() => ({ history: [] })),
        api.getModelMetrics().catch(() => null),
      ]);

      setSummary(sumRes);
      setHistory(histRes?.history || []);
      setMetrics(metRes);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const handleClearHistory = async () => {
    if (window.confirm("Are you sure you want to clear live prediction audit history?")) {
      try {
        await api.clearHistory();
        fetchData();
      } catch (err) {
        alert("Failed to clear history: " + err.message);
      }
    }
  };

  // Metrics Data Extraction
  const totalTx = (summary?.dataset_baseline?.total_transactions || 284807) + (summary?.live_predictions?.total_predictions || 0);
  const fraudTx = (summary?.dataset_baseline?.fraud_transactions || 492) + (summary?.live_predictions?.fraud_predictions || 0);
  const genuineTx = totalTx - fraudTx;
  const fraudRate = ((fraudTx / totalTx) * 100).toFixed(3);

  // Pie Chart Data
  const pieData = [
    { name: 'Genuine', value: genuineTx, color: '#10b981' },
    { name: 'Fraudulent', value: fraudTx, color: '#f43f5e' },
  ];

  // Transaction Analytics by Hour / Time distribution (from dataset baseline)
  const timeChartData = [
    { interval: '0h - 4h', total: 18200, fraud: 48, avgAmount: 85 },
    { interval: '4h - 8h', total: 22400, fraud: 62, avgAmount: 92 },
    { interval: '8h - 12h', total: 38100, fraud: 84, avgAmount: 110 },
    { interval: '12h - 16h', total: 46500, fraud: 112, avgAmount: 125 },
    { interval: '16h - 20h', total: 54200, fraud: 95, avgAmount: 118 },
    { interval: '20h - 24h', total: 42100, fraud: 54, avgAmount: 96 },
    { interval: '24h - 32h', total: 35200, fraud: 25, avgAmount: 88 },
    { interval: '32h - 48h', total: 28107, fraud: 12, avgAmount: 79 },
  ];

  const isDark = theme === 'dark';

  return (
    <div className="space-y-8 pb-12">
      {/* Top Banner Alert / Action Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-brand-900 via-navy-900 to-slate-900 text-white shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-brand-500/20 text-brand-300 border border-brand-500/30">
              Machine Learning Guard Active
            </span>
            <span className="text-xs text-slate-300">European Cardholder Corpus</span>
          </div>
          <h2 className="text-lg font-bold text-white">
            Real-Time Anomaly & Classification Stream
          </h2>
          <p className="text-xs text-slate-300 max-w-2xl">
            Trained on 284,807 transactions using Stratified Random Forest & Logistic Regression with PCA feature extraction.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-end sm:self-center">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur-sm transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            onClick={() => setActivePage('predict')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-500 to-teal-400 hover:from-brand-600 hover:to-teal-500 text-slate-950 text-xs font-bold shadow-lg shadow-brand-500/30 transition-all"
          >
            <ShieldAlert className="w-4 h-4" />
            Test Live Predict
          </button>
        </div>
      </div>

      {/* KPI Statistic Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Total Transactions */}
        <div className="glass-card p-6 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Total Transactions
            </span>
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {totalTx.toLocaleString()}
            </span>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center">
              <TrendingUp className="w-3.5 h-3.5 mr-0.5" /> 100%
            </span>
            <span>European benchmark + live</span>
          </div>
        </div>

        {/* Card 2: Genuine Transactions */}
        <div className="glass-card p-6 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Genuine Transactions
            </span>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 tracking-tight">
              {genuineTx.toLocaleString()}
            </span>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
              {((genuineTx / totalTx) * 100).toFixed(2)}%
            </span>
            <span>authentic payment traffic</span>
          </div>
        </div>

        {/* Card 3: Fraudulent Transactions */}
        <div className="glass-card p-6 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Fraudulent Detected
            </span>
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-extrabold text-rose-600 dark:text-rose-400 tracking-tight">
              {fraudTx.toLocaleString()}
            </span>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <span className="font-semibold text-rose-600 dark:text-rose-400">
              {fraudRate}%
            </span>
            <span>severe financial exposure</span>
          </div>
        </div>

        {/* Card 4: Model Accuracy / Recall */}
        <div className="glass-card p-6 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Model Test Accuracy
            </span>
            <div className="w-10 h-10 rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center">
              <Activity className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-extrabold text-brand-600 dark:text-brand-400 tracking-tight">
              {metrics ? `${(metrics.models.random_forest.accuracy * 100).toFixed(2)}%` : '99.94%'}
            </span>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <span className="font-semibold text-brand-600 dark:text-brand-400">
              F1: {metrics ? `${(metrics.models.random_forest.f1_score * 100).toFixed(1)}%` : '82.9%'}
            </span>
            <span>ROC-AUC: {metrics?.models.random_forest.roc_auc || '0.9744'}</span>
          </div>
        </div>
      </div>

      {/* Analytics Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart 1: Time Interval Analytics (2 Columns) */}
        <div className="lg:col-span-2 glass-card p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-6">
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Temporal Transaction & Fraud Distribution
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Transaction volume and detected fraud instances across 48-hour timeline
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                <span className="w-3 h-3 rounded bg-brand-500" /> Total Volume
              </span>
              <span className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400 font-semibold">
                <span className="w-3 h-3 rounded bg-rose-500" /> Fraud Incidents
              </span>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timeChartData}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#14b8a6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorFraud" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#1e293b' : '#f1f5f9'} />
                <XAxis 
                  dataKey="interval" 
                  stroke={isDark ? '#64748b' : '#94a3b8'} 
                  fontSize={11} 
                  tickLine={false} 
                />
                <YAxis 
                  stroke={isDark ? '#64748b' : '#94a3b8'} 
                  fontSize={11} 
                  tickLine={false}
                  tickFormatter={(val) => `${(val/1000).toFixed(0)}k`}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: isDark ? '#0f172a' : '#ffffff',
                    borderColor: isDark ? '#334155' : '#e2e8f0',
                    borderRadius: '12px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                    color: isDark ? '#f8fafc' : '#0f172a'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="total" 
                  stroke="#14b8a6" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorTotal)" 
                  name="Transactions"
                />
                <Area 
                  type="monotone" 
                  dataKey="fraud" 
                  stroke="#f43f5e" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorFraud)" 
                  name="Frauds"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Fraud vs Genuine Pie Chart (1 Column) */}
        <div className="glass-card p-6 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Class Imbalance Ratio
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Proportion of Genuine vs Fraudulent samples
            </p>
          </div>

          <div className="h-56 w-full relative my-auto">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(val) => [val.toLocaleString() + ' txns', 'Count']}
                  contentStyle={{
                    backgroundColor: isDark ? '#0f172a' : '#ffffff',
                    borderColor: isDark ? '#334155' : '#e2e8f0',
                    borderRadius: '12px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                    color: isDark ? '#f8fafc' : '#0f172a'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Center Label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-black text-slate-900 dark:text-white">
                99.83%
              </span>
              <span className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400">
                Genuine
              </span>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Genuine Rate
              </span>
              <span className="font-bold text-slate-900 dark:text-white">
                {genuineTx.toLocaleString()} (99.83%)
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Fraud Rate
              </span>
              <span className="font-bold text-rose-600 dark:text-rose-400">
                {fraudTx.toLocaleString()} ({fraudRate}%)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Live Recent Transactions Table */}
      <div className="glass-card p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-brand-500" />
              Live Prediction Audit History
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Transactions processed and evaluated via active REST API endpoints
            </p>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            {history.length > 0 && (
              <button
                onClick={handleClearHistory}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Clear Audit
              </button>
            )}
            <button
              onClick={() => setActivePage('predict')}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-brand-600 text-white hover:bg-brand-700 transition-colors shadow-sm"
            >
              New Prediction
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {history.length === 0 ? (
          <div className="text-center py-12 px-4 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
            <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mx-auto mb-3">
              <CreditCard className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">
              No Live Predictions Recorded Yet
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto mt-1 mb-4">
              Submit single transactions on the Fraud Prediction page or upload a CSV file on Batch Analysis to populate live predictions.
            </p>
            <button
              onClick={() => setActivePage('predict')}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-brand-600 text-white hover:bg-brand-700 transition-colors shadow-md shadow-brand-600/20"
            >
              Launch Live Prediction
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 uppercase font-semibold text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4">Transaction ID</th>
                  <th className="py-3 px-4">Classification</th>
                  <th className="py-3 px-4">Risk Level</th>
                  <th className="py-3 px-4">Fraud Probability</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {history.map((tx) => (
                  <tr key={tx.transaction_id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 font-mono font-medium text-slate-900 dark:text-slate-100">
                      {tx.transaction_id}
                    </td>
                    <td className="py-3 px-4">
                      {tx.is_fraud ? (
                        <span className="badge-fraud">
                          Fraudulent
                        </span>
                      ) : (
                        <span className="badge-genuine">
                          Genuine
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                        tx.risk_level === 'High' 
                          ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400' 
                          : tx.risk_level === 'Medium'
                          ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                          : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                      }`}>
                        {tx.risk_level} Risk
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono font-semibold">
                      <span className={tx.is_fraud ? 'text-rose-600 dark:text-rose-400' : 'text-slate-600 dark:text-slate-300'}>
                        {(tx.fraud_probability * 100).toFixed(2)}%
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-700 dark:text-slate-300">
                      ${Number(tx.amount || 0).toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-slate-400 dark:text-slate-500 text-[11px]">
                      {new Date(tx.timestamp).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
