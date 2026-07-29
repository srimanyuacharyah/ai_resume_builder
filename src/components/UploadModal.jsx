import React, { useState, useRef } from 'react';
import { 
  X, UploadCloud, FileText, CheckCircle2, AlertCircle, FileCode, FileSpreadsheet, Image as ImageIcon
} from 'lucide-react';
import { parseUploadedResumeFile } from '../services/geminiService';

export default function UploadModal({ isOpen, onClose, onResumeExtracted }) {
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleFileProcess = async (file) => {
    if (!file) return;

    setIsUploading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const extractedResume = await parseUploadedResumeFile(file);
      onResumeExtracted(extractedResume);
      
      const expCount = extractedResume.workExperience?.length || 0;
      const skillCount = (extractedResume.skills?.technical?.length || 0) + (extractedResume.skills?.soft?.length || 0);
      
      setSuccessMsg(`Successfully parsed "${file.name}"! Extracted ${expCount} work positions and ${skillCount} skills.`);
      setTimeout(() => {
        setIsUploading(false);
        setSuccessMsg(null);
        onClose();
      }, 1500);
    } catch (err) {
      console.error("Upload error:", err);
      setErrorMsg(err.message || "Failed to parse document. Please ensure your Gemini API key is active or try another file format.");
      setIsUploading(false);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const supportedFormats = [
    { label: 'PDF Documents', ext: '.pdf', icon: FileText },
    { label: 'Word (.docx/.doc)', ext: '.docx', icon: FileText },
    { label: 'Plain Text & Markdown', ext: '.txt, .md', icon: FileCode },
    { label: 'JSON Resume Backup', ext: '.json', icon: FileCode },
    { label: 'Images (PNG/JPG)', ext: '.png, .jpg', icon: ImageIcon }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl space-y-4 p-6">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-brand-500/10 text-brand-400 border border-brand-500/20">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-100">Upload Resume File</h3>
              <p className="text-xs text-slate-400">Import existing resumes in PDF, DOCX, TXT, or Image format</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Upload Drop Zone */}
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-3 ${
            dragActive 
              ? 'border-brand-400 bg-brand-500/10 scale-[1.01]' 
              : 'border-slate-800 hover:border-brand-500/50 bg-slate-950/60 hover:bg-slate-950/90'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx,.doc,.txt,.json,.md,.rtf,.png,.jpg,.jpeg"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFileProcess(e.target.files[0]);
              }
            }}
            className="hidden"
          />

          <div className="w-14 h-14 rounded-2xl bg-brand-500/10 text-brand-400 border border-brand-500/20 flex items-center justify-center shadow-glow-cyan">
            <UploadCloud className={`w-7 h-7 ${isUploading ? 'animate-bounce' : ''}`} />
          </div>

          {isUploading ? (
            <div className="space-y-2">
              <span className="text-xs font-bold text-brand-300 animate-pulse block">
                Extracting Resume Info with Gemini AI...
              </span>
              <div className="w-48 h-1.5 rounded-full bg-slate-800 overflow-hidden mx-auto">
                <div className="h-full bg-gradient-to-r from-brand-500 to-cyan-400 animate-pulse w-3/4 rounded-full" />
              </div>
            </div>
          ) : (
            <div>
              <p className="text-xs font-bold text-slate-200">
                Click or drag & drop your resume file here
              </p>
              <p className="text-[11px] text-slate-500 mt-1">
                Supports PDF, Word (.docx), TXT, Markdown, JSON, and Images up to 25MB
              </p>
            </div>
          )}
        </div>

        {/* Messages */}
        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-start gap-2.5 animate-fadeIn">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <span className="leading-relaxed">{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-start gap-2.5 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span className="leading-relaxed">{successMsg}</span>
          </div>
        )}

        {/* Supported Format Tags */}
        <div className="pt-2 border-t border-slate-800/80">
          <span className="text-[11px] font-semibold text-slate-400 block mb-2">Supported File Formats:</span>
          <div className="flex flex-wrap gap-1.5 text-[10px]">
            {supportedFormats.map((fmt, idx) => {
              const Icon = fmt.icon;
              return (
                <span key={idx} className="px-2 py-1 rounded-lg bg-slate-800/80 border border-slate-700/60 text-slate-300 flex items-center gap-1">
                  <Icon className="w-3 h-3 text-brand-400" />
                  {fmt.label}
                </span>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
