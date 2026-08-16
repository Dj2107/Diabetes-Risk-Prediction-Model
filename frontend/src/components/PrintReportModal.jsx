import React from 'react';
import { X, Printer, FileText, CheckCircle2, AlertTriangle, Activity } from 'lucide-react';

export default function PrintReportModal({ isOpen, onClose, patientData, predictionResult }) {
  if (!isOpen || !predictionResult) return null;

  const { cleaned_inputs, probability_percentage, risk_level, recommendations } = predictionResult;
  const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto no-print">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden text-slate-200 my-8">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-800/50">
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-blue-400" />
            <h3 className="font-bold text-base text-white">Patient Medical Risk Report</h3>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold shadow-md transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body - Printable Area */}
        <div className="p-6 space-y-6 print:p-8 print:bg-white print:text-black">
          
          {/* Clinic & Report Header */}
          <div className="flex justify-between items-start border-b border-slate-700/50 pb-4">
            <div>
              <div className="flex items-center space-x-2">
                <Activity className="w-6 h-6 text-blue-500" />
                <span className="font-bold text-lg text-white">GlycoPredict Medical AI</span>
              </div>
              <p className="text-xs text-slate-400 mt-1">Clinical Diabetes Risk Stratification System</p>
            </div>
            <div className="text-right text-xs text-slate-400">
              <p className="font-medium text-slate-200">Date: {today}</p>
              <p>Report ID: GP-{Math.floor(100000 + Math.random() * 900000)}</p>
            </div>
          </div>

          {/* Risk Outcome Summary */}
          <div className="p-4 rounded-xl border border-slate-700 bg-slate-800/40 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Metabolic Diabetes Risk Outcome</span>
              <div className="flex items-center space-x-3 mt-1">
                <span className="text-2xl font-extrabold text-white">{probability_percentage}%</span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  risk_level === 'High' ? 'bg-red-500/20 text-red-400 border border-red-500/40' :
                  risk_level === 'Moderate' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' :
                  'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                }`}>
                  {risk_level} Risk Classification
                </span>
              </div>
            </div>
          </div>

          {/* Patient Parameters Grid */}
          <div>
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Patient Clinical Metrics</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-2.5 bg-slate-800/60 rounded-lg border border-slate-700/50">
                <span className="text-slate-400 block text-[10px]">Glucose Level</span>
                <span className="font-bold text-white text-sm">{cleaned_inputs.Glucose} mg/dL</span>
              </div>
              <div className="p-2.5 bg-slate-800/60 rounded-lg border border-slate-700/50">
                <span className="text-slate-400 block text-[10px]">BMI</span>
                <span className="font-bold text-white text-sm">{cleaned_inputs.BMI} kg/m²</span>
              </div>
              <div className="p-2.5 bg-slate-800/60 rounded-lg border border-slate-700/50">
                <span className="text-slate-400 block text-[10px]">Blood Pressure</span>
                <span className="font-bold text-white text-sm">{cleaned_inputs.BloodPressure} mmHg</span>
              </div>
              <div className="p-2.5 bg-slate-800/60 rounded-lg border border-slate-700/50">
                <span className="text-slate-400 block text-[10px]">Age</span>
                <span className="font-bold text-white text-sm">{cleaned_inputs.Age} Years</span>
              </div>
              <div className="p-2.5 bg-slate-800/60 rounded-lg border border-slate-700/50">
                <span className="text-slate-400 block text-[10px]">Insulin</span>
                <span className="font-bold text-white text-sm">{cleaned_inputs.Insulin} mu U/ml</span>
              </div>
              <div className="p-2.5 bg-slate-800/60 rounded-lg border border-slate-700/50">
                <span className="text-slate-400 block text-[10px]">Skin Thickness</span>
                <span className="font-bold text-white text-sm">{cleaned_inputs.SkinThickness} mm</span>
              </div>
              <div className="p-2.5 bg-slate-800/60 rounded-lg border border-slate-700/50">
                <span className="text-slate-400 block text-[10px]">Pregnancies</span>
                <span className="font-bold text-white text-sm">{cleaned_inputs.Pregnancies}</span>
              </div>
              <div className="p-2.5 bg-slate-800/60 rounded-lg border border-slate-700/50">
                <span className="text-slate-400 block text-[10px]">Pedigree Score</span>
                <span className="font-bold text-white text-sm">{cleaned_inputs.DiabetesPedigreeFunction}</span>
              </div>
            </div>
          </div>

          {/* Recommendations List */}
          <div>
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Physician Guidelines & Care Plan</h4>
            <div className="space-y-2">
              {recommendations.map((rec, i) => (
                <div key={i} className="p-2.5 bg-slate-800/40 border border-slate-700/60 rounded-lg text-xs">
                  <p className="font-bold text-white">{rec.title}</p>
                  <p className="text-slate-300 text-[11px] mt-0.5">{rec.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Signature */}
          <div className="pt-6 border-t border-slate-700/50 flex justify-between items-end text-xs text-slate-400">
            <div>
              <p className="font-semibold text-slate-200">GlycoPredict Algorithmic Assessment</p>
              <p className="text-[10px]">Model Validation ROC-AUC: 81.3% | Machine Learning Assisted Analysis</p>
            </div>
            <div className="text-center">
              <div className="w-36 border-b border-slate-600 mb-1"></div>
              <p className="text-[10px]">Attending Physician Signature</p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
