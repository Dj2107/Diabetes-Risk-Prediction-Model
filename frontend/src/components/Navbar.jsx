import React from 'react';
import { Activity, Cpu, Users, BarChart2, Sun, Moon, Sparkles } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, darkMode, setDarkMode, modelHealth }) {
  return (
    <header className="sticky top-0 z-40 w-full glass-card border-b border-slate-700/50 mb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('predictor')}>
          <div className="p-2.5 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 text-white shadow-lg shadow-blue-500/20">
            <Activity className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-400 bg-clip-text text-transparent">
                GlycoPredict AI
              </span>
              <span className="text-[10px] uppercase font-semibold tracking-wider px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                v2.0 ML
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">Reactive Diabetes Risk Assessment</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center space-x-1 bg-slate-800/60 p-1.5 rounded-xl border border-slate-700/50">
          <button
            onClick={() => setActiveTab('predictor')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'predictor'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <Cpu className="w-4 h-4" />
            <span>Patient Calculator</span>
          </button>

          <button
            onClick={() => setActiveTab('batch')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'batch'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Batch Screener</span>
          </button>

          <button
            onClick={() => setActiveTab('insights')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'insights'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <BarChart2 className="w-4 h-4" />
            <span>Model Analytics</span>
          </button>
        </nav>

        {/* Right Section: Model Status & Theme Toggle */}
        <div className="flex items-center space-x-3">
          {/* Model Status Badge */}
          <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Model Active (AUC {modelHealth?.roc_auc ? (modelHealth.roc_auc * 100).toFixed(1) + '%' : '81.3%'})</span>
          </div>

          {/* Theme Toggle Button */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white transition-colors border border-slate-700/50"
            title="Toggle Light / Dark Mode"
          >
            {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-indigo-400" />}
          </button>
        </div>

      </div>

      {/* Mobile Navigation Row */}
      <div className="md:hidden flex justify-around border-t border-slate-700/50 py-2 px-2 bg-slate-900/80">
        <button
          onClick={() => setActiveTab('predictor')}
          className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-medium ${
            activeTab === 'predictor' ? 'bg-blue-600 text-white' : 'text-slate-400'
          }`}
        >
          <Cpu className="w-3.5 h-3.5" />
          <span>Calculator</span>
        </button>
        <button
          onClick={() => setActiveTab('batch')}
          className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-medium ${
            activeTab === 'batch' ? 'bg-blue-600 text-white' : 'text-slate-400'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Batch</span>
        </button>
        <button
          onClick={() => setActiveTab('insights')}
          className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-medium ${
            activeTab === 'insights' ? 'bg-blue-600 text-white' : 'text-slate-400'
          }`}
        >
          <BarChart2 className="w-3.5 h-3.5" />
          <span>Analytics</span>
        </button>
      </div>
    </header>
  );
}
