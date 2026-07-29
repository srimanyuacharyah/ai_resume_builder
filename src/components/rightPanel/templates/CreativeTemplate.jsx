import React from 'react';
import { Mail, Phone, MapPin, Globe, Linkedin } from 'lucide-react';

export default function CreativeTemplate({ 
  resumeData, 
  accentHex = '#0c94e8', 
  heatmapMode = false, 
  heatmapData = [],
  onSelectBulletForBoost 
}) {
  const { personalInfo = {}, summary, workExperience = [], education = [], skills = {}, projects = [] } = resumeData;

  const renderBullet = (bulletText, parentContext = {}) => {
    if (!heatmapMode) return <span>{bulletText}</span>;

    const item = heatmapData.find(h => h.bulletText === bulletText) || {
      rating: /\d+%|\$\d+|\d+\+/.test(bulletText) ? 'strong' : 'moderate'
    };

    const ratingColors = {
      strong: 'bg-emerald-50 text-emerald-900 border-emerald-300',
      moderate: 'bg-amber-50 text-amber-900 border-amber-300',
      weak: 'bg-rose-50 text-rose-900 border-rose-300 cursor-pointer'
    };

    return (
      <div 
        onClick={() => {
          if (item.rating !== 'strong' && onSelectBulletForBoost) {
            onSelectBulletForBoost(bulletText, parentContext.position, parentContext.company);
          }
        }}
        className={`p-1.5 rounded border text-xs leading-relaxed my-1 ${ratingColors[item.rating] || 'bg-slate-50'}`}
      >
        <div>{bulletText}</div>
      </div>
    );
  };

  return (
    <div className="bg-white text-slate-900 max-w-[850px] mx-auto shadow-2xl rounded-sm font-sans flex min-h-[900px]">
      
      {/* Left Sidebar */}
      <div className="w-1/3 p-6 text-white text-xs space-y-6 shrink-0" style={{ backgroundColor: accentHex }}>
        <div>
          <h1 className="text-xl font-black uppercase tracking-tight leading-tight">
            {personalInfo.fullName || "Your Name"}
          </h1>
          <p className="text-xs opacity-90 font-medium mt-1">
            {personalInfo.jobTitle || "Title"}
          </p>
        </div>

        {/* Contact info */}
        <div className="space-y-2 opacity-90 text-[11px]">
          {personalInfo.email && <div className="flex items-center gap-1.5"><Mail className="w-3 h-3 shrink-0" /> <span className="truncate">{personalInfo.email}</span></div>}
          {personalInfo.phone && <div className="flex items-center gap-1.5"><Phone className="w-3 h-3 shrink-0" /> <span>{personalInfo.phone}</span></div>}
          {personalInfo.location && <div className="flex items-center gap-1.5"><MapPin className="w-3 h-3 shrink-0" /> <span>{personalInfo.location}</span></div>}
          {personalInfo.linkedin && <div className="flex items-center gap-1.5"><Linkedin className="w-3 h-3 shrink-0" /> <span className="truncate">{personalInfo.linkedin}</span></div>}
        </div>

        {/* Skills */}
        {skills.technical && skills.technical.length > 0 && (
          <div className="space-y-2 pt-3 border-t border-white/20">
            <h3 className="font-bold uppercase tracking-wider text-[11px]">Key Skills</h3>
            <div className="flex flex-wrap gap-1">
              {skills.technical.map((sk, idx) => (
                <span key={idx} className="px-2 py-0.5 rounded bg-white/20 text-[10px] font-medium">
                  {sk}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {education.length > 0 && (
          <div className="space-y-2 pt-3 border-t border-white/20">
            <h3 className="font-bold uppercase tracking-wider text-[11px]">Education</h3>
            {education.map((edu, idx) => (
              <div key={idx} className="text-[11px] leading-snug">
                <div className="font-bold">{edu.degree}</div>
                <div className="opacity-80">{edu.institution}</div>
                <div className="opacity-70 text-[10px]">{edu.endDate}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="w-2/3 p-8 space-y-6 text-xs">
        {summary && (
          <div>
            <h2 className="font-bold uppercase tracking-wider text-slate-400 mb-1 border-b pb-1 text-[11px]">About Me</h2>
            <p className="text-slate-700 leading-relaxed">{summary}</p>
          </div>
        )}

        {workExperience.length > 0 && (
          <div>
            <h2 className="font-bold uppercase tracking-wider text-slate-400 mb-3 border-b pb-1 text-[11px]">Work Experience</h2>
            <div className="space-y-4">
              {workExperience.map((exp, idx) => (
                <div key={exp.id || idx}>
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-bold text-slate-900">{exp.position}</h3>
                    <span className="text-[11px] text-slate-400">{exp.startDate} – {exp.endDate}</span>
                  </div>
                  <div className="text-[11px] font-semibold text-slate-500 mb-1">{exp.company}</div>
                  <ul className="list-disc ml-4 text-slate-700 space-y-1">
                    {(exp.bullets || []).map((bullet, bIdx) => (
                      <li key={bIdx}>{renderBullet(bullet, { position: exp.position, company: exp.company })}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
