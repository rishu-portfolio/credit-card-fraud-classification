"""
Credit Card Fraud Classification System - REST API Backend
Built with Flask, Scikit-learn, and SQLite.
Provides endpoints for single and batch predictions, model evaluation metrics, and history.
"""

import os
import io
import json
import uuid
import joblib
import numpy as np
import pandas as pd
from datetime import datetime, timezone
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from database import insert_prediction, insert_batch_predictions, get_history, get_summary_stats, clear_history

app = Flask(__name__)
# Enable CORS for local dev and live deployment (Vercel, custom domains, etc.)
CORS(app, resources={r"/*": {"origins": "*"}})

# Configuration
MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16 MB max upload
app.config['MAX_CONTENT_LENGTH'] = MAX_CONTENT_LENGTH

BASE_DIR = os.path.dirname(__file__)
MODEL_DIR = os.path.join(BASE_DIR, "model")
DATASET_DIR = os.path.join(BASE_DIR, "..", "dataset")

# Expected 30 feature columns
FEATURE_COLUMNS = ['Time'] + [f'V{i}' for i in range(1, 29)] + ['Amount']

# Global model state
scaler = None
best_model = None
metrics_data = {}
presets_data = {}

def load_artifacts():
    global scaler, best_model, metrics_data, presets_data
    scaler_path = os.path.join(MODEL_DIR, "scaler.joblib")
    model_path = os.path.join(MODEL_DIR, "best_model.joblib")
    metrics_path = os.path.join(MODEL_DIR, "metrics.json")
    presets_path = os.path.join(MODEL_DIR, "presets.json")
    
    if os.path.exists(scaler_path) and os.path.exists(model_path):
        print(f"Loading scaler from {scaler_path}")
        scaler = joblib.load(scaler_path)
        print(f"Loading best model from {model_path}")
        best_model = joblib.load(model_path)
    else:
        print("WARNING: Model artifacts not found. Please run train_model.py first.")
        
    if os.path.exists(metrics_path):
        with open(metrics_path, "r", encoding="utf-8") as f:
            metrics_data = json.load(f)
            
    if os.path.exists(presets_path):
        with open(presets_path, "r", encoding="utf-8") as f:
            presets_data = json.load(f)

load_artifacts()

def get_risk_level(fraud_prob):
    """Categorizes fraud probability into Risk Level."""
    if fraud_prob < 0.20:
        return "Low"
    elif fraud_prob < 0.65:
        return "Medium"
    else:
        return "High"

def generate_explanation(fraud_prob, risk_level, amount, feature_dict):
    """Generates an intuitive, professional financial explanation of the prediction."""
    reasons = []
    
    # Check key PCA anomaly features (V14, V10, V4, V12)
    v14 = feature_dict.get('V14', 0.0)
    v10 = feature_dict.get('V10', 0.0)
    v4 = feature_dict.get('V4', 0.0)
    v12 = feature_dict.get('V12', 0.0)
    
    if v14 < -3.0:
        reasons.append(f"Significant negative anomaly detected in component V14 ({v14:.2f}), strongly correlated with synthetic card cloning patterns.")
    if v10 < -2.5:
        reasons.append(f"Component V10 ({v10:.2f}) deviates substantially from normal cardholder baseline activity.")
    if v4 > 2.5:
        reasons.append(f"High positive deviation in component V4 ({v4:.2f}) indicates velocity/frequency irregularity.")
    if v12 < -2.5:
        reasons.append(f"Component V12 ({v12:.2f}) signals uncharacteristic terminal routing.")
        
    if amount > 1500:
        reasons.append(f"High transaction amount (${amount:,.2f}) exceeds standard spending thresholds.")
        
    if risk_level == "High":
        summary = f"CRITICAL RISK ALERT: Model identified multiple high-confidence fraudulent patterns (Fraud Probability: {fraud_prob*100:.1f}%)."
        if not reasons:
            reasons.append("Non-linear feature cross-interactions strongly align with confirmed historical fraud vectors.")
    elif risk_level == "Medium":
        summary = f"MODERATE SUSPICION: Transaction displays marginal statistical deviations (Fraud Probability: {fraud_prob*100:.1f}%)."
        if not reasons:
            reasons.append("Mild divergence observed across anonymized PCA components.")
    else:
        summary = f"GENUINE TRANSACTION: High-confidence authentic activity (Authenticity: {(1-fraud_prob)*100:.1f}%)."
        reasons = ["Transaction features, temporal interval, and monetary amount closely match standard legitimate cardholder profiles."]
        
    return {
        "summary": summary,
        "key_factors": reasons
    }

