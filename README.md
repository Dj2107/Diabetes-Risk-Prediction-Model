# Diabetes Prediction Model (DiaPredict)

A machine learning model that predicts an individual's risk of diabetes based on health and lifestyle indicators such as glucose level, BMI, age, and blood pressure. Built to support early risk identification and preventive healthcare decisions.

## 📌 Overview

Diabetes is a chronic condition that, if detected early, can be managed more effectively. This project uses supervised machine learning to classify patients as diabetic or non-diabetic based on key health metrics, helping flag high-risk individuals for further medical evaluation.

## 🚀 Features

- Predicts diabetes risk from patient health data
- Data preprocessing and cleaning pipeline (handling missing/invalid values)
- Exploratory Data Analysis (EDA) with visualizations
- Model training and evaluation using multiple classification algorithms
- Performance metrics: Accuracy, Precision, Recall, F1-score, ROC-AUC

## 🛠️ Tech Stack

- **Language:** Python
- **Libraries:** Pandas, NumPy, Scikit-learn, Matplotlib/Seaborn
- **Model(s):** Logistic Regression / Random Forest / SVM *(update with what you used)*
- **Environment:** Jupyter Notebook

## 📊 Dataset

- **Source:** [Pima Indians Diabetes Dataset](https://www.kaggle.com/datasets/uciml/pima-indians-diabetes-database)
- **Features used:** Glucose, BMI, Blood Pressure, Age, Insulin, Skin Thickness, Pregnancies, Diabetes Pedigree Function
- **Target variable:** Outcome (1 = Diabetic, 0 = Non-Diabetic)

## ⚙️ Installation

```bash
git clone https://github.com/your-username/diabetes-prediction-model.git
cd diabetes-prediction-model
pip install -r requirements.txt
```

## ▶️ Usage

```bash
python train_model.py
```

Or open the notebook:

```bash
jupyter notebook DiaPredict.ipynb
```

## 📈 Results

| Metric      | Score |
|-------------|-------|
| Accuracy    | XX%   |
| Precision   | XX%   |
| Recall      | XX%   |
| F1-Score    | XX%   |
| ROC-AUC     | XX%   |

*(Replace with your actual results)*

## 📂 Project Structure

```
diabetes-prediction-model/
│
├── data/                 # Dataset files
├── notebooks/            # Jupyter notebooks for EDA and modeling
├── train_model.py        # Model training script
├── requirements.txt      # Project dependencies
└── README.md             # Project documentation
```

## 🔮 Future Improvements

- Hyperparameter tuning for improved accuracy
- Deploy as a web app using Flask/Streamlit
- Add support for additional health datasets

## 📄 License

This project is licensed under the MIT License.
