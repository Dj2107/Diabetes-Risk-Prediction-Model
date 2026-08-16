import os
import json
import random
import joblib
import pandas as pd
import numpy as np
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS

app = Flask(__name__, static_folder='frontend/dist', static_url_path='')
CORS(app)

# Global variables for model, scaler, and metrics
MODEL = None
SCALER = None
METRICS = None
MEDIANS = None
DATASET_DF = None

FEATURE_NAMES = [
    'Pregnancies', 'Glucose', 'BloodPressure', 'SkinThickness',
    'Insulin', 'BMI', 'DiabetesPedigreeFunction', 'Age'
]

FEATURE_LABELS = {
    'Pregnancies': 'Pregnancies',
    'Glucose': 'Glucose Level (mg/dL)',
    'BloodPressure': 'Blood Pressure (mmHg)',
    'SkinThickness': 'Skin Thickness (mm)',
    'Insulin': 'Insulin (mu U/ml)',
    'BMI': 'BMI (kg/m²)',
    'DiabetesPedigreeFunction': 'Diabetes Pedigree Function',
    'Age': 'Age (Years)'
}

def load_artifacts():
    global MODEL, SCALER, METRICS, MEDIANS, DATASET_DF
    try:
        MODEL = joblib.load('diabetes_logistic_regression_model.pkl')
        SCALER = joblib.load('diabetes_scaler.pkl')

        with open('model_metrics.json', 'r') as f:
            METRICS = json.load(f)

        with open('imputer_medians.json', 'r') as f:
            MEDIANS = json.load(f)

        csv_path = 'diabetesdataset (1).csv' if os.path.exists('diabetesdataset (1).csv') else 'diabetesdataset.csv'
        if os.path.exists(csv_path):
            DATASET_DF = pd.read_csv(csv_path)

        print("Backend artifacts loaded successfully!")
    except Exception as e:
        print(f"Error loading artifacts: {e}")

load_artifacts()

def preprocess_patient_data(data_dict):
    """Clean patient record by replacing invalid 0 values with medians"""
    cleaned = {}
    for feat in FEATURE_NAMES:
        val = float(data_dict.get(feat, 0))
        if feat in ['Glucose', 'BloodPressure', 'SkinThickness', 'Insulin', 'BMI'] and val <= 0:
            val = float(MEDIANS.get(feat, 120.0))
        cleaned[feat] = val
    return cleaned

def calculate_factor_impacts(cleaned_data, scaled_data):
    """Calculate how much each feature pushes risk up or down for this patient"""
    impacts = []
    if MODEL is None or SCALER is None or METRICS is None:
        return impacts

    coefs = MODEL.coef_[0]
    means = SCALER.mean_
    stds = SCALER.scale_

    for i, feat in enumerate(FEATURE_NAMES):
        val = cleaned_data[feat]
        mean_val = float(means[i])
        std_val = float(stds[i]) if stds[i] != 0 else 1.0
        coef_val = float(coefs[i])

        z_score = (val - mean_val) / std_val
        contribution = coef_val * z_score  # Positive means increases risk, negative means decreases

        impacts.append({
            'feature': feat,
            'label': FEATURE_LABELS.get(feat, feat),
            'value': round(val, 2),
            'median': float(MEDIANS.get(feat, round(mean_val, 2))) if feat in MEDIANS else round(mean_val, 2),
            'impact_score': round(contribution, 3),
            'direction': 'increases_risk' if contribution > 0.05 else ('decreases_risk' if contribution < -0.05 else 'neutral')
        })

    impacts.sort(key=lambda x: abs(x['impact_score']), reverse=True)
    return impacts

def generate_recommendations(cleaned_data, prob, risk_level):
    recs = []

    glucose = cleaned_data.get('Glucose', 0)
    bmi = cleaned_data.get('BMI', 0)
    bp = cleaned_data.get('BloodPressure', 0)
    age = cleaned_data.get('Age', 0)
    dpf = cleaned_data.get('DiabetesPedigreeFunction', 0)

    if glucose >= 140:
        recs.append({
            'type': 'high',
            'title': 'Elevated Blood Glucose Level',
            'desc': f'Fasting glucose of {glucose} mg/dL is significantly elevated (> 140 mg/dL). Immediate medical evaluation and HbA1c screening is strongly advised.'
        })
    elif glucose >= 100:
        recs.append({
            'type': 'warning',
            'title': 'Pre-Diabetic Glucose Range',
            'desc': f'Glucose level of {glucose} mg/dL falls into the pre-diabetes threshold (100–139 mg/dL). Reduce refined carbohydrates and monitor blood sugar.'
        })
    else:
        recs.append({
            'type': 'good',
            'title': 'Normal Glucose Balance',
            'desc': f'Glucose level ({glucose} mg/dL) is within optimal clinical bounds (< 100 mg/dL).'
        })

    if bmi >= 30:
        recs.append({
            'type': 'high',
            'title': 'Class I Obesity BMI Range',
            'desc': f'BMI of {bmi} kg/m² increases metabolic syndrome vulnerability. Targeting a 5-10% weight loss significantly lowers type-2 diabetes risk.'
        })
    elif bmi >= 25:
        recs.append({
            'type': 'warning',
            'title': 'Overweight BMI Indicator',
            'desc': f'BMI of {bmi} kg/m² indicates moderate excess weight. 150 minutes of weekly aerobic exercise is recommended.'
        })

    if bp >= 90:
        recs.append({
            'type': 'warning',
            'title': 'Stage 1 Diastolic Hypertension',
            'desc': f'Diastolic pressure of {bp} mmHg increases cardiovascular risk. Sodium restriction and blood pressure monitoring recommended.'
        })

    if dpf >= 0.6:
        recs.append({
            'type': 'warning',
            'title': 'High Hereditary Genetic Predisposition',
            'desc': f'Pedigree function of {dpf} reflects elevated family history risk factor. Proactive metabolic checkups advised.'
        })

    if age >= 45:
        recs.append({
            'type': 'info',
            'title': 'Age-Related Screening Recommendation',
            'desc': 'Patients over 45 years of age are advised to receive annual comprehensive lipid & metabolic panels.'
        })

    if not recs or risk_level == 'Low':
        recs.append({
            'type': 'good',
            'title': 'Maintain Healthy Lifestyle',
            'desc': 'Patient profile demonstrates strong metabolic wellness. Continue balanced nutrition, regular physical activity, and annual physicals.'
        })

    return recs

