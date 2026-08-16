import React, { useState, useEffect, useCallback } from 'react';
import RiskGauge from './RiskGauge';
import FactorImpactChart from './FactorImpactChart';
import ClinicalAdvice from './ClinicalAdvice';
import PrintReportModal from './PrintReportModal';
import { Sliders, RefreshCw, Sparkles, Printer, UserCheck, AlertTriangle, ShieldCheck } from 'lucide-react';

const PRESETS = {
  healthy: {
    Pregnancies: 1,
    Glucose: 88,
    BloodPressure: 68,
    SkinThickness: 20,
    Insulin: 75,
    BMI: 22.4,
    DiabetesPedigreeFunction: 0.25,
    Age: 24
  },
  borderline: {
    Pregnancies: 2,
    Glucose: 135,
    BloodPressure: 78,
    SkinThickness: 28,
    Insulin: 110,
    BMI: 28.5,
    DiabetesPedigreeFunction: 0.48,
    Age: 38
  },
  highRisk: {
    Pregnancies: 5,
    Glucose: 185,
    BloodPressure: 88,
    SkinThickness: 38,
    Insulin: 210,
    BMI: 38.2,
    DiabetesPedigreeFunction: 0.85,
    Age: 52
  }
};

const FEATURE_CONFIG = [
  { key: 'Glucose', label: 'Glucose Level', unit: 'mg/dL', min: 40, max: 220, step: 1, defaultVal: 120, desc: 'Fasting plasma glucose tolerance test (70-140 normal)' },
  { key: 'BMI', label: 'Body Mass Index (BMI)', unit: 'kg/m²', min: 14, max: 60, step: 0.1, defaultVal: 28.5, desc: 'Weight to height squared ratio (<25 normal, >30 obesity)' },
  { key: 'Age', label: 'Patient Age', unit: 'Years', min: 18, max: 90, step: 1, defaultVal: 35, desc: 'Age in years (Risk increases after 45 yrs)' },
  { key: 'DiabetesPedigreeFunction', label: 'Pedigree Score (DPF)', unit: 'Genetic', min: 0.05, max: 2.5, step: 0.01, defaultVal: 0.45, desc: 'Hereditary diabetes score based on family pedigree' },
  { key: 'BloodPressure', label: 'Blood Pressure', unit: 'mmHg', min: 40, max: 130, step: 1, defaultVal: 72, desc: 'Diastolic blood pressure (60-80 mmHg optimal)' },
  { key: 'Insulin', label: '2-Hour Serum Insulin', unit: 'mu U/ml', min: 0, max: 600, step: 1, defaultVal: 80, desc: '2-Hour serum insulin concentration (16-166 normal)' },
  { key: 'SkinThickness', label: 'Skinfold Thickness', unit: 'mm', min: 0, max: 99, step: 1, defaultVal: 23, desc: 'Triceps skinfold thickness measurement' },
  { key: 'Pregnancies', label: 'Pregnancies', unit: 'Times', min: 0, max: 17, step: 1, defaultVal: 2, desc: 'Number of full-term pregnancies' }
];

