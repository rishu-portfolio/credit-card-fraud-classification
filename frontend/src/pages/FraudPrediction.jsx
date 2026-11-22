import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Sparkles, 
  DollarSign, 
  Clock, 
  RefreshCw, 
  AlertTriangle, 
  CheckCircle2, 
  Sliders, 
  Info,
  ChevronDown,
  ChevronUp,
  Cpu
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { api } from '../services/api';

const DEFAULT_FEATURES = {
  Time: 406.0,
  Amount: 149.62,
  ...Object.fromEntries(Array.from({ length: 28 }, (_, i) => [`V${i + 1}`, 0.0]))
};

export function FraudPrediction() {
  const [formData, setFormData] = useState(DEFAULT_FEATURES);
  const [presets, setPresets] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [showAllV, setShowAllV] = useState(false);

  // Load sample presets on mount
  useEffect(() => {
    api.getPresets()
      .then(data => setPresets(data))
      .catch(() => console.log("Presets load fallback"));
  }, []);

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value === '' ? '' : Number(value)
    }));
  };

  const handleApplyPreset = (type) => {
    if (!presets || !presets[type]) return;
    setFormData(presets[type]);
    setResult(null);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // Validate all fields are numbers
      const payload = {};
      for (const [key, val] of Object.entries(formData)) {
        payload[key] = Number(val || 0);
      }

      const res = await api.predictSingle(payload);
      setResult(res);

      if (!res.is_fraud) {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.8 }
        });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData(DEFAULT_FEATURES);
    setResult(null);
    setError(null);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Top Quick Actions Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Sliders className="w-4 h-4 text-brand-500" />
            Transaction Feature Synthesizer & Simulator
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Enter custom parameters or click preset scenarios to load verified European test transactions.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => handleApplyPreset('genuine')}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 hover:bg-emerald-100 transition-colors"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Simulate Genuine
          </button>
          <button
            type="button"
            onClick={() => handleApplyPreset('fraud')}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800/60 hover:bg-rose-100 transition-colors"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            Simulate Fraud
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Reset
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form Panel (7 Columns) */}
        <div className="lg:col-span-7 space-y-6">
          <form onSubmit={handleSubmit} className="glass-card p-6 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <span className="text-sm font-bold text-slate-900 dark:text-white">
                Transaction Core Parameters
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                30 Dimension Input
              </span>
            </div>

            {/* Core Features: Amount & Time */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5 text-brand-500" />
                  Transaction Amount (USD / EUR)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-slate-400 font-bold text-sm">$</span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={formData.Amount}
                    onChange={(e) => handleChange('Amount', e.target.value)}
                    className="w-full pl-8 pr-4 py-2 text-sm font-mono rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-900 dark:text-white"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-brand-500" />
                  Elapsed Time (Seconds from start)
                </label>
                <input
                  type="number"
                  step="1"
                  min="0"
                  required
                  value={formData.Time}
                  onChange={(e) => handleChange('Time', e.target.value)}
                  className="w-full px-4 py-2 text-sm font-mono rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-900 dark:text-white"
                  placeholder="0"
                />
              </div>
            </div>

            {/* Key PCA Anomaly Components */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  High-Impact PCA Components (V14, V10, V4, V12, V17)
                </label>
                <span className="text-[11px] text-slate-400">
                  Primary Anomaly Vectors
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {['V14', 'V10', 'V4', 'V12', 'V17'].map((vKey) => (
                  <div key={vKey}>
                    <span className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400 block mb-1">
                      {vKey}
                    </span>
                    <input
                      type="number"
                      step="0.0001"
                      required
                      value={formData[vKey]}
                      onChange={(e) => handleChange(vKey, e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs font-mono rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-900 dark:text-white"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Collapsible Remaining PCA Features */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setShowAllV(!showAllV)}
                className="w-full py-2.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white flex items-center justify-between transition-colors"
              >
                <span>{showAllV ? 'Hide Secondary PCA Dimensions (V1 - V28)' : 'View & Edit All 28 PCA Dimensions'}</span>
                {showAllV ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {showAllV && (
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-slate-50/50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 max-h-72 overflow-y-auto">
                  {Array.from({ length: 28 }, (_, i) => `V${i + 1}`).map((vKey) => (
                    <div key={vKey}>
                      <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 block mb-1">
                        {vKey}
                      </span>
                      <input
                        type="number"
                        step="0.0001"
                        value={formData[vKey]}
                        onChange={(e) => handleChange(vKey, e.target.value)}
                        className="w-full px-2 py-1 text-xs font-mono rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-brand-500 text-slate-900 dark:text-white"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Predict Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-brand-600 to-teal-500 hover:from-brand-700 hover:to-teal-600 text-white font-bold text-sm shadow-lg shadow-brand-500/25 flex items-center justify-center gap-2 transition-all disabled:opacity-60"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Evaluating through ML Pipeline...</span>
                </>
              ) : (
                <>
                  <Cpu className="w-4 h-4" />
                  <span>Execute Fraud Classification</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Prediction Results Display Panel (5 Columns) */}
        <div className="lg:col-span-5 space-y-6">
          {result ? (
            <div className={`glass-card p-6 border-2 transition-all duration-300 ${
              result.is_fraud 
                ? 'border-rose-500 dark:border-rose-500 shadow-rose-500/10' 
                : 'border-emerald-500 dark:border-emerald-500 shadow-emerald-500/10'
            }`}>
              {/* Header Badge & Title */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white ${
                    result.is_fraud ? 'bg-rose-500 shadow-lg shadow-rose-500/30' : 'bg-emerald-500 shadow-lg shadow-emerald-500/30'
                  }`}>
                    {result.is_fraud ? <ShieldAlert className="w-6 h-6" /> : <ShieldCheck className="w-6 h-6" />}
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                      Prediction Verdict
                    </span>
                    <h3 className={`text-xl font-black ${
                      result.is_fraud ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'
                    }`}>
                      {result.prediction} Transaction
                    </h3>
                  </div>
                </div>

                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                  result.risk_level === 'High' 
                    ? 'bg-rose-500 text-white' 
                    : result.risk_level === 'Medium'
                    ? 'bg-amber-500 text-white'
                    : 'bg-emerald-500 text-white'
                }`}>
                  {result.risk_level} Risk
                </span>
              </div>

              {/* Probabilities Gauges */}
              <div className="my-6 space-y-4">
                {/* Fraud Probability Bar */}
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-slate-600 dark:text-slate-300">Fraud Probability</span>
                    <span className="font-mono text-rose-600 dark:text-rose-400 font-bold">
                      {result.fraud_probability_percent}%
                    </span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div 
                      className="h-full rounded-full bg-gradient-to-r from-rose-500 to-red-600 transition-all duration-700"
                      style={{ width: `${Math.max(result.fraud_probability_percent, 2)}%` }}
                    />
                  </div>
                </div>

                {/* Genuine Probability Bar */}
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-slate-600 dark:text-slate-300">Authentic Probability</span>
                    <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                      {result.genuine_probability_percent}%
                    </span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div 
                      className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 transition-all duration-700"
                      style={{ width: `${Math.max(result.genuine_probability_percent, 2)}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Transaction Context Badges */}
              <div className="grid grid-cols-2 gap-3 py-3 px-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Evaluated Amount</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">
                    ${Number(result.amount).toFixed(2)}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Audit Reference</span>
                  <span className="font-mono font-semibold text-slate-700 dark:text-slate-300 truncate block">
                    {result.transaction_id}
                  </span>
                </div>
              </div>

              {/* Explainable AI Rationale Section */}
              <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-brand-500" />
                  Model Decision Explanation
                </h4>
                <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
                  {result.explanation.summary}
                </p>

                {result.explanation.key_factors && result.explanation.key_factors.length > 0 && (
                  <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                    {result.explanation.key_factors.map((factor, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${
                          result.is_fraud ? 'bg-rose-500' : 'bg-emerald-500'
                        }`} />
                        <span>{factor}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ) : (
            /* Standby Placeholder */
            <div className="glass-card p-8 text-center flex flex-col items-center justify-center min-h-[360px]">
              <div className="w-16 h-16 rounded-2xl bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center mb-4">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Awaiting Transaction Features
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mt-2 mb-6">
                Fill the parameter fields or click Simulate to score an authentic or fraudulent payment transaction in real time.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => handleApplyPreset('genuine')}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition-colors"
                >
                  Load Genuine Preset
                </button>
                <button
                  onClick={() => handleApplyPreset('fraud')}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-100 transition-colors"
                >
                  Load Fraud Preset
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