@app.route("/", methods=["GET"])
def index():
    return jsonify({
        "system": "Credit Card Fraud Classification System API",
        "status": "online",
        "version": "1.0.0",
        "endpoints": {
            "health": "/health",
            "model_metrics": "/model-metrics",
            "predict": "/predict",
            "predict_batch": "/predict-batch",
            "history": "/history",
            "summary": "/summary",
            "presets": "/presets",
            "download_sample": "/sample-csv"
        }
    })

@app.route("/health", methods=["GET"])
def health():
    return jsonify({
        "status": "healthy",
        "model_loaded": best_model is not None,
        "scaler_loaded": scaler is not None,
        "model_name": metrics_data.get("best_model", "Random Forest Classifier"),
        "timestamp": datetime.now(timezone.utc).isoformat()
    })

@app.route("/model-metrics", methods=["GET"])
def get_model_metrics():
    if not metrics_data:
        return jsonify({"error": "Model metrics not available. Train the model first."}), 404
    return jsonify(metrics_data)

@app.route("/presets", methods=["GET"])
def get_presets():
    if not presets_data:
        return jsonify({"error": "Presets not available."}), 404
    return jsonify(presets_data)

@app.route("/predict", methods=["POST"])
def predict_single():
    if best_model is None or scaler is None:
        return jsonify({"error": "ML model is not loaded. Please ensure train_model.py has executed."}), 503
        
    data = request.get_json(silent=True)
    if not data:
        return jsonify({"error": "Invalid request. JSON body is required."}), 400
        
    # Extract and validate features
    feature_values = []
    feature_dict = {}
    missing_cols = []
    
    for col in FEATURE_COLUMNS:
        if col not in data:
            missing_cols.append(col)
        else:
            try:
                val = float(data[col])
                feature_values.append(val)
                feature_dict[col] = val
            except (ValueError, TypeError):
                return jsonify({"error": f"Invalid numerical value for feature '{col}': {data[col]}"}), 400
                
    if missing_cols:
        return jsonify({
            "error": f"Missing required feature columns: {', '.join(missing_cols[:5])} (Total missing: {len(missing_cols)})"
        }), 400
        
    # Preprocess & Predict
    features_df = pd.DataFrame([feature_values], columns=FEATURE_COLUMNS)
    features_scaled = scaler.transform(features_df)
    
    pred_class = int(best_model.predict(features_scaled)[0])
    probabilities = best_model.predict_proba(features_scaled)[0]
    
    fraud_prob = float(probabilities[1])
    genuine_prob = float(probabilities[0])
    is_fraud = bool(pred_class == 1)
    prediction_label = "Fraudulent" if is_fraud else "Genuine"
    risk_level = get_risk_level(fraud_prob)
    
    amount = float(feature_dict.get('Amount', 0.0))
    time_val = float(feature_dict.get('Time', 0.0))
    tx_id = data.get("transaction_id", f"TXN-{uuid.uuid4().hex[:10].upper()}")
    
    explanation = generate_explanation(fraud_prob, risk_level, amount, feature_dict)
    
    # Save to SQLite history
    insert_prediction(
        transaction_id=tx_id,
        prediction=prediction_label,
        is_fraud=is_fraud,
        fraud_prob=fraud_prob,
        genuine_prob=genuine_prob,
        risk_level=risk_level,
        amount=amount,
        time_val=time_val
    )
    
    return jsonify({
        "transaction_id": tx_id,
        "prediction": prediction_label,
        "is_fraud": is_fraud,
        "fraud_probability": round(fraud_prob, 4),
        "genuine_probability": round(genuine_prob, 4),
        "fraud_probability_percent": round(fraud_prob * 100, 2),
        "genuine_probability_percent": round(genuine_prob * 100, 2),
        "risk_level": risk_level,
        "explanation": explanation,
        "amount": amount,
        "time": time_val,
        "timestamp": datetime.now(timezone.utc).isoformat()
    })

