import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import PredictorTab from './components/PredictorTab';
import BatchScreener from './components/BatchScreener';
import ModelInsights from './components/ModelInsights';

export default function App() {
  const [activeTab, setActiveTab] = useState('predictor');
  const [darkMode, setDarkMode] = useState(true);
  const [modelInfo, setModelInfo] = useState(null);

  // Sync theme class to document element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Load model analytics on startup
  useEffect(() => {
    const fetchModelInfo = async () => {
      try {
        const res = await fetch('/api/model-info');
        if (res.ok) {
          const data = await res.json();
          setModelInfo(data);
        }
      } catch (err) {
        console.error('Failed to load model info:', err);
      }
    };
    fetchModelInfo();
  }, []);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        modelHealth={modelInfo}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {activeTab === 'predictor' && <PredictorTab />}
        {activeTab === 'batch' && <BatchScreener />}
        {activeTab === 'insights' && <ModelInsights modelInfo={modelInfo} />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/60 py-6 text-center text-xs text-slate-500">
        <p>© 2026 GlycoPredict AI — Advanced Machine Learning Diabetes Risk Stratification System</p>
        <p className="mt-1 text-[10px] text-slate-600">Built with React, Flask & Scikit-Learn | Clinical Decision Support Tool</p>
      </footer>

    </div>
  );
}