@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({
        'status': 'healthy',
        'model_loaded': MODEL is not None,
        'accuracy': METRICS.get('accuracy') if METRICS else None,
        'roc_auc': METRICS.get('roc_auc') if METRICS else None
    })

@app.route('/api/model-info', methods=['GET'])
def model_info():
    if METRICS is None:
        return jsonify({'error': 'Model metrics not loaded'}), 500
    return jsonify(METRICS)

@app.route('/api/predict', methods=['POST'])
def predict():
    if MODEL is None or SCALER is None:
        return jsonify({'error': 'Model is not initialized'}), 500

    data = request.get_json() or {}
    cleaned = preprocess_patient_data(data)

    df_single = pd.DataFrame([cleaned], columns=FEATURE_NAMES)
    scaled = SCALER.transform(df_single)

    prediction = int(MODEL.predict(scaled)[0])
    prob_diabetic = float(MODEL.predict_proba(scaled)[0][1])
    prob_percentage = round(prob_diabetic * 100, 1)

    if prob_diabetic >= 0.65:
        risk_level = 'High'
        risk_color = '#ef4444'  # Red
    elif prob_diabetic >= 0.35:
        risk_level = 'Moderate'
        risk_color = '#f59e0b'  # Amber
    else:
        risk_level = 'Low'
        risk_color = '#10b981'  # Green

    factor_impacts = calculate_factor_impacts(cleaned, scaled)
    recs = generate_recommendations(cleaned, prob_diabetic, risk_level)

    return jsonify({
        'prediction': prediction,
        'probability': prob_diabetic,
        'probability_percentage': prob_percentage,
        'risk_level': risk_level,
        'risk_color': risk_color,
        'cleaned_inputs': cleaned,
        'factor_impacts': factor_impacts,
        'recommendations': recs
    })

@app.route('/api/predict-batch', methods=['POST'])
def predict_batch():
    if MODEL is None or SCALER is None:
        return jsonify({'error': 'Model is not initialized'}), 500

    data = request.get_json() or {}
    patients = data.get('patients', [])

    if not patients:
        return jsonify({'error': 'No patient data provided'}), 400

    results = []
    high_count = 0
    mod_count = 0
    low_count = 0
    total_prob = 0.0

    for i, p in enumerate(patients):
        cleaned = preprocess_patient_data(p)
        df_single = pd.DataFrame([cleaned], columns=FEATURE_NAMES)
        scaled = SCALER.transform(df_single)
        pred = int(MODEL.predict(scaled)[0])
        prob = float(MODEL.predict_proba(scaled)[0][1])
        prob_pct = round(prob * 100, 1)

        if prob >= 0.65:
            risk = 'High'
            high_count += 1
        elif prob >= 0.35:
            risk = 'Moderate'
            mod_count += 1
        else:
            risk = 'Low'
            low_count += 1

        total_prob += prob

        results.append({
            'patient_id': p.get('patient_id', f'P-{i+1:03d}'),
            'inputs': cleaned,
            'prediction': pred,
            'probability_percentage': prob_pct,
            'risk_level': risk
        })

    avg_prob = round((total_prob / len(patients)) * 100, 1)

    return jsonify({
        'total': len(patients),
        'high_risk_count': high_count,
        'moderate_risk_count': mod_count,
        'low_risk_count': low_count,
        'average_probability_percentage': avg_prob,
        'results': results
    })

@app.route('/api/random-sample', methods=['GET'])
def random_sample():
    if DATASET_DF is None or DATASET_DF.empty:
        # Default sample fallback
        return jsonify({
            'Pregnancies': 3,
            'Glucose': 148,
            'BloodPressure': 72,
            'SkinThickness': 35,
            'Insulin': 150,
            'BMI': 33.6,
            'DiabetesPedigreeFunction': 0.627,
            'Age': 50
        })

    sample = DATASET_DF.sample(n=1).iloc[0].to_dict()
    sample_inputs = {feat: float(sample.get(feat, 0)) for feat in FEATURE_NAMES}
    outcome = int(sample.get('Outcome', 0))

    return jsonify({
        'inputs': sample_inputs,
        'actual_outcome': outcome
    })

# Serve frontend build if available
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    elif os.path.exists(os.path.join(app.static_folder, 'index.html')):
        return send_from_directory(app.static_folder, 'index.html')
    else:
        return jsonify({"message": "Flask backend running. React frontend needs to be built or served via Vite."})

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5050))
    app.run(host='0.0.0.0', port=port, debug=True)
