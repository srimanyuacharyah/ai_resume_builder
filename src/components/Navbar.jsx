import React from 'react';
import { Sparkles, Settings, Sun, Moon, Download, RotateCcw, UploadCloud } from 'lucide-react';

export default function Navbar({ 
  darkMode, 
  setDarkMode, 
  onOpenSettings, 
  onOpenUpload,
  onResetSample, 
  onDownloadPdf,
  isGeneratingPdf
}) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-xl transition-colors">
      <div className="max-w-[1700px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        
        {/* Brand logo & tagline */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 via-brand-500 to-cyan-400 p-0.5 shadow-glow-cyan">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-brand-400 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-brand-300">
                Resum<span className="text-brand-400">AI</span> Pro
              </span>
              <span className="px-2 py-0.5 text-[10px] font-semibold tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" />
                100% FREE • NO API KEY REQUIRED
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Autonomous Recruiter AI Interviewer & Real-Time ATS Compatibility Engine
            </p>
          </div>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Upload Resume Button */}
          <button
            onClick={onOpenUpload}
            title="Upload existing resume in PDF, DOCX, TXT, or Image format"
            className="px-3 py-1.5 text-xs font-bold text-slate-200 hover:text-white bg-brand-500/10 hover:bg-brand-500/20 border border-brand-500/30 rounded-xl transition-all flex items-center gap-1.5"
          >
            <UploadCloud className="w-4 h-4 text-brand-400" />
            <span className="hidden sm:inline">Upload Resume</span>
          </button>

          {/* Reset sample data */}
          <button
            onClick={onResetSample}
            title="Load Sample Candidate Data"
            className="px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl transition-all flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden md:inline">Sample Data</span>
          </button>

          {/* Settings Modal Trigger */}
          <button
            onClick={onOpenSettings}
            title="Configure Gemini API Key"
            className="p-2 text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl transition-all relative group"
          >
            <Settings className="w-4 h-4 text-slate-400 group-hover:rotate-45 transition-transform duration-300" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-slate-950" />
          </button>

          {/* Dark / Light mode toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            className="p-2 text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl transition-all"
          >
            {darkMode ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-400" />
            )}
          </button>

          {/* Download PDF CTA */}
          <button
            onClick={onDownloadPdf}
            disabled={isGeneratingPdf}
            className="px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-brand-600 via-brand-500 to-cyan-500 hover:from-brand-500 hover:to-cyan-400 rounded-xl shadow-glow-cyan transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2 disabled:opacity-50"
          >
            {isGeneratingPdf ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Exporting...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Download PDF</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
