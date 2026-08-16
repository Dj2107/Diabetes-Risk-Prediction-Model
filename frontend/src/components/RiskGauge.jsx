import React from 'react';
import { AlertTriangle, ShieldCheck, AlertCircle } from 'lucide-react';

export default function RiskGauge({ probabilityPct, riskLevel, riskColor }) {
  const pct = Math.min(Math.max(probabilityPct || 0, 0), 100);
  
  // Semi-circle arc geometry
  const radius = 75;
  const strokeWidth = 14;
  const circumference = Math.PI * radius; // ~235.62
  const strokeDashoffset = circumference - (pct / 100) * circumference;

  let badgeBg = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
  let badgeIcon = <ShieldCheck className="w-5 h-5 text-emerald-400" />;

  if (riskLevel === 'High') {
    badgeBg = 'bg-red-500/20 text-red-400 border-red-500/40 risk-badge-high';
    badgeIcon = <AlertTriangle className="w-5 h-5 text-red-400" />;
  } else if (riskLevel === 'Moderate') {
    badgeBg = 'bg-amber-500/15 text-amber-400 border-amber-500/30';
    badgeIcon = <AlertCircle className="w-5 h-5 text-amber-400" />;
  }

  return (
    <div className="flex flex-col items-center justify-center p-4 w-full">
      {/* Centered SVG Semi-Circle Gauge Container */}
      <div className="relative w-56 h-32 flex justify-center items-end">
        <svg
          className="w-56 h-32 overflow-visible"
          viewBox="0 0 200 115"
        >
          <defs>
            <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="50%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#ef4444" />
            </linearGradient>
          </defs>

          {/* Background Track Arc (Top half) */}
          <path
            d="M 25 100 A 75 75 0 0 1 175 100"
            fill="none"
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />

          {/* Value Progress Arc */}
          <path
            d="M 25 100 A 75 75 0 0 1 175 100"
            fill="none"
            stroke="url(#gaugeGradient)"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
          />
        </svg>

        {/* Central Risk Score Text - Perfectly Aligned */}
        <div className="absolute bottom-2 flex flex-col items-center justify-center text-center">
          <span className="text-3xl font-extrabold tracking-tight text-white drop-shadow-md">
            {pct.toFixed(1)}%
          </span>
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-0.5">
            Risk Score
          </span>
        </div>
      </div>

      {/* Risk Category Badge */}
      <div className={`mt-5 flex items-center space-x-2 px-4 py-2 rounded-full border text-sm font-bold shadow-md transition-all ${badgeBg}`}>
        {badgeIcon}
        <span>{riskLevel ? `${riskLevel} Risk Level` : 'Calculating...'}</span>
      </div>

      <p className="mt-3 text-xs text-slate-400 text-center max-w-xs leading-relaxed">
        {riskLevel === 'High' && 'High probability of diabetes mellitus based on clinical indicators. Comprehensive lab testing recommended.'}
        {riskLevel === 'Moderate' && 'Elevated risk parameters detected. Preventive lifestyle modifications advised.'}
        {riskLevel === 'Low' && 'Metabolic indicators are currently within normal baseline parameters.'}
      </p>
    </div>
  );
}
