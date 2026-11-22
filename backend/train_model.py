"""
Credit Card Fraud Classification - Model Training Pipeline
Trains Logistic Regression and Random Forest models on the European Credit Card Fraud dataset.
Calculates REAL evaluation metrics, saves trained models, scaler, and metrics metadata.
"""

import os
import json
import joblib
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    roc_auc_score,
    average_precision_score,
    confusion_matrix,
    classification_report,
    roc_curve,
    precision_recall_curve
)

def train_and_evaluate():
    dataset_path = os.path.join(os.path.dirname(__file__), "..", "dataset", "creditcard.csv")
    model_dir = os.path.join(os.path.dirname(__file__), "model")
    os.makedirs(model_dir, exist_ok=True)
    
    print("=" * 60)
    print("CREDIT CARD FRAUD DETECTION - MODEL TRAINING")
    print("=" * 60)
    print(f"Loading dataset from: {dataset_path}")
    
    if not os.path.exists(dataset_path):
        raise FileNotFoundError(f"Dataset not found at {dataset_path}")
        
    df = pd.read_csv(dataset_path)
    total_samples = len(df)
    fraud_samples = int(df['Class'].sum())
    genuine_samples = total_samples - fraud_samples
    fraud_percentage = (fraud_samples / total_samples) * 100
    
    print(f"Total Transactions: {total_samples:,}")
    print(f"Genuine Transactions: {genuine_samples:,} ({(genuine_samples/total_samples)*100:.2f}%)")
    print(f"Fraudulent Transactions: {fraud_samples:,} ({fraud_percentage:.3f}%)")
    
    # Check missing values
    missing_count = int(df.isnull().sum().sum())
    print(f"Missing values count: {missing_count}")
    if missing_count > 0:
        df = df.dropna()
        
    # Feature columns (30 features: Time, V1-V28, Amount)
    feature_cols = [c for c in df.columns if c != 'Class']
    X = df[feature_cols]
    y = df['Class']
    
    print(f"Feature count: {len(feature_cols)} ({feature_cols[0]} ... {feature_cols[-1]})")
    
    # Stratified Train/Test split (80% train, 20% test)
    print("\nPerforming Stratified Train-Test Split (80/20)...")
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    
    print(f"Training set: {len(X_train):,} samples (Frauds: {int(y_train.sum())})")
    print(f"Testing set:  {len(X_test):,} samples (Frauds: {int(y_test.sum())})")
    
    # Preprocessing with StandardScaler
    print("\nFitting StandardScaler on training data...")
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    # Model 1: Logistic Regression with balanced class weighting
    print("\n[1/2] Training Logistic Regression (class_weight='balanced')...")
    lr_model = LogisticRegression(
        max_iter=1000,
        class_weight='balanced',
        solver='lbfgs',
        random_state=42
    )
    lr_model.fit(X_train_scaled, y_train)
    
    # Evaluate Logistic Regression
    lr_y_pred = lr_model.predict(X_test_scaled)
    lr_y_proba = lr_model.predict_proba(X_test_scaled)[:, 1]
    
    lr_acc = float(accuracy_score(y_test, lr_y_pred))
    lr_prec = float(precision_score(y_test, lr_y_pred, zero_division=0))
    lr_rec = float(recall_score(y_test, lr_y_pred))
    lr_f1 = float(f1_score(y_test, lr_y_pred))
    lr_roc = float(roc_auc_score(y_test, lr_y_proba))
    lr_pr_auc = float(average_precision_score(y_test, lr_y_proba))
    lr_cm = confusion_matrix(y_test, lr_y_pred).tolist()
    
    print(f"  Logistic Regression Results:")
    print(f"    Accuracy:  {lr_acc*100:.2f}%")
    print(f"    Precision: {lr_prec*100:.2f}%")
    print(f"    Recall:    {lr_rec*100:.2f}%")
    print(f"    F1 Score:  {lr_f1*100:.2f}%")
    print(f"    ROC-AUC:   {lr_roc:.4f}")
    print(f"    PR-AUC:    {lr_pr_auc:.4f}")
    print(f"    Confusion Matrix: {lr_cm}")
    
    # Model 2: Random Forest Classifier with balanced subsampling
    print("\n[2/2] Training Random Forest Classifier (n_estimators=100, max_depth=12)...")
    rf_model = RandomForestClassifier(
        n_estimators=100,
        max_depth=12,
        class_weight='balanced_subsample',
        random_state=42,
        n_jobs=-1
    )
    rf_model.fit(X_train_scaled, y_train)
    
    # Evaluate Random Forest
    rf_y_pred = rf_model.predict(X_test_scaled)
    rf_y_proba = rf_model.predict_proba(X_test_scaled)[:, 1]
    
    rf_acc = float(accuracy_score(y_test, rf_y_pred))
    rf_prec = float(precision_score(y_test, rf_y_pred, zero_division=0))
    rf_rec = float(recall_score(y_test, rf_y_pred))
    rf_f1 = float(f1_score(y_test, rf_y_pred))
    rf_roc = float(roc_auc_score(y_test, rf_y_proba))
    rf_pr_auc = float(average_precision_score(y_test, rf_y_proba))
    rf_cm = confusion_matrix(y_test, rf_y_pred).tolist()
    
    print(f"  Random Forest Results:")
    print(f"    Accuracy:  {rf_acc*100:.2f}%")
    print(f"    Precision: {rf_prec*100:.2f}%")
    print(f"    Recall:    {rf_rec*100:.2f}%")
    print(f"    F1 Score:  {rf_f1*100:.2f}%")
    print(f"    ROC-AUC:   {rf_roc:.4f}")
    print(f"    PR-AUC:    {rf_pr_auc:.4f}")
    print(f"    Confusion Matrix: {rf_cm}")
    
    # Select Best Model based on F1 Score and PR-AUC (key metrics for fraud detection)
    if rf_f1 >= lr_f1:
        best_model_name = "Random Forest"
        best_model = rf_model
        best_metrics = {
            "accuracy": rf_acc,
            "precision": rf_prec,
            "recall": rf_rec,
            "f1_score": rf_f1,
            "roc_auc": rf_roc,
            "pr_auc": rf_pr_auc,
            "confusion_matrix": {
                "tn": rf_cm[0][0],
                "fp": rf_cm[0][1],
                "fn": rf_cm[1][0],
                "tp": rf_cm[1][1]
            }
        }
    else:
        best_model_name = "Logistic Regression"
        best_model = lr_model
        best_metrics = {
            "accuracy": lr_acc,
            "precision": lr_prec,
            "recall": lr_rec,
            "f1_score": lr_f1,
            "roc_auc": lr_roc,
            "pr_auc": lr_pr_auc,
            "confusion_matrix": {
                "tn": lr_cm[0][0],
                "fp": lr_cm[0][1],
                "fn": lr_cm[1][0],
                "tp": lr_cm[1][1]
            }
        }
    print(f"\n=> Best Model Selected: {best_model_name} (F1 Score: {best_metrics['f1_score']*100:.2f}%)")
    
    # Feature Importances from Random Forest
    rf_importances = rf_model.feature_importances_
    top_features_idx = np.argsort(rf_importances)[::-1]
    top_features = [
        {"feature": feature_cols[i], "importance": round(float(rf_importances[i]), 5)}
        for i in top_features_idx[:15]
    ]
    
    # ROC Curves (downsampled to ~35 points for efficient frontend charting)
    rf_fpr, rf_tpr, _ = roc_curve(y_test, rf_y_proba)
    lr_fpr, lr_tpr, _ = roc_curve(y_test, lr_y_proba)
    
    def downsample_curve(fpr, tpr, n_points=35):
        indices = np.linspace(0, len(fpr) - 1, n_points).astype(int)
        return [{"fpr": round(float(fpr[i]), 4), "tpr": round(float(tpr[i]), 4)} for i in indices]
        
    roc_curve_data = {
        "random_forest": downsample_curve(rf_fpr, rf_tpr),
        "logistic_regression": downsample_curve(lr_fpr, lr_tpr)
    }
    
    # Save Artifacts
    print("\nSaving model artifacts to disk...")
    scaler_path = os.path.join(model_dir, "scaler.joblib")
    best_model_path = os.path.join(model_dir, "best_model.joblib")
    lr_path = os.path.join(model_dir, "logistic_regression.joblib")
    rf_path = os.path.join(model_dir, "random_forest.joblib")
    metrics_path = os.path.join(model_dir, "metrics.json")
    
    joblib.dump(scaler, scaler_path)
    joblib.dump(best_model, best_model_path)
    joblib.dump(lr_model, lr_path)
    joblib.dump(rf_model, rf_path)
    
    metadata = {
        "dataset_summary": {
            "total_transactions": total_samples,
            "genuine_transactions": genuine_samples,
            "fraud_transactions": fraud_samples,
            "fraud_percentage": round(fraud_percentage, 3),
            "features_count": len(feature_cols),
            "test_size": len(X_test),
            "train_size": len(X_train)
        },
        "best_model": best_model_name,
        "models": {
            "logistic_regression": {
                "name": "Logistic Regression",
                "accuracy": round(lr_acc, 4),
                "precision": round(lr_prec, 4),
                "recall": round(lr_rec, 4),
                "f1_score": round(lr_f1, 4),
                "roc_auc": round(lr_roc, 4),
                "pr_auc": round(lr_pr_auc, 4),
                "confusion_matrix": {
                    "tn": lr_cm[0][0],
                    "fp": lr_cm[0][1],
                    "fn": lr_cm[1][0],
                    "tp": lr_cm[1][1]
                }
            },
            "random_forest": {
                "name": "Random Forest Classifier",
                "accuracy": round(rf_acc, 4),
                "precision": round(rf_prec, 4),
                "recall": round(rf_rec, 4),
                "f1_score": round(rf_f1, 4),
                "roc_auc": round(rf_roc, 4),
                "pr_auc": round(rf_pr_auc, 4),
                "confusion_matrix": {
                    "tn": rf_cm[0][0],
                    "fp": rf_cm[0][1],
                    "fn": rf_cm[1][0],
                    "tp": rf_cm[1][1]
                }
            }
        },
        "top_features": top_features,
        "roc_curve": roc_curve_data,
        "feature_columns": feature_cols
    }
    
    with open(metrics_path, "w", encoding="utf-8") as f:
        json.dump(metadata, f, indent=2)
        
    print(f"Saved: {scaler_path}")
    print(f"Saved: {best_model_path}")
    print(f"Saved: {metrics_path}")
    
    # Create sample testing CSV files for the frontend user
    dataset_dir = os.path.dirname(dataset_path)
    
    # 1. Sample transactions with mix of genuine and fraud for testing
    sample_fraud = df[df['Class'] == 1].sample(n=min(25, fraud_samples), random_state=42)
    sample_genuine = df[df['Class'] == 0].sample(n=75, random_state=42)
    sample_combined = pd.concat([sample_genuine, sample_fraud]).sample(frac=1.0, random_state=42).reset_index(drop=True)
    
    sample_csv_path = os.path.join(dataset_dir, "sample_test_transactions.csv")
    sample_combined.to_csv(sample_csv_path, index=False)
    print(f"Created sample test CSV: {sample_csv_path} (100 rows: 75 genuine, 25 fraud)")
    
    # 2. Batch input CSV (without Class column for blind prediction testing)
    batch_csv_path = os.path.join(dataset_dir, "batch_prediction_sample.csv")
    sample_combined[feature_cols].to_csv(batch_csv_path, index=False)
    print(f"Created blind batch test CSV: {batch_csv_path} (100 rows)")
    
    # 3. Create a clean preset JSON with 1 known genuine and 1 known fraud for the frontend simulation buttons
    presets = {
        "genuine": df[df['Class'] == 0].iloc[100][feature_cols].to_dict(),
        "fraud": df[df['Class'] == 1].iloc[10][feature_cols].to_dict()
    }
    presets_path = os.path.join(model_dir, "presets.json")
    with open(presets_path, "w", encoding="utf-8") as f:
        json.dump(presets, f, indent=2)
    print(f"Created sample presets JSON: {presets_path}")
    
    print("\nTraining and evaluation pipeline completed successfully!")

if __name__ == "__main__":
    train_and_evaluate()
