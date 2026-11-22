"""
Database Layer for Credit Card Fraud Classification System
Uses SQLite to securely record prediction history without storing any sensitive cardholder information.
"""

import sqlite3
import os
from datetime import datetime, timezone

DB_PATH = os.path.join(os.path.dirname(__file__), "fraud_history.db")

def get_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS prediction_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            transaction_id TEXT UNIQUE NOT NULL,
            prediction TEXT NOT NULL,
            is_fraud INTEGER NOT NULL,
            fraud_probability REAL NOT NULL,
            genuine_probability REAL NOT NULL,
            risk_level TEXT NOT NULL,
            amount REAL,
            time_val REAL,
            timestamp TEXT NOT NULL
        )
    """)
    conn.commit()
    conn.close()

def insert_prediction(transaction_id, prediction, is_fraud, fraud_prob, genuine_prob, risk_level, amount=0.0, time_val=0.0):
    conn = get_connection()
    cursor = conn.cursor()
    now = datetime.now(timezone.utc).isoformat()
    cursor.execute("""
        INSERT OR REPLACE INTO prediction_history (
            transaction_id, prediction, is_fraud, fraud_probability, genuine_probability, risk_level, amount, time_val, timestamp
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (transaction_id, prediction, int(is_fraud), round(fraud_prob, 4), round(genuine_prob, 4), risk_level, round(amount, 2), round(time_val, 2), now))
    conn.commit()
    conn.close()

def insert_batch_predictions(records):
    """Batch insert a list of prediction records."""
    if not records:
        return
    conn = get_connection()
    cursor = conn.cursor()
    cursor.executemany("""
        INSERT OR REPLACE INTO prediction_history (
            transaction_id, prediction, is_fraud, fraud_probability, genuine_probability, risk_level, amount, time_val, timestamp
        ) VALUES (:transaction_id, :prediction, :is_fraud, :fraud_probability, :genuine_probability, :risk_level, :amount, :time_val, :timestamp)
    """, records)
    conn.commit()
    conn.close()

def get_history(limit=50):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT transaction_id, prediction, is_fraud, fraud_probability, genuine_probability, risk_level, amount, time_val, timestamp
        FROM prediction_history
        ORDER BY id DESC
        LIMIT ?
    """, (limit,))
    rows = [dict(r) for r in cursor.fetchall()]
    conn.close()
    return rows

def get_summary_stats():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT COUNT(*) as total FROM prediction_history")
    total = cursor.fetchone()['total']
    
    cursor.execute("SELECT COUNT(*) as fraud_count FROM prediction_history WHERE is_fraud = 1")
    fraud_count = cursor.fetchone()['fraud_count']
    
    genuine_count = total - fraud_count
    fraud_rate = (fraud_count / total * 100) if total > 0 else 0.0
    
    conn.close()
    return {
        "total_predictions": total,
        "genuine_predictions": genuine_count,
        "fraud_predictions": fraud_count,
        "fraud_rate": round(fraud_rate, 2)
    }

def clear_history():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM prediction_history")
    conn.commit()
    conn.close()

# Initialize database schema on load
init_db()
