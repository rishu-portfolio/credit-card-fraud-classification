/**
 * API Service for Credit Card Fraud Classification System
 * Connects React Frontend to Python Backend REST API
 */

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        ...(options.headers || {}),
      },
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      const errorMessage = data?.error || `Server responded with status ${res.status}`;
      throw new Error(errorMessage);
    }

    return data;
  } catch (err) {
    if (err.message.includes('Failed to fetch')) {
      throw new Error(`Unable to connect to ML Backend at ${API_BASE}. Please ensure backend is running.`);
    }
    throw err;
  }
}

export const api = {
  // Check system & model health
  checkHealth: () => request('/health'),

  // Fetch full model metrics (accuracy, confusion matrix, ROC curve, feature importances)
  getModelMetrics: () => request('/model-metrics'),

  // Fetch sample genuine & fraud feature presets
  getPresets: () => request('/presets'),

  // Fetch aggregated dashboard metrics
  getSummary: () => request('/summary'),

  // Fetch prediction audit history
  getHistory: (limit = 50) => request(`/history?limit=${limit}`),

  // Clear SQLite history
  clearHistory: () => request('/history', { method: 'DELETE' }),

  // Predict single transaction
  predictSingle: (transactionData) =>
    request('/predict', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(transactionData),
    }),

  // Predict batch via CSV file upload
  predictBatchFile: async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    const url = `${API_BASE}/predict-batch`;
    const res = await fetch(url, {
      method: 'POST',
      body: formData,
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) {
      throw new Error(data?.error || `Upload failed with status ${res.status}`);
    }
    return data;
  },

  // Predict batch via JSON
  predictBatchJson: (transactions) =>
    request('/predict-batch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(transactions),
    }),

  // Sample CSV download URL
  getSampleCsvUrl: () => `${API_BASE}/sample-csv`,
  
  // Base URL
  getBaseUrl: () => API_BASE
};
