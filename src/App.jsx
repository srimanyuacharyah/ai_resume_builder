import React, { useState, useRef } from 'react';
import Navbar from './components/Navbar';
import SettingsModal from './components/SettingsModal';
import UploadModal from './components/UploadModal';
import AIChatInterview from './components/leftPanel/AIChatInterview';
import ManualEditor from './components/leftPanel/ManualEditor';
import ATSAnalytics from './components/leftPanel/ATSAnalytics';
import DesignTemplates from './components/leftPanel/DesignTemplates';
import ResumeCanvas from './components/rightPanel/ResumeCanvas';
import { SAMPLE_RESUME } from './utils/sampleResume';
import { MessageSquareCode, FileEdit, LineChart, Palette } from 'lucide-react';
import html2pdf from 'html2pdf.js';

export default function App() {
  const [resumeData, setResumeData] = useState(SAMPLE_RESUME);
  const [activeTab, setActiveTab] = useState('chat'); // 'chat' | 'editor' | 'ats' | 'design'
  const [activeTemplate, setActiveTemplate] = useState('modern'); // 'modern' | 'executive' | 'minimalist' | 'creative'
  const [themeConfig, setThemeConfig] = useState({ color: 'blue', font: 'sans' });
  const [darkMode, setDarkMode] = useState(true);
  const [heatmapMode, setHeatmapMode] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const canvasRef = useRef(null);

  // PDF Export Handler
  const handleDownloadPdf = async () => {
    setIsGeneratingPdf(true);
    const element = document.getElementById('resume-canvas');

    if (!element) {
      setIsGeneratingPdf(false);
      return;
    }

    const filename = `${(resumeData.personalInfo?.fullName || 'Resume').replace(/\s+/g, '_')}_ResumAI.pdf`;

    const opt = {
      margin: 0,
      filename: filename,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, logging: false },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    try {
      await html2pdf().set(opt).from(element).save();
    } catch (err) {
      console.error("PDF generation error fallback to print:", err);
      window.print();
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleResetSample = () => {
    setResumeData(SAMPLE_RESUME);
  };

  const handleUpdateBulletInResume = (oldBulletText, newBulletText) => {
    setResumeData(prev => ({
      ...prev,
      workExperience: (prev.workExperience || []).map(exp => ({
        ...exp,
        bullets: (exp.bullets || []).map(b => b === oldBulletText ? newBulletText : b)
      }))
    }));
  };

  const navTabs = [
    { id: 'chat', label: 'AI Recruiter Interview', icon: MessageSquareCode, badge: 'AI Live' },
    { id: 'editor', label: 'Manual Editor', icon: FileEdit },
    { id: 'ats', label: 'ATS Analytics & Heatmap', icon: LineChart, badge: 'Score 85+' },
    { id: 'design', label: 'Templates & Design', icon: Palette }
  ];

  return (
    <div className={`min-h-screen flex flex-col ${darkMode ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* Top Navbar */}
      <Navbar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenUpload={() => setIsUploadOpen(true)}
        onResetSample={handleResetSample}
        onDownloadPdf={handleDownloadPdf}
        isGeneratingPdf={isGeneratingPdf}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-[1700px] w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT PANEL: 5 cols */}
        <div className="lg:col-span-5 flex flex-col space-y-4">
          
          {/* Tabbed Navigation Bar */}
          <div className="p-1.5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between gap-1 overflow-x-auto no-scrollbar">
            {navTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 min-w-[100px] py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 relative ${
                    isActive
                      ? 'bg-gradient-to-r from-brand-600 to-brand-500 text-white shadow-glow-cyan'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="truncate hidden sm:inline">{tab.label}</span>
                  {tab.badge && !isActive && (
                    <span className="hidden xl:inline px-1.5 py-0.2 text-[9px] font-extrabold text-brand-300 bg-brand-500/10 border border-brand-500/20 rounded-full">
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Active Tab View */}
          <div className="flex-1 glass-panel p-4 sm:p-5 rounded-2xl border border-slate-800/80">
            {activeTab === 'chat' && (
              <AIChatInterview 
                resumeData={resumeData} 
                setResumeData={setResumeData} 
                onOpenUpload={() => setIsUploadOpen(true)}
              />
            )}
            {activeTab === 'editor' && (
              <ManualEditor 
                resumeData={resumeData} 
                setResumeData={setResumeData} 
                onOpenUpload={() => setIsUploadOpen(true)}
              />
            )}
            {activeTab === 'ats' && (
              <ATSAnalytics 
                resumeData={resumeData} 
                setResumeData={setResumeData}
                heatmapMode={heatmapMode}
                setHeatmapMode={setHeatmapMode}
              />
            )}
            {activeTab === 'design' && (
              <DesignTemplates 
                activeTemplate={activeTemplate} 
                setActiveTemplate={setActiveTemplate}
                themeConfig={themeConfig}
                setThemeConfig={setThemeConfig}
              />
            )}
          </div>

        </div>

        {/* RIGHT PANEL: 7 cols - Live Resume Canvas */}
        <div className="lg:col-span-7 h-[calc(100vh-100px)] min-h-[600px]">
          <ResumeCanvas
            resumeData={resumeData}
            activeTemplate={activeTemplate}
            themeConfig={themeConfig}
            heatmapMode={heatmapMode}
            setHeatmapMode={setHeatmapMode}
            canvasRef={canvasRef}
            onUpdateBulletInResume={handleUpdateBulletInResume}
          />
        </div>

      </main>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      {/* Upload File Modal */}
      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onResumeExtracted={(newResume) => setResumeData(newResume)}
      />

    </div>
  );
}

