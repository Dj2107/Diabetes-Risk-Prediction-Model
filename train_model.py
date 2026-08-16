import os
import json
import joblib
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, confusion_matrix, classification_report, roc_auc_score, roc_curve

def train_and_save_model():
    csv_path = 'diabetesdataset (1).csv'
    if not os.path.exists(csv_path):
        csv_path = 'diabetesdataset.csv'
        
    print(f"Loading dataset from {csv_path}...")
    df = pd.read_csv(csv_path)

    # Feature columns
    feature_names = [
        'Pregnancies', 'Glucose', 'BloodPressure', 'SkinThickness',
        'Insulin', 'BMI', 'DiabetesPedigreeFunction', 'Age'
    ]

    # Columns where 0 is invalid/missing health value
    columns_with_zero_invalid = ['Glucose', 'BloodPressure', 'SkinThickness', 'Insulin', 'BMI']

    # Compute medians for non-zero values
    medians = {}
    df_clean = df.copy()
    for col in columns_with_zero_invalid:
        median_val = float(df_clean[df_clean[col] > 0][col].median())
        medians[col] = median_val
        df_clean[col] = df_clean[col].replace(0, np.nan).fillna(median_val)

    X = df_clean[feature_names]
    y = df_clean['Outcome']

    # Split train/test
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)

    # Fit Scaler
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)

    # Fit Logistic Regression
    model = LogisticRegression(random_state=42, max_iter=1000)
    model.fit(X_train_scaled, y_train)

    # Evaluate
    y_pred = model.predict(X_test_scaled)
    y_prob = model.predict_proba(X_test_scaled)[:, 1]

    acc = float(accuracy_score(y_test, y_pred))
    auc = float(roc_auc_score(y_test, y_prob))
    cm = confusion_matrix(y_test, y_pred).tolist()
    report = classification_report(y_test, y_pred, output_dict=True)

    fpr, tpr, thresholds = roc_curve(y_test, y_prob)
    roc_curve_data = {
        'fpr': [round(x, 4) for x in fpr.tolist()],
        'tpr': [round(x, 4) for x in tpr.tolist()]
    }

    # Feature importances (abs of coefficients)
    importances = abs(model.coef_[0])
    feature_importance_list = []
    for name, imp, coef in zip(feature_names, importances, model.coef_[0]):
        feature_importance_list.append({
            'feature': name,
            'importance': round(float(imp), 4),
            'coefficient': round(float(coef), 4)
        })
    feature_importance_list.sort(key=lambda x: x['importance'], reverse=True)

    # Dataset summary statistics
    stats = {}
    for col in feature_names:
        stats[col] = {
            'min': float(df_clean[col].min()),
            'max': float(df_clean[col].max()),
            'mean': round(float(df_clean[col].mean()), 2),
            'median': round(float(df_clean[col].median()), 2),
            'std': round(float(df_clean[col].std()), 2)
        }

    # Save pkl artifacts
    joblib.dump(model, 'diabetes_logistic_regression_model.pkl')
    joblib.dump(scaler, 'diabetes_scaler.pkl')

    # Save JSON metrics
    metrics_payload = {
        'accuracy': round(acc, 4),
        'roc_auc': round(auc, 4),
        'confusion_matrix': cm,
        'classification_report': report,
        'feature_importances': feature_importance_list,
        'dataset_stats': stats,
        'medians': medians,
        'roc_curve': roc_curve_data,
        'total_samples': int(len(df)),
        'positive_samples': int(y.sum()),
        'negative_samples': int(len(df) - y.sum())
    }

    with open('model_metrics.json', 'w') as f:
        json.dump(metrics_payload, f, indent=2)

    with open('imputer_medians.json', 'w') as f:
        json.dump(medians, f, indent=2)

    print("Model training complete!")
    print(f"Accuracy: {acc*100:.2f}% | ROC-AUC: {auc:.4f}")
    print("Artifacts saved: diabetes_logistic_regression_model.pkl, diabetes_scaler.pkl, model_metrics.json")

if __name__ == '__main__':
    train_and_save_model()
