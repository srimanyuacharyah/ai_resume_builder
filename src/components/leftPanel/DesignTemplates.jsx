import React from 'react';
import { Palette, Type, Layout, Check, Sparkles } from 'lucide-react';

export const TEMPLATE_OPTIONS = [
  { id: 'modern', name: 'Modern Tech', desc: 'Clean layout with pill badges & modern headers' },
  { id: 'executive', name: 'Executive Sleek', desc: 'Classic serif typography with refined borders' },
  { id: 'minimalist', name: 'Minimalist Clean', desc: 'Single-column design with maximum readability' },
  { id: 'creative', name: 'Creative Vibrant', desc: 'Sidebar layout with accent gradient styling' }
];

export const COLOR_OPTIONS = [
  { id: 'blue', name: 'Brand Cyan', hex: '#0c94e8', bg: 'bg-sky-500' },
  { id: 'emerald', name: 'Emerald Green', hex: '#10b981', bg: 'bg-emerald-500' },
  { id: 'indigo', name: 'Indigo Violet', hex: '#6366f1', bg: 'bg-indigo-500' },
  { id: 'rose', name: 'Rose Red', hex: '#f43f5e', bg: 'bg-rose-500' },
  { id: 'amber', name: 'Amber Gold', hex: '#f59e0b', bg: 'bg-amber-500' },
  { id: 'slate', name: 'Midnight Slate', hex: '#475569', bg: 'bg-slate-600' }
];

export const FONT_OPTIONS = [
  { id: 'sans', name: 'Plus Jakarta Sans', fontClass: 'font-sans' },
  { id: 'inter', name: 'Inter Standard', fontClass: 'font-[' + "'Inter'" + ']' },
  { id: 'serif', name: 'Merriweather Serif', fontClass: 'font-serif' },
  { id: 'mono', name: 'JetBrains Mono', fontClass: 'font-mono' }
];

export default function DesignTemplates({ activeTemplate, setActiveTemplate, themeConfig, setThemeConfig }) {
  return (
    <div className="space-y-6 max-h-[calc(100vh-140px)] overflow-y-auto pr-1">
      
      {/* 1. Template Selection Grid */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold text-slate-200 flex items-center gap-2">
          <Layout className="w-4 h-4 text-brand-400" />
          Choose Resume Template Design
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {TEMPLATE_OPTIONS.map((tmpl) => {
            const isSelected = activeTemplate === tmpl.id;

            return (
              <button
                key={tmpl.id}
                onClick={() => setActiveTemplate(tmpl.id)}
                className={`p-4 rounded-2xl text-left border transition-all relative overflow-hidden group ${
                  isSelected
                    ? 'bg-slate-900 border-brand-500 shadow-glow-cyan'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                {isSelected && (
                  <span className="absolute top-2 right-2 p-1 rounded-full bg-brand-500 text-white">
                    <Check className="w-3 h-3" />
                  </span>
                )}
                <h5 className="text-xs font-bold text-slate-100 group-hover:text-brand-300 transition-colors">
                  {tmpl.name}
                </h5>
                <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                  {tmpl.desc}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Color Accent Picker */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
        <h4 className="text-xs font-bold text-slate-200 flex items-center gap-2">
          <Palette className="w-4 h-4 text-brand-400" />
          Accent Color Theme
        </h4>

        <div className="flex items-center gap-3 overflow-x-auto pb-1">
          {COLOR_OPTIONS.map((color) => {
            const isSelected = themeConfig.color === color.id;

            return (
              <button
                key={color.id}
                onClick={() => setThemeConfig({ ...themeConfig, color: color.id })}
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-transform ${color.bg} ${
                  isSelected ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-950 scale-110' : 'hover:scale-105'
                }`}
                title={color.name}
              >
                {isSelected && <Check className="w-4 h-4 text-white drop-shadow" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Typography Selector */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
        <h4 className="text-xs font-bold text-slate-200 flex items-center gap-2">
          <Type className="w-4 h-4 text-brand-400" />
          Typography Font Family
        </h4>

        <div className="grid grid-cols-2 gap-2 text-xs">
          {FONT_OPTIONS.map((font) => {
            const isSelected = themeConfig.font === font.id;

            return (
              <button
                key={font.id}
                onClick={() => setThemeConfig({ ...themeConfig, font: font.id })}
                className={`p-3 rounded-xl border text-left font-medium transition-all ${
                  isSelected
                    ? 'bg-brand-500/20 border-brand-500/50 text-brand-300'
                    : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                } ${font.fontClass}`}
              >
                {font.name}
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
}
