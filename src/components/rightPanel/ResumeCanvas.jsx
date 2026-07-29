import React, { useState, useRef, useEffect } from 'react';
import { 
  ZoomIn, ZoomOut, Maximize2, Download, Flame, Sparkles, X, Check, Copy
} from 'lucide-react';
import ModernTechTemplate from './templates/ModernTechTemplate';
import ExecutiveTemplate from './templates/ExecutiveTemplate';
import MinimalistTemplate from './templates/MinimalistTemplate';
import CreativeTemplate from './templates/CreativeTemplate';
import { COLOR_OPTIONS } from '../leftPanel/DesignTemplates';
import { analyzeBulletPointsHeatmap, optimizeSingleBullet } from '../../services/geminiService';

export default function ResumeCanvas({
  resumeData,
  activeTemplate,
  themeConfig,
  heatmapMode,
  setHeatmapMode,
  canvasRef,
  onUpdateBulletInResume
}) {
  const [zoomLevel, setZoomLevel] = useState(100);
  const [heatmapData, setHeatmapData] = useState([]);
  const [isEvaluatingHeatmap, setIsEvaluatingHeatmap] = useState(false);
  
  // Instant Boost Popup state
  const [boostModalState, setBoostModalState] = useState(null); // { bulletText, position, company, suggestions, isLoading }

  // Heatmap background analysis trigger when heatmapMode is enabled
  useEffect(() => {
    let isMounted = true;
    if (heatmapMode) {
      setIsEvaluatingHeatmap(true);
      analyzeBulletPointsHeatmap(resumeData)
        .then(results => {
          if (isMounted && Array.isArray(results)) {
            setHeatmapData(results);
          }
        })
        .finally(() => {
          if (isMounted) setIsEvaluatingHeatmap(false);
        });
    }
    return () => { isMounted = false; };
  }, [heatmapMode, resumeData]);

  // Color Hex resolution
  const activeColorObj = COLOR_OPTIONS.find(c => c.id === themeConfig.color) || COLOR_OPTIONS[0];
  const accentHex = activeColorObj.hex;

  // Zoom controls
  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 10, 140));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 10, 60));
  const handleZoomReset = () => setZoomLevel(100);

  // Trigger bullet boost modal from canvas click
  const handleSelectBulletForBoost = async (bulletText, position, company) => {
    setBoostModalState({
      bulletText,
      position: position || 'Role',
      company: company || 'Company',
      suggestions: [],
      isLoading: true
    });

    try {
      const suggestions = await optimizeSingleBullet({ bulletText, position, company });
      setBoostModalState(prev => prev ? { ...prev, suggestions, isLoading: false } : null);
    } catch (err) {
      console.error(err);
      setBoostModalState(prev => prev ? { ...prev, isLoading: false } : null);
    }
  };

  const handleApplyBoostSuggestion = (newText) => {
    if (boostModalState && onUpdateBulletInResume) {
      onUpdateBulletInResume(boostModalState.bulletText, newText);
    }
    setBoostModalState(null);
  };

  // Template Renderer Router
  const renderTemplate = () => {
    const props = {
      resumeData,
      accentHex,
      heatmapMode,
      heatmapData,
      onSelectBulletForBoost: handleSelectBulletForBoost
    };

    switch (activeTemplate) {
      case 'executive':
        return <ExecutiveTemplate {...props} />;
      case 'minimalist':
        return <MinimalistTemplate {...props} />;
      case 'creative':
        return <CreativeTemplate {...props} />;
      case 'modern':
      default:
        return <ModernTechTemplate {...props} />;
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-950/80 border border-slate-800/80 rounded-2xl overflow-hidden shadow-2xl relative">
      
      {/* Top Toolbar */}
      <div className="px-4 py-3 border-b border-slate-800 bg-slate-900/90 flex flex-wrap items-center justify-between gap-3 z-10">
        
        {/* Left: Template & Heatmap badge */}
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 capitalize">
            {activeTemplate} Template
          </span>

          <button
            onClick={() => setHeatmapMode(!heatmapMode)}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              heatmapMode 
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-glow-purple' 
                : 'bg-slate-800 hover:bg-slate-700 text-slate-400 border border-slate-700'
            }`}
          >
            <Flame className={`w-3.5 h-3.5 ${heatmapMode ? 'animate-bounce text-amber-400' : ''}`} />
            <span>Heatmap {heatmapMode ? 'ON' : 'OFF'}</span>
          </button>

          {isEvaluatingHeatmap && (
            <span className="text-[11px] text-amber-400 animate-pulse flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Evaluating bullets...
            </span>
          )}
        </div>

        {/* Right: Zoom controls */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={handleZoomOut}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="px-2 font-mono text-slate-300 min-w-[45px] text-center">
            {zoomLevel}%
          </span>
          <button
            onClick={handleZoomIn}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleZoomReset}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors ml-1 border-l border-slate-800"
            title="Reset Zoom"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

      {/* Main Canvas Scroll View */}
      <div className="flex-1 overflow-auto p-4 sm:p-8 flex items-start justify-center bg-slate-950/60 no-scrollbar">
        <div
          ref={canvasRef}
          id="resume-canvas"
          style={{ 
            transform: `scale(${zoomLevel / 100})`, 
            transformOrigin: 'top center',
            transition: 'transform 0.2s ease-out'
          }}
          className="w-full max-w-[850px] shadow-2xl transition-all"
        >
          {renderTemplate()}
        </div>
      </div>

      {/* Instant AI Boost Modal Popup */}
      {boostModalState && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl space-y-4 p-6">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-slate-100">AI Bullet Boost Assistant</h4>
              </div>
              <button onClick={() => setBoostModalState(null)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-xs space-y-2">
              <span className="text-slate-400 block font-medium">Original Bullet Point:</span>
              <p className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 italic">
                "{boostModalState.bulletText}"
              </p>
            </div>

            {boostModalState.isLoading ? (
              <div className="py-6 flex flex-col items-center justify-center gap-2 text-xs text-brand-400">
                <div className="w-5 h-5 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
                <span>Generating high-impact metric rewrites...</span>
              </div>
            ) : (
              <div className="space-y-2 text-xs">
                <span className="text-slate-400 block font-medium">Select Rewritten Option:</span>
                {boostModalState.suggestions.map((sug, sIdx) => (
                  <button
                    key={sIdx}
                    onClick={() => handleApplyBoostSuggestion(sug)}
                    className="w-full p-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-brand-500/60 text-left text-slate-200 transition-all flex items-start gap-2.5 group"
                  >
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5 group-hover:scale-125 transition-transform" />
                    <span className="leading-relaxed">{sug}</span>
                  </button>
                ))}
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setBoostModalState(null)}
                className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
