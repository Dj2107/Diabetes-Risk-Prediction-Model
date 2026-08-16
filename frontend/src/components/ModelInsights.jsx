import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, LineChart, Line, Cell, CartesianGrid } from 'recharts';
import { BarChart2, Award, Database, Activity, CheckCircle, AlertOctagon } from 'lucide-react';

export default function ModelInsights({ modelInfo }) {
  if (!modelInfo) {
    return (
      <div className="p-12 text-center text-slate-400">
        Loading model analytics...
      </div>
    );
  }

  const { accuracy, roc_auc, confusion_matrix, feature_importances, roc_curve, total_samples, positive_samples, negative_samples } = modelInfo;

  // Format ROC curve for Recharts
  const rocData = (roc_curve?.fpr || []).map((fprVal, idx) => ({
    fpr: fprVal,
    tpr: roc_curve.tpr[idx] || 0,
    baseline: fprVal // diagonal baseline
  }));

  // Confusion matrix counts
  const tn = confusion_matrix?.[0]?.[0] || 0;
  const fp = confusion_matrix?.[0]?.[1] || 0;
  const fn = confusion_matrix?.[1]?.[0] || 0;
  const tp = confusion_matrix?.[1]?.[1] || 0;

  return (
    <div className="space-y-6">
      
      {/* Model Performance Banner */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        <div className="glass-card p-5 rounded-2xl border border-blue-500/30 bg-blue-500/10 flex items-center space-x-4">
          <div className="p-3 bg-blue-600 rounded-xl text-white">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-blue-300 font-medium">Model Accuracy</span>
            <p className="text-2xl font-extrabold text-white">{(accuracy * 100).toFixed(1)}%</p>
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-indigo-500/30 bg-indigo-500/10 flex items-center space-x-4">
          <div className="p-3 bg-indigo-600 rounded-xl text-white">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-indigo-300 font-medium">ROC-AUC Score</span>
            <p className="text-2xl font-extrabold text-white">{(roc_auc * 100).toFixed(1)}%</p>
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 flex items-center space-x-4">
          <div className="p-3 bg-emerald-600 rounded-xl text-white">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-emerald-300 font-medium">True Positive Rate</span>
            <p className="text-2xl font-extrabold text-white">{((tp / (tp + fn || 1)) * 100).toFixed(1)}%</p>
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-700/60 flex items-center space-x-4">
          <div className="p-3 bg-slate-700 rounded-xl text-white">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium">Total Dataset Size</span>
            <p className="text-2xl font-extrabold text-white">{total_samples} Patient Rows</p>
          </div>
        </div>

      </div>

      {/* Main Grid: Feature Importance (Left) & ROC Curve + Confusion Matrix (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Feature Importance Ranking Chart (Lg 7 cols) */}
        <div className="lg:col-span-7 glass-card p-5 rounded-2xl border border-slate-700/60 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-700/50 pb-3">
            <h4 className="font-bold text-base text-white flex items-center space-x-2">
              <BarChart2 className="w-5 h-5 text-blue-400" />
              <span>Model Feature Importance Ranking</span>
            </h4>
            <span className="text-xs text-slate-400">Logistic Regression Weight</span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={feature_importances}
                layout="vertical"
                margin={{ top: 10, right: 20, left: 60, bottom: 10 }}
              >
                <XAxis type="number" stroke="#64748b" tick={{ fontSize: 10 }} />
                <YAxis dataKey="feature" type="category" stroke="#94a3b8" tick={{ fontSize: 11 }} width={120} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                />
                <Bar dataKey="importance" radius={[0, 4, 4, 0]}>
                  {feature_importances.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={index === 0 ? '#3b82f6' : index === 1 ? '#6366f1' : index === 2 ? '#8b5cf6' : '#64748b'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-slate-400">
            * Glucose concentration and Body Mass Index (BMI) are the top primary predictive drivers of diabetes vulnerability according to model coefficients.
          </p>
        </div>

        {/* ROC Curve & Confusion Matrix (Lg 5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* ROC Curve Plot */}
          <div className="glass-card p-5 rounded-2xl border border-slate-700/60 space-y-3">
            <h4 className="font-bold text-sm text-white flex items-center space-x-2">
              <span>ROC Curve (AUC = {roc_auc})</span>
            </h4>

            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={rocData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="fpr" stroke="#64748b" tick={{ fontSize: 10 }} label={{ value: 'False Positive Rate', position: 'insideBottom', offset: -2, fill: '#64748b', fontSize: 10 }} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 10 }} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', fontSize: '11px' }} />
                  <Line type="monotone" dataKey="tpr" stroke="#3b82f6" strokeWidth={2} dot={false} name="Model ROC" />
                  <Line type="monotone" dataKey="baseline" stroke="#64748b" strokeDasharray="3 3" dot={false} name="Random Baseline" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Confusion Matrix Visual */}
          <div className="glass-card p-5 rounded-2xl border border-slate-700/60 space-y-3">
            <h4 className="font-bold text-sm text-white">Confusion Matrix (Validation Test)</h4>
            <div className="grid grid-cols-2 gap-2 text-center text-xs">
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                <span className="text-emerald-400 font-medium text-[11px] block">True Negative (TN)</span>
                <span className="text-xl font-extrabold text-white">{tn}</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Correct Healthy</span>
              </div>

              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30">
                <span className="text-amber-400 font-medium text-[11px] block">False Positive (FP)</span>
                <span className="text-xl font-extrabold text-white">{fp}</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">False Alarm</span>
              </div>

              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30">
                <span className="text-red-400 font-medium text-[11px] block">False Negative (FN)</span>
                <span className="text-xl font-extrabold text-white">{fn}</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Missed Diagnosis</span>
              </div>

              <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/30">
                <span className="text-blue-400 font-medium text-[11px] block">True Positive (TP)</span>
                <span className="text-xl font-extrabold text-white">{tp}</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Correct Diabetic</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
