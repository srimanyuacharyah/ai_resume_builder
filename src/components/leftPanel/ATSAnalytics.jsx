import React, { useState, useEffect } from 'react';
import { 
  BarChart3, CheckCircle2, AlertTriangle, Lightbulb, Zap, Plus, 
  RefreshCw, Target, ShieldAlert, Sparkles, Flame
} from 'lucide-react';
import { analyzeResumeATS } from '../../services/geminiService';

export default function ATSAnalytics({ resumeData, setResumeData, heatmapMode, setHeatmapMode }) {
  const [jobDescription, setJobDescription] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const runAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const result = await analyzeResumeATS({
        resume: resumeData,
        targetJobDescription: jobDescription
      });
      setAnalysis(result);
    } catch (err) {
      console.error("ATS analysis error:", err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  useEffect(() => {
    runAnalysis();
  }, [resumeData]);

  const addKeywordToSkills = (keyword) => {
    setResumeData(prev => {
      const existing = prev.skills?.technical || [];
      if (existing.includes(keyword)) return prev;
      return {
        ...prev,
        skills: {
          ...prev.skills,
          technical: [...existing, keyword]
        }
      };
    });
  };

  const getScoreColor = (score) => {
    if (score >= 85) return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
    if (score >= 70) return 'text-amber-400 border-amber-500/30 bg-amber-500/10';
    return 'text-rose-400 border-rose-500/30 bg-rose-500/10';
  };

  return (
    <div className="space-y-5 max-h-[calc(100vh-140px)] overflow-y-auto pr-1">
      
      {/* Heatmap Overlay Toggle Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-brand-950/40 to-slate-900 border border-brand-500/30 flex items-center justify-between shadow-glow-cyan">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl ${heatmapMode ? 'bg-amber-500/20 text-amber-400 animate-pulse' : 'bg-slate-800 text-slate-400'}`}>
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-100">Live Canvas Heatmap View</h4>
            <p className="text-[11px] text-slate-400">Color-code bullet points on preview canvas</p>
          </div>
        </div>

        <button
          onClick={() => setHeatmapMode(!heatmapMode)}
          className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${
            heatmapMode 
              ? 'bg-amber-500 text-slate-950 shadow-glow-purple' 
              : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
          }`}
        >
          <Flame className="w-4 h-4" />
          <span>{heatmapMode ? "Heatmap Active" : "Enable Heatmap"}</span>
        </button>
      </div>

      {/* Target Job Description Input */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-200 flex items-center gap-2">
            <Target className="w-4 h-4 text-brand-400" />
            Target Job Description (Optional)
          </label>
          <button
            onClick={runAnalysis}
            disabled={isAnalyzing}
            className="px-2.5 py-1 text-[11px] font-medium text-brand-300 hover:text-white bg-brand-500/10 hover:bg-brand-500/20 border border-brand-500/30 rounded-lg transition-all flex items-center gap-1"
          >
            <RefreshCw className={`w-3 h-3 ${isAnalyzing ? 'animate-spin' : ''}`} />
            <span>Re-Analyze</span>
          </button>
        </div>
        <textarea
          rows={3}
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Paste job posting text here to evaluate keyword matching and targeted role alignment..."
          className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:border-brand-500 focus:outline-none placeholder:text-slate-500"
        />
      </div>

      {/* Score Header */}
      {analysis && (
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Overall ATS Score</span>
              <h3 className="text-2xl font-extrabold text-slate-100">
                {analysis.score} <span className="text-sm font-medium text-slate-400">/ 100</span>
              </h3>
            </div>
            
            <div className={`px-4 py-2 rounded-2xl border text-xl font-black ${getScoreColor(analysis.score)}`}>
              {analysis.score >= 85 ? "EXCELLENT" : analysis.score >= 70 ? "GOOD" : "NEEDS BOOST"}
            </div>
          </div>

          {/* Breakdown Progress Bars */}
          <div className="space-y-2.5 pt-2 border-t border-slate-800 text-xs">
            {analysis.scoreBreakdown && Object.entries(analysis.scoreBreakdown).map(([key, val]) => {
              const labelMap = {
                keywordMatch: 'Keyword Matching',
                actionVerbDensity: 'Action Verb Strength',
                quantifiableImpact: 'Quantifiable Metrics (% & $)',
                formattingBrevity: 'Structure & Brevity'
              };

              return (
                <div key={key} className="space-y-1">
                  <div className="flex justify-between text-slate-300 font-medium">
                    <span>{labelMap[key] || key}</span>
                    <span className="font-mono text-brand-300">{val}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-700 rounded-full ${
                        val >= 80 ? 'bg-emerald-500' : val >= 65 ? 'bg-amber-500' : 'bg-rose-500'
                      }`}
                      style={{ width: `${val}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* Keyword Analysis */}
      {analysis?.keywordAnalysis && (
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3 text-xs">
          <h4 className="font-bold text-slate-200 flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            ATS Keyword Alignment
          </h4>

          {/* Matched */}
          <div>
            <span className="text-slate-400 block mb-1.5 font-medium">Matched Keywords ({analysis.keywordAnalysis.matched?.length || 0}):</span>
            <div className="flex flex-wrap gap-1.5">
              {(analysis.keywordAnalysis.matched || []).map((kw, i) => (
                <span key={i} className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[11px] font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> {kw}
                </span>
              ))}
            </div>
          </div>

          {/* Missing */}
          <div className="pt-2">
            <span className="text-slate-400 block mb-1.5 font-medium">Missing Target Keywords ({analysis.keywordAnalysis.missing?.length || 0}):</span>
            <div className="flex flex-wrap gap-1.5">
              {(analysis.keywordAnalysis.missing || []).map((kw, i) => (
                <button
                  key={i}
                  onClick={() => addKeywordToSkills(kw)}
                  title="Click to add to Technical Skills"
                  className="px-2.5 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-300 text-[11px] font-medium flex items-center gap-1 transition-all group"
                >
                  <span>{kw}</span>
                  <Plus className="w-3 h-3 text-rose-400 group-hover:scale-125 transition-transform" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Strengths & Actionable Tips */}
      {analysis && (
        <div className="space-y-3 text-xs">
          
          {/* Strengths */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
            <h5 className="font-bold text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> Top Resume Strengths
            </h5>
            <ul className="space-y-1 text-slate-300 list-disc list-inside">
              {(analysis.topStrengths || []).map((st, idx) => (
                <li key={idx} className="leading-relaxed">{st}</li>
              ))}
            </ul>
          </div>

          {/* Actionable Tips */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
            <h5 className="font-bold text-amber-400 flex items-center gap-1.5">
              <Lightbulb className="w-4 h-4" /> Recommended ATS Fixes
            </h5>
            <ul className="space-y-1 text-slate-300 list-disc list-inside">
              {(analysis.actionableTips || []).map((tip, idx) => (
                <li key={idx} className="leading-relaxed">{tip}</li>
              ))}
            </ul>
          </div>

        </div>
      )}

    </div>
  );
}
