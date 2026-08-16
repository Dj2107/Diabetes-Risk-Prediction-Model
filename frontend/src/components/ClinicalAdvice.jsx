import React from 'react';
import { AlertOctagon, AlertTriangle, CheckCircle2, Info } from 'lucide-react';

export default function ClinicalAdvice({ recommendations }) {
  if (!recommendations || recommendations.length === 0) {
    return null;
  }

  const getIcon = (type) => {
    switch (type) {
      case 'high':
        return <AlertOctagon className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />;
      case 'good':
        return <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />;
      default:
        return <Info className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />;
    }
  };

  const getCardStyle = (type) => {
    switch (type) {
      case 'high':
        return 'bg-red-500/10 border-red-500/30 text-red-200';
      case 'warning':
        return 'bg-amber-500/10 border-amber-500/30 text-amber-200';
      case 'good':
        return 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200';
      default:
        return 'bg-blue-500/10 border-blue-500/30 text-blue-200';
    }
  };

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-semibold text-slate-200 flex items-center space-x-2">
        <span>Clinical Interventions & Recommendations</span>
      </h4>

      <div className="grid grid-cols-1 gap-2.5">
        {recommendations.map((rec, idx) => (
          <div
            key={idx}
            className={`p-3 rounded-xl border flex items-start space-x-3 transition-all ${getCardStyle(rec.type)}`}
          >
            {getIcon(rec.type)}
            <div>
              <h5 className="font-semibold text-xs text-white">{rec.title}</h5>
              <p className="text-xs opacity-90 mt-0.5 leading-relaxed">{rec.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
