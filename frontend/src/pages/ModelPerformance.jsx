import React, { useEffect, useState } from 'react';
import { 
  BarChart3, 
  Activity, 
  CheckCircle2, 
  AlertCircle, 
  TrendingUp, 
  Cpu, 
  ShieldCheck, 
  Layers, 
  Award,
  RefreshCw,
  Info
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  LineChart, 
  Line 
} from 'recharts';
import { api } from '../services/api';
import { useTheme } from '../context/ThemeContext';

export function ModelPerformance() {
  const { theme } = useTheme();
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCmModel, setSelectedCmModel] = useState('random_forest');

  const isDark = theme === 'dark';

  const fetchMetrics = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getModelMetrics();
      setMetrics(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-3">
        <RefreshCw className="w-8 h-8 animate-spin text-brand-500" />
        <span className="text-sm font-semibold text-slate-500">Loading model evaluation metrics...</span>
      </div>
    );
  }

  if (error || !metrics) {
    return (
      <div className="p-6 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400">
        <h3 className="font-bold text-base flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          Metrics Unavailable
        </h3>
        <p className="text-xs mt-1">{error || 'Could not load metrics metadata from backend.'}</p>
        <button
          onClick={fetchMetrics}
          className="mt-4 px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold"
        >
          Retry
        </button>
      </div>
    );
  }

  const rf = metrics.models.random_forest;
  const lr = metrics.models.logistic_regression;

  // Comparison Bar Chart Data
  const comparisonData = [
    { metric: 'Accuracy', 'Random Forest': rf.accuracy * 100, 'Logistic Regression': lr.accuracy * 100 },
    { metric: 'Precision', 'Random Forest': rf.precision * 100, 'Logistic Regression': lr.precision * 100 },
    { metric: 'Recall', 'Random Forest': rf.recall * 100, 'Logistic Regression': lr.recall * 100 },
    { metric: 'F1 Score', 'Random Forest': rf.f1_score * 100, 'Logistic Regression': lr.f1_score * 100 },
    { metric: 'ROC-AUC', 'Random Forest': rf.roc_auc * 100, 'Logistic Regression': lr.roc_auc * 100 },
    { metric: 'PR-AUC', 'Random Forest': rf.pr_auc * 100, 'Logistic Regression': lr.pr_auc * 100 },
  ];

  // Combined ROC Curve Data
  const rocCurvePoints = (metrics.roc_curve?.random_forest || []).map((pt, i) => ({
    fpr: pt.fpr,
    rfTpr: pt.tpr,
    lrTpr: metrics.roc_curve?.logistic_regression?.[i]?.tpr || 0,
    baseline: pt.fpr
  }));

  // Confusion Matrix Selected Model Data
  const currentModel = selectedCmModel === 'random_forest' ? rf : lr;
  const cm = currentModel.confusion_matrix;
  const totalCm = cm.tn + cm.fp + cm.fn + cm.tp;

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Best Model Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-brand-950 to-slate-900 border border-brand-500/30 text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold uppercase tracking-wider bg-brand-500 text-slate-950">
              Primary Production Model
            </span>
            <span className="text-xs text-brand-300 font-mono">Stratified 56,962 Test Samples</span>
          </div>
          <h2 className="text-2xl font-black text-white flex items-center gap-2">
            <Award className="w-6 h-6 text-amber-400" />
            {metrics.best_model} Classifier
          </h2>
          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            Selected as the champion model due to superior F1 Score ({(rf.f1_score * 100).toFixed(2)}%) and minimal False Positives (only {rf.confusion_matrix.fp} out of 56,864 genuine transactions).
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:border-l sm:border-slate-700/80 sm:pl-6 text-center">
          <div className="p-3 rounded-xl bg-white/5 backdrop-blur-sm">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">F1 Score</span>
            <span className="text-xl font-black text-brand-400 font-mono">
              {(rf.f1_score * 100).toFixed(1)}%
            </span>
          </div>
          <div className="p-3 rounded-xl bg-white/5 backdrop-blur-sm">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">ROC-AUC</span>
            <span className="text-xl font-black text-teal-400 font-mono">
              {rf.roc_auc.toFixed(4)}
            </span>
          </div>
        </div>
      </div>

      {/* KPI Evaluation Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { label: 'Accuracy', rfVal: `${(rf.accuracy * 100).toFixed(2)}%`, lrVal: `${(lr.accuracy * 100).toFixed(2)}%` },
          { label: 'Precision', rfVal: `${(rf.precision * 100).toFixed(1)}%`, lrVal: `${(lr.precision * 100).toFixed(1)}%` },
          { label: 'Recall', rfVal: `${(rf.recall * 100).toFixed(1)}%`, lrVal: `${(lr.recall * 100).toFixed(1)}%` },
          { label: 'F1 Score', rfVal: `${(rf.f1_score * 100).toFixed(1)}%`, lrVal: `${(lr.f1_score * 100).toFixed(1)}%` },
          { label: 'ROC-AUC', rfVal: rf.roc_auc.toFixed(4), lrVal: lr.roc_auc.toFixed(4) },
          { label: 'PR-AUC', rfVal: rf.pr_auc.toFixed(4), lrVal: lr.pr_auc.toFixed(4) },
        ].map((item, idx) => (
          <div key={idx} className="glass-card p-4">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              {item.label}
            </span>
            <span className="text-lg font-black font-mono text-brand-600 dark:text-brand-400 block">
              {item.rfVal}
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">
              LR: {item.lrVal}
            </span>
          </div>
        ))}
      </div>

      {/* Comparison Chart & Confusion Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Model Comparison Bar Chart (7 Columns) */}
        <div className="lg:col-span-7 glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Algorithm Head-to-Head Comparison
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Random Forest vs Logistic Regression on 56,962 test set transactions
              </p>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonData}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#1e293b' : '#f1f5f9'} />
                <XAxis 
                  dataKey="metric" 
                  stroke={isDark ? '#64748b' : '#94a3b8'} 
                  fontSize={11} 
                  tickLine={false} 
                />
                <YAxis 
                  stroke={isDark ? '#64748b' : '#94a3b8'} 
                  fontSize={11} 
                  tickLine={false} 
                  domain={[0, 100]}
                  tickFormatter={(val) => `${val}%`}
                />
                <Tooltip 
                  formatter={(val) => [`${Number(val).toFixed(2)}%`]}
                  contentStyle={{
                    backgroundColor: isDark ? '#0f172a' : '#ffffff',
                    borderColor: isDark ? '#334155' : '#e2e8f0',
                    borderRadius: '12px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                    color: isDark ? '#f8fafc' : '#0f172a'
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="Random Forest" fill="#14b8a6" radius={[6, 6, 0, 0]} />
                <Bar dataKey="Logistic Regression" fill="#64748b" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Confusion Matrix Interactive Visualizer (5 Columns) */}
        <div className="lg:col-span-5 glass-card p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  Confusion Matrix
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Classification contingency breakdown
                </p>
              </div>

              {/* Model Switcher Pill */}
              <div className="flex rounded-lg bg-slate-100 dark:bg-slate-800 p-0.5 text-xs font-semibold">
                <button
                  onClick={() => setSelectedCmModel('random_forest')}
                  className={`px-2.5 py-1 rounded-md transition-colors ${
                    selectedCmModel === 'random_forest'
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-500'
                  }`}
                >
                  RF
                </button>
                <button
                  onClick={() => setSelectedCmModel('logistic_regression')}
                  className={`px-2.5 py-1 rounded-md transition-colors ${
                    selectedCmModel === 'logistic_regression'
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-500'
                  }`}
                >
                  LR
                </button>
              </div>
            </div>

            {/* 2x2 Confusion Grid */}
            <div className="grid grid-cols-2 gap-3 my-4">
              {/* True Negative */}
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block">
                  True Negative (TN)
                </span>
                <span className="text-2xl font-black font-mono text-emerald-700 dark:text-emerald-300 block my-1">
                  {cm.tn.toLocaleString()}
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">
                  Actual Genuine &rarr; Predicted Genuine ({((cm.tn / totalCm) * 100).toFixed(1)}%)
                </span>
              </div>

              {/* False Positive */}
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-center">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-600 dark:text-amber-400 block">
                  False Positive (FP)
                </span>
                <span className="text-2xl font-black font-mono text-amber-700 dark:text-amber-300 block my-1">
                  {cm.fp.toLocaleString()}
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">
                  Type I Error &bull; False Alarm
                </span>
              </div>

              {/* False Negative */}
              <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-center">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-600 dark:text-rose-400 block">
                  False Negative (FN)
                </span>
                <span className="text-2xl font-black font-mono text-rose-700 dark:text-rose-300 block my-1">
                  {cm.fn.toLocaleString()}
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">
                  Type II Error &bull; Missed Fraud
                </span>
              </div>

              {/* True Positive */}
              <div className="p-4 rounded-xl bg-teal-500/10 border border-teal-500/20 text-center">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-teal-600 dark:text-teal-400 block">
                  True Positive (TP)
                </span>
                <span className="text-2xl font-black font-mono text-teal-700 dark:text-teal-300 block my-1">
                  {cm.tp.toLocaleString()}
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">
                  Actual Fraud &rarr; Intercepted Fraud ({((cm.tp / (cm.tp + cm.fn)) * 100).toFixed(1)}% Recall)
                </span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
            <span>Evaluated Test Samples: {totalCm.toLocaleString()}</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              Total Actual Frauds: {(cm.tp + cm.fn)}
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Row: ROC Curve & Top Feature Importances */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* ROC Curves */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Receiver Operating Characteristic (ROC) Curve
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                True Positive Rate vs False Positive Rate across classification thresholds
              </p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={rocCurvePoints}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#1e293b' : '#f1f5f9'} />
                <XAxis 
                  dataKey="fpr" 
                  stroke={isDark ? '#64748b' : '#94a3b8'} 
                  fontSize={11} 
                  tickLine={false}
                  label={{ value: 'False Positive Rate (FPR)', position: 'insideBottomRight', offset: -5, fontSize: 10, fill: '#64748b' }}
                />
                <YAxis 
                  stroke={isDark ? '#64748b' : '#94a3b8'} 
                  fontSize={11} 
                  tickLine={false} 
                  domain={[0, 1]}
                  label={{ value: 'True Positive Rate (TPR)', angle: -90, position: 'insideLeft', fontSize: 10, fill: '#64748b' }}
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
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Line type="monotone" dataKey="rfTpr" stroke="#14b8a6" strokeWidth={2.5} dot={false} name="Random Forest (AUC = 0.974)" />
                <Line type="monotone" dataKey="lrTpr" stroke="#3b82f6" strokeWidth={1.8} dot={false} name="Logistic Regression (AUC = 0.972)" />
                <Line type="linear" dataKey="baseline" stroke="#94a3b8" strokeWidth={1} strokeDasharray="4 4" dot={false} name="Random Guess (0.50)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Feature Importance Bar Chart */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Top Predictor Features (Gini Impurity)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Most discriminative PCA dimensions identified by Random Forest
              </p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={metrics.top_features.slice(0, 10)} 
                layout="vertical"
                margin={{ left: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#1e293b' : '#f1f5f9'} />
                <XAxis 
                  type="number" 
                  stroke={isDark ? '#64748b' : '#94a3b8'} 
                  fontSize={11} 
                  tickLine={false} 
                />
                <YAxis 
                  type="category" 
                  dataKey="feature" 
                  stroke={isDark ? '#64748b' : '#94a3b8'} 
                  fontSize={11} 
                  tickLine={false} 
                />
                <Tooltip 
                  formatter={(val) => [Number(val).toFixed(4), 'Importance']}
                  contentStyle={{
                    backgroundColor: isDark ? '#0f172a' : '#ffffff',
                    borderColor: isDark ? '#334155' : '#e2e8f0',
                    borderRadius: '12px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                    color: isDark ? '#f8fafc' : '#0f172a'
                  }}
                />
                <Bar dataKey="importance" fill="#0d9488" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