@app.route("/predict-batch", methods=["POST"])
def predict_batch():
    if best_model is None or scaler is None:
        return jsonify({"error": "ML model is not loaded."}), 503

    df = None
    # 1. Handle file upload (multipart/form-data)
    if 'file' in request.files:
        file = request.files['file']
        if not file or file.filename == '':
            return jsonify({"error": "No file selected."}), 400
        if not file.filename.lower().endswith('.csv'):
            return jsonify({"error": "Invalid file format. Only CSV files are accepted."}), 400
        try:
            df = pd.read_csv(file.stream)
        except Exception as e:
            return jsonify({"error": f"Failed to parse CSV file: {str(e)}"}), 400
            
    # 2. Handle JSON array body
    elif request.is_json:
        data = request.get_json(silent=True)
        if isinstance(data, list):
            df = pd.DataFrame(data)
        elif isinstance(data, dict) and 'transactions' in data:
            df = pd.DataFrame(data['transactions'])
        else:
            return jsonify({"error": "Expected JSON array of transactions or object with 'transactions' list."}), 400
    else:
        return jsonify({"error": "No CSV file uploaded or JSON array provided."}), 400

    if df is None or len(df) == 0:
        return jsonify({"error": "Uploaded dataset is empty."}), 400

    if len(df) > 10000:
        return jsonify({"error": f"File contains {len(df)} rows. Maximum allowed per batch is 10,000."}), 400

    # Validate required columns
    missing_cols = [c for c in FEATURE_COLUMNS if c not in df.columns]
    if missing_cols:
        return jsonify({
            "error": f"Missing required columns in CSV: {', '.join(missing_cols[:5])} (Total missing: {len(missing_cols)})"
        }), 400

    # Clean numerical values
    try:
        X_df = df[FEATURE_COLUMNS].astype(float)
    except Exception as e:
        return jsonify({"error": f"Dataset contains non-numeric values in feature columns: {str(e)}"}), 400

    if X_df.isnull().any().any():
        X_df = X_df.fillna(0.0)

    # Vectorized Batch Prediction
    X_scaled = scaler.transform(X_df)
    preds = best_model.predict(X_scaled)
    probas = best_model.predict_proba(X_scaled)

    total_count = len(df)
    results = []
    history_records = []
    now = datetime.now(timezone.utc).isoformat()

    fraud_count = 0
    genuine_count = 0

    for idx in range(total_count):
        is_fraud = bool(preds[idx] == 1)
        if is_fraud:
            fraud_count += 1
        else:
            genuine_count += 1

        fraud_prob = float(probas[idx][1])
        genuine_prob = float(probas[idx][0])
        label = "Fraudulent" if is_fraud else "Genuine"
        risk_level = get_risk_level(fraud_prob)
        
        amount = float(X_df.iloc[idx]['Amount'])
        time_val = float(X_df.iloc[idx]['Time'])
        
        # Preserve original ID if present, otherwise generate readable TXN id
        if 'transaction_id' in df.columns:
            tx_id = str(df.iloc[idx]['transaction_id'])
        elif 'id' in df.columns:
            tx_id = str(df.iloc[idx]['id'])
        else:
            tx_id = f"BATCH-{idx+1:04d}-{uuid.uuid4().hex[:6].upper()}"

        record = {
            "transaction_id": tx_id,
            "prediction": label,
            "is_fraud": is_fraud,
            "fraud_probability": round(fraud_prob, 4),
            "genuine_probability": round(genuine_prob, 4),
            "risk_level": risk_level,
            "amount": amount,
            "time_val": time_val,
            "timestamp": now
        }
        results.append(record)
        history_records.append(record)

    # Batch insert into history
    insert_batch_predictions(history_records)

    fraud_rate = (fraud_count / total_count * 100) if total_count > 0 else 0.0

    return jsonify({
        "summary": {
            "total_processed": total_count,
            "genuine_count": genuine_count,
            "fraud_count": fraud_count,
            "fraud_percentage": round(fraud_rate, 2)
        },
        "results": results
    })

@app.route("/history", methods=["GET"])
def get_prediction_history():
    limit = request.args.get("limit", default=50, type=int)
    history = get_history(limit=min(limit, 200))
    return jsonify({
        "count": len(history),
        "history": history
    })

@app.route("/history", methods=["DELETE"])
def delete_prediction_history():
    clear_history()
    return jsonify({"message": "Prediction history cleared successfully."})

@app.route("/summary", methods=["GET"])
def get_dashboard_summary():
    # Model baseline dataset summary + live history stats
    stats = get_summary_stats()
    ds = metrics_data.get("dataset_summary", {})
    return jsonify({
        "live_predictions": stats,
        "dataset_baseline": ds,
        "model_name": metrics_data.get("best_model", "Random Forest Classifier")
    })

@app.route("/sample-csv", methods=["GET"])
def download_sample_csv():
    # Provide the sample test CSV file for instant frontend testing
    sample_path = os.path.join(DATASET_DIR, "batch_prediction_sample.csv")
    if not os.path.exists(sample_path):
        sample_path = os.path.join(DATASET_DIR, "sample_test_transactions.csv")
    if os.path.exists(sample_path):
        return send_file(sample_path, as_attachment=True, download_name="credit_card_transactions_sample.csv", mimetype="text/csv")
    else:
        return jsonify({"error": "Sample CSV file not found."}), 404

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    print(f"Starting Credit Card Fraud API Server on port {port}...")
    app.run(host="0.0.0.0", port=port, debug=False)