export default function PredictorTab() {
  const [formData, setFormData] = useState(PRESETS.borderline);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  // Fetch prediction from backend API
  const fetchPrediction = useCallback(async (data) => {
    setLoading(true);
    try {
      const response = await fetch('/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const result = await response.json();
      if (response.ok) {
        setPrediction(result);
      }
    } catch (err) {
      console.error('Failed to fetch prediction:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Live real-time trigger on formData change
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchPrediction(formData);
    }, 200); // 200ms debounce
    return () => clearTimeout(timer);
  }, [formData, fetchPrediction]);

  const handleInputChange = (key, val) => {
    setFormData(prev => ({
      ...prev,
      [key]: parseFloat(val) || 0
    }));
  };

  const applyPreset = (presetKey) => {
    if (PRESETS[presetKey]) {
      setFormData(PRESETS[presetKey]);
    }
  };

  const fetchRandomSample = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/random-sample');
      const data = await res.json();
      if (data && data.inputs) {
        setFormData(data.inputs);
      }
    } catch (err) {
      console.error('Random sample error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Patient Profile Presets Bar */}
      <div className="glass-card p-4 rounded-2xl flex flex-wrap items-center justify-between gap-3 border border-slate-700/60">
        <div className="flex items-center space-x-2">
          <Sliders className="w-5 h-5 text-blue-400" />
          <span className="font-semibold text-sm text-slate-200">Preset Patient Profiles:</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => applyPreset('healthy')}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold transition-all"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Healthy Adult</span>
          </button>

          <button
            onClick={() => applyPreset('borderline')}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-semibold transition-all"
          >
            <UserCheck className="w-4 h-4" />
            <span>Borderline Case</span>
          </button>

          <button
            onClick={() => applyPreset('highRisk')}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-300 text-xs font-semibold transition-all"
          >
            <AlertTriangle className="w-4 h-4" />
            <span>High Risk Profile</span>
          </button>

          <button
            onClick={fetchRandomSample}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/40 text-blue-300 text-xs font-semibold transition-all"
          >
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span>Random Sample</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left Inputs (2 Columns), Right Output Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Left Column: 8 Reactive Parameter Controls (Lg 7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="glass-card p-5 rounded-2xl space-y-5 border border-slate-700/60">
            <div className="flex items-center justify-between border-b border-slate-700/50 pb-3">
              <h3 className="font-bold text-base text-white flex items-center space-x-2">
                <span>Patient Health Indicators</span>
              </h3>
              <span className="text-xs text-blue-400 font-medium">Real-Time Reactive Sliders</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {FEATURE_CONFIG.map(cfg => {
                const val = formData[cfg.key] ?? cfg.defaultVal;
                return (
                  <div key={cfg.key} className="p-3 bg-slate-800/40 rounded-xl border border-slate-700/40 space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-semibold text-slate-300">
                        {cfg.label}
                      </label>
                      <div className="flex items-center space-x-1">
                        <input
                          type="number"
                          min={cfg.min}
                          max={cfg.max}
                          step={cfg.step}
                          value={val}
                          onChange={(e) => handleInputChange(cfg.key, e.target.value)}
                          className="w-16 px-1.5 py-0.5 bg-slate-900 border border-slate-600 rounded text-center text-xs font-bold text-blue-400 focus:outline-none focus:border-blue-500"
                        />
                        <span className="text-[10px] text-slate-400 font-medium">{cfg.unit}</span>
                      </div>
                    </div>

                    {/* Range Slider */}
                    <input
                      type="range"
                      min={cfg.min}
                      max={cfg.max}
                      step={cfg.step}
                      value={val}
                      onChange={(e) => handleInputChange(cfg.key, e.target.value)}
                      className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                    />

                    <p className="text-[10px] text-slate-400">{cfg.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Reactive Prediction Output & Analytics (Lg 5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Risk Gauge Card */}
          <div className="glass-card p-5 rounded-2xl border border-slate-700/60 flex flex-col items-center justify-center relative">
            {loading && (
              <div className="absolute top-3 right-3 text-blue-400 animate-spin">
                <RefreshCw className="w-4 h-4" />
              </div>
            )}

            <RiskGauge
              probabilityPct={prediction?.probability_percentage}
              riskLevel={prediction?.risk_level}
              riskColor={prediction?.risk_color}
            />

            {/* Print Medical Report Button */}
            <button
              onClick={() => setIsPrintModalOpen(true)}
              className="mt-3 w-full py-2 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center justify-center space-x-2 shadow-lg shadow-blue-600/30 transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>Export Printable Patient Report</span>
            </button>
          </div>

          {/* Factor Impact Chart Card */}
          <div className="glass-card p-4 rounded-2xl border border-slate-700/60">
            <FactorImpactChart factorImpacts={prediction?.factor_impacts} />
          </div>

          {/* Clinical Advice Card */}
          <div className="glass-card p-4 rounded-2xl border border-slate-700/60">
            <ClinicalAdvice recommendations={prediction?.recommendations} />
          </div>

        </div>

      </div>

      {/* Printable Clinical Report Modal */}
      <PrintReportModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        patientData={formData}
        predictionResult={prediction}
      />

    </div>
  );
}
