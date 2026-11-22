"""
Automated Backend API Test Suite
Verifies all REST API endpoints, prediction pipeline, and SQLite database storage.
"""

import os
import json
import io
import unittest
from app import app, FEATURE_COLUMNS

class BackendApiTests(unittest.TestCase):
    def setUp(self):
        self.client = app.test_client()
        self.client.testing = True

    def test_01_health_endpoint(self):
        res = self.client.get('/health')
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertEqual(data.get('status'), 'healthy')
        self.assertTrue(data.get('model_loaded'))
        self.assertTrue(data.get('scaler_loaded'))
        print("[PASS] GET /health returned healthy status and loaded models")

    def test_02_model_metrics(self):
        res = self.client.get('/model-metrics')
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertIn('models', data)
        self.assertIn('random_forest', data['models'])
        self.assertIn('logistic_regression', data['models'])
        self.assertIn('top_features', data)
        self.assertIn('roc_curve', data)
        rf_f1 = data['models']['random_forest']['f1_score']
        self.assertGreater(rf_f1, 0.70)
        print(f"[PASS] GET /model-metrics returned real evaluation metrics (RF F1: {rf_f1*100:.2f}%)")

    def test_03_presets(self):
        res = self.client.get('/presets')
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertIn('genuine', data)
        self.assertIn('fraud', data)
        self.assertEqual(len(data['genuine']), 30)
        self.assertEqual(len(data['fraud']), 30)
        print("[PASS] GET /presets returned genuine and fraud simulation features")

    def test_04_predict_single_genuine(self):
        # Fetch genuine preset
        presets_res = self.client.get('/presets')
        genuine_data = presets_res.get_json()['genuine']
        genuine_data['transaction_id'] = 'TEST-GENUINE-001'
        
        res = self.client.post('/predict', json=genuine_data)
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertEqual(data['prediction'], 'Genuine')
        self.assertFalse(data['is_fraud'])
        self.assertIn('risk_level', data)
        self.assertIn('explanation', data)
        print(f"[PASS] POST /predict for genuine transaction: {data['prediction']} (Genuine Prob: {data['genuine_probability_percent']}%)")

    def test_05_predict_single_fraud(self):
        # Fetch fraud preset
        presets_res = self.client.get('/presets')
        fraud_data = presets_res.get_json()['fraud']
        fraud_data['transaction_id'] = 'TEST-FRAUD-001'
        
        res = self.client.post('/predict', json=fraud_data)
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertEqual(data['prediction'], 'Fraudulent')
        self.assertTrue(data['is_fraud'])
        self.assertEqual(data['risk_level'], 'High')
        self.assertGreater(data['fraud_probability'], 0.50)
        print(f"[PASS] POST /predict for fraudulent transaction: {data['prediction']} (Fraud Prob: {data['fraud_probability_percent']}%, Risk: {data['risk_level']})")

    def test_06_predict_batch_json(self):
        presets_res = self.client.get('/presets')
        presets = presets_res.get_json()
        batch = [
            dict(presets['genuine'], transaction_id='BATCH-TEST-1'),
            dict(presets['fraud'], transaction_id='BATCH-TEST-2')
        ]
        
        res = self.client.post('/predict-batch', json=batch)
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertIn('summary', data)
        self.assertEqual(data['summary']['total_processed'], 2)
        self.assertEqual(data['summary']['genuine_count'], 1)
        self.assertEqual(data['summary']['fraud_count'], 1)
        self.assertEqual(len(data['results']), 2)
        print(f"[PASS] POST /predict-batch (JSON) verified: 1 Genuine, 1 Fraud processed")

    def test_07_predict_batch_csv(self):
        csv_path = os.path.join(os.path.dirname(__file__), "..", "dataset", "batch_prediction_sample.csv")
        self.assertTrue(os.path.exists(csv_path), "Sample CSV file should exist")
        
        with open(csv_path, 'rb') as f:
            csv_bytes = f.read()
            
        data = {'file': (io.BytesIO(csv_bytes), 'test_batch.csv')}
        res = self.client.post('/predict-batch', data=data, content_type='multipart/form-data')
            
        self.assertEqual(res.status_code, 200)
        res_data = res.get_json()
        self.assertIn('summary', res_data)
        self.assertEqual(res_data['summary']['total_processed'], 100)
        print(f"[PASS] POST /predict-batch (CSV) processed 100 transactions: Genuine={res_data['summary']['genuine_count']}, Fraud={res_data['summary']['fraud_count']}")

    def test_08_history_and_summary(self):
        hist_res = self.client.get('/history')
        self.assertEqual(hist_res.status_code, 200)
        hist_data = hist_res.get_json()
        self.assertGreater(hist_data['count'], 0)
        
        sum_res = self.client.get('/summary')
        self.assertEqual(sum_res.status_code, 200)
        sum_data = sum_res.get_json()
        self.assertIn('live_predictions', sum_data)
        self.assertIn('dataset_baseline', sum_data)
        print(f"[PASS] GET /history and GET /summary returned valid metrics (Total recorded: {sum_data['live_predictions']['total_predictions']})")

    def test_09_sample_csv_download(self):
        res = self.client.get('/sample-csv')
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.mimetype, 'text/csv')
        self.assertGreater(len(res.data), 1000)
        print(f"[PASS] GET /sample-csv served valid downloadable CSV ({len(res.data)} bytes)")

if __name__ == '__main__':
    unittest.main()
