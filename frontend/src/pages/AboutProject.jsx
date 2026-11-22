import React from 'react';
import { 
  GraduationCap, 
  BookOpen, 
  Target, 
  Cpu, 
  Layers, 
  Workflow, 
  Compass, 
  CheckCircle2, 
  ShieldCheck, 
  Code2, 
  Database,
  Lock,
  Zap,
  Globe2
} from 'lucide-react';

export function AboutProject() {
  return (
    <div className="space-y-10 pb-16 max-w-5xl mx-auto">
      {/* Hero Header */}
      <div className="text-center space-y-3 py-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20">
          <GraduationCap className="w-4 h-4" />
          B.Tech CSE Final-Year Capstone Project
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          Credit Card Fraud Classification System
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
          An intelligent machine learning framework utilizing stratified ensemble algorithms and PCA components for real-time financial anomaly detection.
        </p>
      </div>

      {/* 1. Problem Statement & Objectives Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Problem Statement */}
        <div className="glass-card p-6 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center">
            <BookOpen className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Problem Statement
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Global payment systems incur over <strong>$32 Billion</strong> in annual losses due to credit card fraud. Detecting fraudulent activities presents severe challenges:
          </p>
          <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 flex-shrink-0" />
              <span><strong>Extreme Class Imbalance:</strong> Fraudulent transactions constitute only <strong>0.172%</strong> of all events, rendering standard accuracy metrics misleading.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 flex-shrink-0" />
              <span><strong>Cost of False Positives:</strong> Blocking authentic transactions damages customer trust and merchant revenue.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 flex-shrink-0" />
              <span><strong>Strict Latency Constraints:</strong> Authorization decisions must execute in under 150 milliseconds.</span>
            </li>
          </ul>
        </div>

        {/* Project Objectives */}
        <div className="glass-card p-6 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <Target className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Project Objectives
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Design and deploy an end-to-end operational software artifact satisfying production-grade benchmarks:
          </p>
          <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
              <span>Train and benchmark <strong>Random Forest</strong> and <strong>Logistic Regression</strong> on the European dataset using stratified evaluation.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
              <span>Attain a test set F1-Score exceeding <strong>80%</strong> with ROC-AUC &gt; <strong>0.97</strong>.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
              <span>Build an enterprise REST API providing real-time single and batch prediction capabilities with SQLite persistence.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
              <span>Deliver an interactive, responsive analytics dashboard with dark/light themes and explainable AI explanations.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* 2. System Architecture Workflow */}
      <div className="glass-card p-6 sm:p-8 space-y-6">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Workflow className="w-5 h-5 text-brand-500" />
            End-to-End System Architecture
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Decoupled multi-tier client-server structure designed for live cloud deployment
          </p>
        </div>

        {/* Visual Flow Stepper */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 relative">
            <span className="text-[10px] font-bold text-brand-500 uppercase tracking-wider block mb-1">Step 1</span>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">Client Dashboard</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              React 18 + Tailwind CSS frontend parses user parameters or CSV files and invokes REST API.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 relative">
            <span className="text-[10px] font-bold text-brand-500 uppercase tracking-wider block mb-1">Step 2</span>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">REST API Layer</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Flask / FastAPI endpoints validate numerical bounds, handle CORS, and manage error responses.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 relative">
            <span className="text-[10px] font-bold text-brand-500 uppercase tracking-wider block mb-1">Step 3</span>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">ML Inference</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              StandardScaler normalizes inputs; Random Forest predicts probabilities and risk level classification.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 relative">
            <span className="text-[10px] font-bold text-brand-500 uppercase tracking-wider block mb-1">Step 4</span>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">Audit & Storage</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Anonymized prediction results are recorded into SQLite history and returned in JSON format.
            </p>
          </div>
        </div>
      </div>

      {/* 3. Dataset & PCA Methodology */}
      <div className="glass-card p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-2">
          <Database className="w-5 h-5 text-brand-500" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            European Credit Card Benchmark & PCA Transformation
          </h3>
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          The machine learning models are trained on the genuine European Credit Card Fraud Detection dataset collected in September 2013:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60">
            <span className="text-slate-400 block mb-1 font-semibold">Total Sample Count</span>
            <span className="text-base font-bold text-slate-900 dark:text-white font-mono">284,807 Rows</span>
            <span className="text-[11px] text-slate-500 block mt-0.5">Recorded over 2 continuous days</span>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60">
            <span className="text-slate-400 block mb-1 font-semibold">Fraudulent Class Distribution</span>
            <span className="text-base font-bold text-rose-600 dark:text-rose-400 font-mono">492 Frauds (0.173%)</span>
            <span className="text-[11px] text-slate-500 block mt-0.5">Highly skewed negative class imbalance</span>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60">
            <span className="text-slate-400 block mb-1 font-semibold">PCA Anonymization</span>
            <span className="text-base font-bold text-slate-900 dark:text-white font-mono">V1 to V28 Features</span>
            <span className="text-[11px] text-slate-500 block mt-0.5">GDPR/PCI-DSS privacy compliance</span>
          </div>
        </div>
      </div>

      {/* 4. Technology Stack */}
      <div className="glass-card p-6 sm:p-8 space-y-6">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Code2 className="w-5 h-5 text-brand-500" />
            Technologies & Frameworks Utilized
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Production-grade open-source stack supporting modern web standards
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
              Frontend Client
            </h4>
            <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
              <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 font-medium">React 18 &bull; Component Architecture</div>
              <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 font-medium">Tailwind CSS &bull; Responsive Design</div>
              <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 font-medium">Recharts &bull; Financial Visualizations</div>
              <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 font-medium">Lucide Icons &bull; Modern UI Icons</div>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
              Backend & Services
            </h4>
            <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
              <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 font-medium">Python 3 &bull; REST API Server</div>
              <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 font-medium">Flask &bull; Lightweight Endpoints</div>
              <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 font-medium">Flask-CORS &bull; Secure Origin Exchange</div>
              <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 font-medium">SQLite &bull; Audit Trail & History</div>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Machine Learning Pipeline
            </h4>
            <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
              <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 font-medium">Scikit-Learn &bull; Random Forest & LR</div>
              <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 font-medium">StandardScaler &bull; Feature Normalization</div>
              <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 font-medium">Pandas & NumPy &bull; Matrix Computation</div>
              <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 font-medium">Joblib &bull; Model Artifact Serialization</div>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Future Scope & Enhancements */}
      <div className="glass-card p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-2">
          <Compass className="w-5 h-5 text-brand-500" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Future Scope & Engineering Enhancements
          </h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-600 dark:text-slate-300">
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1.5">
            <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-500" />
              Apache Kafka & Real-Time Stream Ingestion
            </span>
            <p className="text-slate-500 dark:text-slate-400">
              Incorporate message queues like Apache Kafka or AWS Kinesis to process upwards of 50,000 transactions per second under peak event loads.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1.5">
            <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-brand-500" />
              Graph Neural Networks (GNN)
            </span>
            <p className="text-slate-500 dark:text-slate-400">
              Construct merchant-cardholder bipartite graphs to expose complex syndicated fraud rings and automated mule account clusters.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1.5">
            <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-blue-500" />
              Deep Learning Autoencoders
            </span>
            <p className="text-slate-500 dark:text-slate-400">
              Deploy Variational Autoencoders (VAEs) for semi-supervised anomaly reconstruction, identifying zero-day fraud mechanisms.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1.5">
            <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-emerald-500" />
              Biometric & Behavioral Dynamics
            </span>
            <p className="text-slate-500 dark:text-slate-400">
              Fuse transaction attributes with behavioral biometrics (keystroke cadence, touch trajectory, IP geolocation velocity) for multi-factor risk scoring.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
