import React, { useState } from 'react';
import { Upload, Download, Search, Filter, AlertTriangle, ShieldCheck, FileSpreadsheet, RefreshCw } from 'lucide-react';

export default function BatchScreener() {
  const [batchResults, setBatchResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [riskFilter, setRiskFilter] = useState('ALL');

  // Generate 20 demo patient records for batch evaluation
  const loadDemoDataset = async () => {
    setLoading(true);
    const demoPatients = [
      { patient_id: 'PAT-001', Pregnancies: 6, Glucose: 148, BloodPressure: 72, SkinThickness: 35, Insulin: 0, BMI: 33.6, DiabetesPedigreeFunction: 0.627, Age: 50 },
      { patient_id: 'PAT-002', Pregnancies: 1, Glucose: 85, BloodPressure: 66, SkinThickness: 29, Insulin: 0, BMI: 26.6, DiabetesPedigreeFunction: 0.351, Age: 31 },
      { patient_id: 'PAT-003', Pregnancies: 8, Glucose: 183, BloodPressure: 64, SkinThickness: 0, Insulin: 0, BMI: 23.3, DiabetesPedigreeFunction: 0.672, Age: 32 },
      { patient_id: 'PAT-004', Pregnancies: 1, Glucose: 89, BloodPressure: 66, SkinThickness: 23, Insulin: 94, BMI: 28.1, DiabetesPedigreeFunction: 0.167, Age: 21 },
      { patient_id: 'PAT-005', Pregnancies: 0, Glucose: 137, BloodPressure: 40, SkinThickness: 35, Insulin: 168, BMI: 43.1, DiabetesPedigreeFunction: 2.288, Age: 33 },
      { patient_id: 'PAT-006', Pregnancies: 5, Glucose: 116, BloodPressure: 74, SkinThickness: 0, Insulin: 0, BMI: 25.6, DiabetesPedigreeFunction: 0.201, Age: 30 },
      { patient_id: 'PAT-007', Pregnancies: 3, Glucose: 78, BloodPressure: 50, SkinThickness: 32, Insulin: 88, BMI: 31.0, DiabetesPedigreeFunction: 0.248, Age: 26 },
      { patient_id: 'PAT-008', Pregnancies: 10, Glucose: 115, BloodPressure: 0, SkinThickness: 0, Insulin: 0, BMI: 35.3, DiabetesPedigreeFunction: 0.134, Age: 29 },
      { patient_id: 'PAT-009', Pregnancies: 2, Glucose: 197, BloodPressure: 70, SkinThickness: 45, Insulin: 543, BMI: 30.5, DiabetesPedigreeFunction: 0.158, Age: 53 },
      { patient_id: 'PAT-010', Pregnancies: 8, Glucose: 125, BloodPressure: 96, SkinThickness: 0, Insulin: 0, BMI: 0, DiabetesPedigreeFunction: 0.232, Age: 54 },
      { patient_id: 'PAT-011', Pregnancies: 4, Glucose: 110, BloodPressure: 92, SkinThickness: 0, Insulin: 0, BMI: 37.6, DiabetesPedigreeFunction: 0.191, Age: 30 },
      { patient_id: 'PAT-012', Pregnancies: 10, Glucose: 168, BloodPressure: 74, SkinThickness: 0, Insulin: 0, BMI: 38.0, DiabetesPedigreeFunction: 0.537, Age: 34 },
      { patient_id: 'PAT-013', Pregnancies: 10, Glucose: 139, BloodPressure: 80, SkinThickness: 0, Insulin: 0, BMI: 27.1, DiabetesPedigreeFunction: 1.441, Age: 57 },
      { patient_id: 'PAT-014', Pregnancies: 1, Glucose: 189, BloodPressure: 60, SkinThickness: 23, Insulin: 846, BMI: 30.1, DiabetesPedigreeFunction: 0.398, Age: 59 },
      { patient_id: 'PAT-015', Pregnancies: 5, Glucose: 166, BloodPressure: 72, SkinThickness: 19, Insulin: 175, BMI: 25.8, DiabetesPedigreeFunction: 0.587, Age: 51 }
    ];

    try {
      const res = await fetch('/api/predict-batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ patients: demoPatients })
      });
      const data = await res.json();
      if (res.ok) {
        setBatchResults(data);
      }
    } catch (err) {
      console.error('Batch screening error:', err);
    } finally {
      setLoading(false);
    }
  };

  const downloadCSV = () => {
    if (!batchResults || !batchResults.results) return;

    const headers = ['Patient_ID', 'Glucose', 'BMI', 'Age', 'BloodPressure', 'Risk_Score_Pct', 'Risk_Classification'];
    const rows = batchResults.results.map(r => [
      r.patient_id,
      r.inputs.Glucose,
      r.inputs.BMI,
      r.inputs.Age,
      r.inputs.BloodPressure,
      r.probability_percentage,
      r.risk_level
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Batch_Diabetes_Risk_Report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter results by search & risk status
  const filteredResults = (batchResults?.results || []).filter(item => {
    const matchesSearch = item.patient_id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRisk = riskFilter === 'ALL' || item.risk_level === riskFilter;
    return matchesSearch && matchesRisk;
  });

  return (
    <div className="space-y-6">
      
      {/* Header Bar */}
      <div className="glass-card p-5 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-slate-700/60">
        <div>
          <h3 className="font-bold text-base text-white flex items-center space-x-2">
            <FileSpreadsheet className="w-5 h-5 text-blue-400" />
            <span>Batch Patient Screener</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">Evaluate metabolic diabetes risk across multiple patient records concurrently.</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={loadDemoDataset}
            disabled={loading}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-blue-600/30 transition-all disabled:opacity-50"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <FileSpreadsheet className="w-4 h-4" />}
            <span>Load Demo Batch (15 Patients)</span>
          </button>

          {batchResults && (
            <button
              onClick={downloadCSV}
              className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-emerald-600/30 transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Export Results CSV</span>
            </button>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      {batchResults && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="glass-card p-4 rounded-xl border border-slate-700/60 text-center">
            <span className="text-xs text-slate-400 font-medium">Total Evaluated</span>
            <p className="text-2xl font-extrabold text-white mt-1">{batchResults.total}</p>
          </div>

          <div className="glass-card p-4 rounded-xl border border-red-500/30 bg-red-500/10 text-center">
            <span className="text-xs text-red-300 font-medium flex items-center justify-center space-x-1">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>High Risk Cases</span>
            </span>
            <p className="text-2xl font-extrabold text-red-400 mt-1">{batchResults.high_risk_count}</p>
          </div>

          <div className="glass-card p-4 rounded-xl border border-amber-500/30 bg-amber-500/10 text-center">
            <span className="text-xs text-amber-300 font-medium">Moderate Risk</span>
            <p className="text-2xl font-extrabold text-amber-400 mt-1">{batchResults.moderate_risk_count}</p>
          </div>

          <div className="glass-card p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-center">
            <span className="text-xs text-emerald-300 font-medium flex items-center justify-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Low Risk</span>
            </span>
            <p className="text-2xl font-extrabold text-emerald-400 mt-1">{batchResults.low_risk_count}</p>
          </div>
        </div>
      )}

      {/* Filter & Search Bar */}
      {batchResults && (
        <div className="glass-card p-4 rounded-2xl border border-slate-700/60 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search Patient ID..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-slate-400" />
            <span className="text-xs text-slate-400 font-medium">Filter Risk:</span>
            {['ALL', 'High', 'Moderate', 'Low'].map(lvl => (
              <button
                key={lvl}
                onClick={() => setRiskFilter(lvl)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  riskFilter === lvl
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Results Table */}
      {batchResults && (
        <div className="glass-card rounded-2xl border border-slate-700/60 overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-800/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-700">
              <tr>
                <th className="p-3.5">Patient ID</th>
                <th className="p-3.5">Glucose</th>
                <th className="p-3.5">BMI</th>
                <th className="p-3.5">Age</th>
                <th className="p-3.5">Blood Pressure</th>
                <th className="p-3.5">Pedigree</th>
                <th className="p-3.5">Diabetes Probability</th>
                <th className="p-3.5">Risk Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredResults.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-3.5 font-bold text-white">{item.patient_id}</td>
                  <td className="p-3.5">{item.inputs.Glucose} mg/dL</td>
                  <td className="p-3.5">{item.inputs.BMI} kg/m²</td>
                  <td className="p-3.5">{item.inputs.Age} Yrs</td>
                  <td className="p-3.5">{item.inputs.BloodPressure} mmHg</td>
                  <td className="p-3.5">{item.inputs.DiabetesPedigreeFunction}</td>
                  <td className="p-3.5 font-bold text-slate-100">{item.probability_percentage}%</td>
                  <td className="p-3.5">
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                      item.risk_level === 'High' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                      item.risk_level === 'Moderate' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                      'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    }`}>
                      {item.risk_level}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!batchResults && (
        <div className="glass-card p-12 rounded-2xl border border-slate-700/60 text-center space-y-3">
          <FileSpreadsheet className="w-12 h-12 text-slate-500 mx-auto" />
          <h4 className="font-bold text-base text-slate-200">No Batch Data Loaded</h4>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Click "Load Demo Batch" above to evaluate 15 patient records instantly.
          </p>
        </div>
      )}

    </div>
  );
}
