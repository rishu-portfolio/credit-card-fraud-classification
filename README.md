# Credit Card Fraud Classification System

[![License: MIT](https://img.shields.io/badge/License-MIT-teal.svg)](https://opensource.org/licenses/MIT)
[![Frontend](https://img.shields.io/badge/Frontend-React%2018%20%7C%20Tailwind%20CSS%20%7C%20Recharts-blue.svg)](https://reactjs.org/)
[![Backend](https://img.shields.io/badge/Backend-Python%20%7C%20Flask%20%7C%20SQLite-green.svg)](https://flask.palletsprojects.com/)
[![Machine Learning](https://img.shields.io/badge/ML-Scikit--Learn%20%7C%20Random%20Forest%20%7C%20Logistic%20Regression-orange.svg)](https://scikit-learn.org/)
[![Deployment](https://img.shields.io/badge/Deploy-Vercel%20%2B%20Render-black.svg)](https://vercel.com/)

A production-grade, full-stack Machine Learning web application designed to detect, classify, and explain credit card transaction fraud in real-time. Built specifically as a **B.Tech Computer Science Engineering Final-Year Capstone Project**, this system bridges empirical data science research with an enterprise financial analytics dashboard.

---

## Table of Contents
1. [Project Overview](#project-overview)
2. [Key Features](#key-features)
3. [Machine Learning Methodology & Genuine Results](#machine-learning-methodology--genuine-results)
4. [Technology Stack](#technology-stack)
5. [System Architecture & Project Structure](#system-architecture--project-structure)
6. [Local Installation & Setup Guide](#local-installation--setup-guide)
7. [Running Automated Tests](#running-automated-tests)
8. [Live Cloud Deployment Guide](#live-cloud-deployment-guide)
   - [Deploying Backend to Render](#a-deploying-backend-to-render)
   - [Deploying Frontend to Vercel](#b-deploying-frontend-to-vercel)
9. [GitHub Upload Instructions](#github-upload-instructions)
10. [Academic Presentation & Viva Guide](#academic-presentation--viva-guide)

---

## Project Overview

Credit card fraud represents over **$32 Billion** in annual financial losses globally. The primary algorithmic challenge in fraud detection is **extreme class imbalance**: out of 284,807 transactions in the standard European cardholder benchmark, only **492 transactions (0.173%)** are fraudulent.

Traditional machine learning models optimized for naive accuracy fail dramatically in this domain, as a dummy model predicting "Genuine" for every single transaction achieves 99.83% accuracy while missing 100% of frauds. This project implements a cost-sensitive, stratified machine learning pipeline utilizing **Balanced Random Forest Classification** and **Logistic Regression**, paired with a financial dashboard offering explainable AI (XAI) risk rationale.

---

## Key Features

### 1. Executive Analytics Dashboard
- **Live & Baseline KPIs**: Displays Total Transactions, Genuine Volume, Fraudulent Interceptions, and Real-Time Fraud Exposure Rate.
- **Interactive Visualizations**: Powered by **Recharts**:
  - 48-Hour Transaction & Fraud Temporal Density (Area Chart).
  - Class Imbalance Ratio Donut Chart (99.83% vs 0.173%).
- **Live Audit Trail**: Chronological SQLite event log recording incoming scored transactions with risk tiers, timestamps, and confidence percentages.

### 2. Live Fraud Prediction & Simulator
- **30-Dimensional Parameter Scorer**: Evaluates `Time`, `Amount`, and anonymized PCA components `V1` to `V28`.
- **1-Click Verified Scenarios**: Pre-loaded simulation buttons to test authentic transactions vs confirmed fraud patterns with genuine European test set vectors.
- **Explainable AI (XAI) Rationale**: Highlights specific anomaly vectors (e.g., severe negative divergence in `V14`, `V10`, or velocity spikes in `V4`).
- **Risk Stratification**: Classifies transactions into **Low (<20%)**, **Medium (20-65%)**, and **High (>65%)** risk tiers.

### 3. High-Throughput CSV Batch Processor
- **Bulk CSV Upload**: Drag-and-drop file ingestion supporting up to 10,000 transactions per batch.
- **Instant Vectorized Inference**: Sub-second NumPy/Scikit-learn batch matrix scoring.
- **Export Enriched Results**: Export classified transactions as CSV with appended predicted labels, fraud probabilities, and risk tiers.
- **Built-in Sample Download**: Includes direct download of a 100-row sample CSV for immediate examiner testing.

### 4. Empirical Model Performance & Benchmarking
- **Real Test Set Evaluation**: Performance metrics computed strictly on 56,962 held-out test transactions (never fabricated).
- **Interactive Confusion Matrix Visualizer**: Toggle between Random Forest and Logistic Regression 2x2 grids (TN, FP, FN, TP).
- **ROC-AUC & PR-AUC Curves**: Interactive multi-threshold curve rendering.
- **Gini Feature Importance**: Displays the top 15 most discriminative PCA dimensions.

### 5. Academic Documentation & Capstone Thesis View
- Complete problem formulation, system workflow, data privacy compliance (GDPR/PCI-DSS), and future research directions (Graph Neural Networks, Apache Kafka, Autoencoders).

---

## Machine Learning Methodology & Genuine Results

### Dataset Specification
- **Corpus**: European Cardholders Credit Card Fraud Detection Dataset (Université Libre de Bruxelles).
- **Total Records**: 284,807 transactions.
- **Features**: 30 numerical inputs:
  - `Time`: Seconds elapsed from first transaction.
  - `V1` to `V28`: Principal Component Analysis (PCA) transformed components.
  - `Amount`: Monetary transaction value.
  - `Class`: Binary target (`0` = Genuine, `1` = Fraud).
- **Imbalance Ratio**: 284,315 Genuine (99.827%) vs 492 Fraud (0.173%).

### Data Preprocessing & Training Strategy
1. **Stratified Split**: 80% Training (227,845 records / 394 frauds) and 20% Testing (56,962 records / 98 frauds).
2. **Feature Normalization**: `StandardScaler` fitted on training set to ensure uniform scale for linear and tree models.
3. **Imbalance Remediation**:
   - Logistic Regression: Cost-sensitive `class_weight='balanced'`.
   - Random Forest: `class_weight='balanced_subsample'` with 100 estimators and max depth 12.

### Real Test Set Evaluation (56,962 Samples)

| Evaluation Metric | Logistic Regression (Balanced) | Random Forest Classifier (Winner) |
| :--- | :---: | :---: |
| **Accuracy** | 97.55% | **99.94%** |
| **Precision** | 6.10% | **84.21%** |
| **Recall (Sensitivity)** | **91.84%** | 81.63% |
| **F1-Score** | 11.44% | **82.90%** |
| **ROC-AUC** | 0.9721 | **0.9744** |
| **PR-AUC (Avg Precision)** | 0.7190 | **0.8303** |
| **True Negatives (TN)** | 55,478 | **56,849** |
| **False Positives (FP - False Alarms)** | 1,386 | **15** (98.9% reduction) |
| **False Negatives (FN - Missed Frauds)** | 8 | 18 |
| **True Positives (TP - Caught Frauds)** | 90 | 80 |

> **Conclusion**: The **Random Forest Classifier** was selected as the champion model. While Logistic Regression caught 10 additional frauds, it generated **1,386 false alarms** (unacceptable in real banking). Random Forest achieved an **82.90% F1-score** with only **15 false positives** across 56,864 genuine transactions.

---

## Technology Stack

```
Frontend:
├── React 18 (Vite Bundler)
├── Tailwind CSS 3 (Dark / Light Modern Styling)
├── Recharts 2 (Data Visualizations & Curves)
├── Lucide React (Financial Icons)
└── Canvas Confetti (UX Interaction)

Backend & Machine Learning:
├── Python 3.10+
├── Flask 3.0 & Flask-CORS (REST API)
├── Scikit-Learn 1.4+ (Ensemble Classification)
├── NumPy & Pandas (High-Throughput Vectorization)
├── Joblib (Model Serialization)
├── SQLite (Audit & Transaction History)
└── Gunicorn (Production WSGI Server)
```

---

## System Architecture & Project Structure

```
credit-card-fraud-classification/
├── backend/
│   ├── app.py                     # Main Flask REST API application
│   ├── database.py                # SQLite database interface & audit history
│   ├── train_model.py             # Full ML model training & evaluation pipeline
│   ├── test_api.py                # Automated REST API unit test suite
│   ├── requirements.txt           # Python dependencies
│   ├── Procfile                   # Cloud process execution command
│   ├── render.yaml                # Render Blueprint infrastructure spec
│   ├── .env.example               # Backend environment variables
│   └── model/
│       ├── best_model.joblib      # Serialized Random Forest model
│       ├── scaler.joblib          # Fitted StandardScaler pipeline
│       ├── metrics.json           # Real evaluation metrics & ROC coordinates
│       └── presets.json           # Verified simulation transaction vectors
├── frontend/
│   ├── index.html                 # HTML shell
│   ├── package.json               # Node.js dependencies & scripts
│   ├── vite.config.js             # Vite configuration with API proxy
│   ├── tailwind.config.js         # Tailwind theme & color extensions
│   ├── postcss.config.js          # PostCSS configuration
│   ├── vercel.json                # Vercel SPA routing & security headers
│   ├── .env.example               # Frontend environment template
│   └── src/
│       ├── main.jsx               # Application entry point
│       ├── App.jsx                # Router & main shell layout
│       ├── index.css              # Global styles, glassmorphism, scrollbars
│       ├── context/
│       │   └── ThemeContext.jsx   # Dark / Light theme provider
│       ├── services/
│       │   └── api.js             # REST API client
│       ├── components/
│       │   ├── Sidebar.jsx        # Navigation sidebar & model status
│       │   └── Navbar.jsx         # Header bar, theme switcher, quick actions
│       └── pages/
│           ├── Dashboard.jsx        # Executive financial metrics & charts
│           ├── FraudPrediction.jsx  # Single transaction scoring & XAI
│           ├── BatchAnalysis.jsx    # CSV batch upload & analysis
│           ├── ModelPerformance.jsx # ROC curves, metrics & confusion matrix
│           └── AboutProject.jsx     # B.Tech CSE thesis documentation
├── dataset/
│   ├── sample_test_transactions.csv # 100 verified test rows (75 genuine, 25 fraud)
│   └── batch_prediction_sample.csv  # 100 blind rows for batch upload testing
├── .gitignore                     # Git ignore rules
└── README.md                      # Comprehensive project documentation
```

---

## Local Installation & Setup Guide

### Prerequisites
- **Python**: Version 3.10, 3.11, 3.12, 3.13, or 3.14
- **Node.js**: Version 18.0.0 or higher
- **Git**

---

### Step 1: Clone the Repository
```bash
git clone https://github.com/your-username/credit-card-fraud-classification.git
cd credit-card-fraud-classification
```

---

### Step 2: Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. (Optional) Create and activate a virtual environment:
   ```bash
   python -m venv venv
   # On Windows:
   venv\Scripts\activate
   # On macOS/Linux:
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Verify pre-trained model artifacts exist in `backend/model/`:
   ```bash
   ls model/
   # Should list: best_model.joblib, scaler.joblib, metrics.json, presets.json
   ```
   *(Note: Pre-trained models are already included in the repository. If you ever wish to re-train from the full 150MB dataset, run `python train_model.py`)*.
5. Start the backend development server:
   ```bash
   python app.py
   ```
   *The REST API will launch at `http://localhost:5000` with CORS enabled.*

---

### Step 3: Frontend Setup
1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install frontend dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

---

## Running Automated Tests

A comprehensive unit test suite is included in `backend/test_api.py`. It tests all API endpoints, single predictions, batch uploads, and database persistence:

```bash
cd backend
python test_api.py
```

Expected output:
```
Ran 9 tests in 0.440s
OK
[PASS] GET /health returned healthy status and loaded models
[PASS] GET /model-metrics returned real evaluation metrics (RF F1: 82.90%)
[PASS] GET /presets returned genuine and fraud simulation features
[PASS] POST /predict for genuine transaction: Genuine (Genuine Prob: 99.99%)
[PASS] POST /predict for fraudulent transaction: Fraudulent (Fraud Prob: 99.97%, Risk: High)
[PASS] POST /predict-batch (JSON) verified: 1 Genuine, 1 Fraud processed
[PASS] POST /predict-batch (CSV) processed 100 transactions: Genuine=76, Fraud=24
[PASS] GET /history and GET /summary returned valid metrics
[PASS] GET /sample-csv served valid downloadable CSV
```

To verify the frontend build:
```bash
cd frontend
npm run build
```

---

## Live Cloud Deployment Guide

The application is structured for instant, zero-cost cloud deployment on **Render** (Backend) and **Vercel** (Frontend).

### A. Deploying Backend to Render

1. Sign up or log in at [Render.com](https://render.com/).
2. Click **New +** &rarr; **Web Service**.
3. Connect your GitHub repository.
4. Configure the Web Service settings:
   - **Name**: `credit-card-fraud-backend`
   - **Root Directory**: `backend`
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn app:app --bind 0.0.0.0:$PORT --workers 2 --timeout 120`
   - **Instance Type**: `Free`
5. Under **Environment Variables**, add:
   - `FLASK_ENV` = `production`
   - `CORS_ORIGINS` = `*`
6. Click **Deploy Web Service**.
7. Once deployment finishes, copy your live backend URL (e.g., `https://credit-card-fraud-backend.onrender.com`).
8. Test the health endpoint: `https://credit-card-fraud-backend.onrender.com/health`.

---

### B. Deploying Frontend to Vercel

1. Sign up or log in at [Vercel.com](https://vercel.com/).
2. Click **Add New...** &rarr; **Project**.
3. Import your GitHub repository.
4. In the Project Configuration:
   - **Framework Preset**: `Vite`
   - **Root Directory**: Click Edit and select `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. In **Environment Variables**, add:
   - **Key**: `VITE_API_URL`
   - **Value**: Your Render backend URL (e.g. `https://credit-card-fraud-backend.onrender.com`)
6. Click **Deploy**.
7. Your live financial dashboard will be deployed to a `https://<your-project>.vercel.app` domain with full SSL and global CDN caching!

---

## Academic Presentation & Viva Guide

Common questions asked by university external examiners during project evaluations:

### Q1: Why did you choose Random Forest over Logistic Regression?
**Answer**: In fraud detection, feature interactions are non-linear (e.g. a high transaction amount in conjunction with negative V14 and positive V4 indicates fraud, whereas high amount alone may be legitimate). Logistic Regression produced 1,386 false positives on the test set, leading to an F1-score of only 11.44%. Random Forest achieved an **82.90% F1-score** with only **15 false positives**, proving far superior in balancing precision and recall.

### Q2: Why is Accuracy an inappropriate metric for this dataset?
**Answer**: With 99.827% genuine transactions and only 0.173% fraud, a baseline model predicting 0 for all inputs achieves 99.83% accuracy while failing 100% of frauds. We prioritized **F1-Score**, **Recall (Sensitivity)**, **Precision-Recall AUC (PR-AUC)**, and **ROC-AUC** to measure true detection capability.

### Q3: Why are features named V1 through V28?
**Answer**: Due to banking privacy and financial security compliance (PCI-DSS and GDPR), the original payment features (card numbers, merchant categories, customer locations) were transformed using **Principal Component Analysis (PCA)**. The components `V1` to `V28` represent the orthogonal eigenvectors capturing maximum variance while preserving privacy.

### Q4: How is class imbalance handled during training?
**Answer**: In Random Forest, we used `class_weight='balanced_subsample'`, which dynamically weights samples inversely proportional to class frequencies on each bootstrap sample of trees. In Logistic Regression, we used `class_weight='balanced'`. Additionally, **stratified splitting** was employed to ensure identical fraud ratios in train and test splits.

### Q5: How is this system secured in production?
**Answer**: 
1. Zero storage of PAN/CVV or plaintext cardholder data.
2. Anonymized prediction tokens (`transaction_id`) in SQLite.
3. Strict CSV size limits (16 MB / 10,000 rows max).
4. Sanitized numerical validation on all 30 features.
5. Strict CORS header policies and HTTPS enforcement.

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

Developed for B.Tech Computer Science Engineering Final Year Project &copy; 2026.
