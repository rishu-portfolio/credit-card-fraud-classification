import React, { useState, useRef } from 'react';
import { 
  UploadCloud, 
  FileSpreadsheet, 
  CheckCircle2, 
  AlertTriangle, 
  Download, 
  RefreshCw, 
  ShieldCheck, 
  ShieldAlert, 
  Search, 
  Filter,
  FileCheck,
  ChevronLeft,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { api } from '../services/api';

export function BatchAnalysis() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [resultsData, setResultsData] = useState(null);
  const [error, setError] = useState(null);
  const [filterType, setFilterType] = useState('ALL'); // ALL, FRAUD, GENUINE
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const fileInputRef = useRef(null);

  const PAGE_SIZE = 15;

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    if (selected) {
      if (!selected.name.toLowerCase().endsWith('.csv')) {
        setError('Please select a valid CSV file (.csv)');
        setFile(null);
        return;
      }
      setFile(selected);
      setError(null);
      setResultsData(null);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const dropped = e.dataTransfer.files?.[0];
    if (dropped) {
      if (!dropped.name.toLowerCase().endsWith('.csv')) {
        setError('Please drop a valid CSV file (.csv)');
        return;
      }
      setFile(dropped);
      setError(null);
      setResultsData(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    try {
      const data = await api.predictBatchFile(file);
      setResultsData(data);
      setCurrentPage(1);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadResults = () => {
    if (!resultsData || !resultsData.results) return;

    // Convert results to CSV format
    const headers = ["transaction_id", "prediction", "is_fraud", "fraud_probability", "risk_level", "amount", "time_val", "timestamp"];
    const rows = resultsData.results.map(r => [
      r.transaction_id,
      r.prediction,
      r.is_fraud ? 1 : 0,
      r.fraud_probability,
      r.risk_level,
      r.amount,
      r.time_val,
      r.timestamp
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [
      headers.join(","),
      ...rows.map(e => e.join(","))
    ].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `fraud_classification_results_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter and search logic
  const filteredResults = (resultsData?.results || []).filter(item => {
    const matchesFilter = 
      filterType === 'ALL' ||
      (filterType === 'FRAUD' && item.is_fraud) ||
      (filterType === 'GENUINE' && !item.is_fraud);

    const matchesSearch = 
      item.transaction_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.risk_level.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const totalPages = Math.ceil(filteredResults.length / PAGE_SIZE) || 1;
  const paginatedResults = filteredResults.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  return (
    <div className="space-y-8 pb-12">
      {/* Upload Zone Card */}
      <div className="glass-card p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-brand-500" />
              High-Throughput CSV Batch Processor
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Upload multiple transactions to score fraud probability and classify thousands of records concurrently.
            </p>
          </div>

          <a
            href={api.getSampleCsvUrl()}
            download="credit_card_transactions_sample.csv"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-brand-50 dark:bg-brand-950/40 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800/60 hover:bg-brand-100 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            Download Sample Test CSV (100 Rows)
          </a>
        </div>

        {/* Drag & Drop Area */}
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`
            border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-200
            ${file 
              ? 'border-brand-500 bg-brand-50/20 dark:bg-brand-950/20' 
              : 'border-slate-300 dark:border-slate-700 hover:border-brand-500 hover:bg-slate-50/50 dark:hover:bg-slate-800/40'}
          `}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".csv"
            className="hidden"
          />

          <div className="flex flex-col items-center justify-center space-y-3">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
              file ? 'bg-brand-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
            }`}>
              {file ? <FileCheck className="w-7 h-7" /> : <UploadCloud className="w-7 h-7" />}
            </div>

            <div>
              {file ? (
                <div>
                  <span className="text-sm font-bold text-brand-700 dark:text-brand-400">
                    {file.name}
                  </span>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {(file.size / 1024).toFixed(1)} KB &bull; Click to choose another file
                  </p>
                </div>
              ) : (
                <div>
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    Click to upload or drag & drop transaction CSV
                  </span>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Must include features: Time, V1 to V28, and Amount (up to 10,000 transactions)
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="mt-4 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Submit Actions */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-end gap-3">
          {file && (
            <button
              onClick={() => { setFile(null); setResultsData(null); }}
              className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            >
              Clear File
            </button>
          )}

          <button
            onClick={handleUpload}
            disabled={!file || loading}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-brand-600 to-teal-500 hover:from-brand-700 hover:to-teal-600 text-white font-bold text-xs shadow-lg shadow-brand-500/25 flex items-center justify-center gap-2 disabled:opacity-50 transition-all"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Processing Model Inferences...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Process Batch & Classify</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Batch Processing Results */}
      {resultsData && (
        <div className="space-y-6">
          {/* Summary Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="glass-card p-5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Total Processed
              </span>
              <div className="text-2xl font-black text-slate-900 dark:text-white mt-2">
                {resultsData.summary.total_processed.toLocaleString()}
              </div>
              <span className="text-[11px] text-slate-400">Transactions evaluated</span>
            </div>

            <div className="glass-card p-5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Genuine Detected
              </span>
              <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-2">
                {resultsData.summary.genuine_count.toLocaleString()}
              </div>
              <span className="text-[11px] text-slate-400">
                {((resultsData.summary.genuine_count / resultsData.summary.total_processed) * 100).toFixed(1)}% authenticity
              </span>
            </div>

            <div className="glass-card p-5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
                Fraudulent Detected
              </span>
              <div className="text-2xl font-black text-rose-600 dark:text-rose-400 mt-2">
                {resultsData.summary.fraud_count.toLocaleString()}
              </div>
              <span className="text-[11px] text-slate-400">Flagged suspicious</span>
            </div>

            <div className="glass-card p-5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
                Fraud Exposure Rate
              </span>
              <div className="text-2xl font-black text-brand-600 dark:text-brand-400 mt-2">
                {resultsData.summary.fraud_percentage}%
              </div>
              <span className="text-[11px] text-slate-400">Batch risk ratio</span>
            </div>
          </div>

          {/* Results Table & Search / Filter Controls */}
          <div className="glass-card p-6">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6">
              {/* Search Bar */}
              <div className="relative flex-1 max-w-sm">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Filter by Transaction ID or Risk..."
                  value={searchTerm}
                  onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                  className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
              </div>

              {/* Filter Tabs & Export Button */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 text-xs font-semibold">
                  {['ALL', 'GENUINE', 'FRAUD'].map((type) => (
                    <button
                      key={type}
                      onClick={() => { setFilterType(type); setCurrentPage(1); }}
                      className={`px-3 py-1.5 rounded-lg transition-colors ${
                        filterType === type 
                          ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' 
                          : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleDownloadResults}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-brand-600 text-white hover:bg-brand-700 shadow-sm transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  Export Results CSV
                </button>
              </div>
            </div>

            {/* Results Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/60 uppercase font-semibold text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Row</th>
                    <th className="py-3 px-4">Transaction ID</th>
                    <th className="py-3 px-4">Classification</th>
                    <th className="py-3 px-4">Risk Level</th>
                    <th className="py-3 px-4">Fraud Probability</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {paginatedResults.map((item, idx) => (
                    <tr key={item.transaction_id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4 font-mono text-slate-400">
                        {(currentPage - 1) * PAGE_SIZE + idx + 1}
                      </td>
                      <td className="py-3 px-4 font-mono font-medium text-slate-900 dark:text-slate-100">
                        {item.transaction_id}
                      </td>
                      <td className="py-3 px-4">
                        {item.is_fraud ? (
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
                          item.risk_level === 'High' 
                            ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400' 
                            : item.risk_level === 'Medium'
                            ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                            : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                        }`}>
                          {item.risk_level}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono font-semibold">
                        <span className={item.is_fraud ? 'text-rose-600 dark:text-rose-400' : 'text-slate-600 dark:text-slate-300'}>
                          {(item.fraud_probability * 100).toFixed(2)}%
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-700 dark:text-slate-300">
                        ${Number(item.amount || 0).toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-slate-500 dark:text-slate-400 font-mono">
                        {Number(item.time_val || 0).toFixed(0)}s
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
              <span className="text-slate-500 dark:text-slate-400">
                Showing {Math.min((currentPage - 1) * PAGE_SIZE + 1, filteredResults.length)} to {Math.min(currentPage * PAGE_SIZE, filteredResults.length)} of {filteredResults.length} records
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
