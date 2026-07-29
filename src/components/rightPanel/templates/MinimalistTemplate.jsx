import React from 'react';

export default function MinimalistTemplate({ 
  resumeData, 
  accentHex = '#0c94e8', 
  heatmapMode = false, 
  heatmapData = [],
  onSelectBulletForBoost 
}) {
  const { personalInfo = {}, summary, workExperience = [], education = [], skills = [], projects = [] } = resumeData;

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
    <div className="p-8 sm:p-12 bg-white text-slate-900 max-w-[850px] mx-auto shadow-2xl rounded-sm font-sans leading-relaxed">
      
      {/* Minimal Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          {personalInfo.fullName || "Your Full Name"}
        </h1>
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mt-0.5">
          {personalInfo.jobTitle || "Professional Title"}
        </p>

        <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2 text-[11px] text-slate-500">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>/ {personalInfo.phone}</span>}
          {personalInfo.location && <span>/ {personalInfo.location}</span>}
          {personalInfo.linkedin && <span>/ {personalInfo.linkedin}</span>}
        </div>
      </div>

      {summary && (
        <div className="mb-5">
          <p className="text-xs text-slate-700 leading-relaxed">
            {summary}
          </p>
        </div>
      )}

      {/* Experience */}
      {workExperience.length > 0 && (
        <div className="mb-6 space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">Experience</h2>
          {workExperience.map((exp, idx) => (
            <div key={exp.id || idx}>
              <div className="flex justify-between items-baseline text-xs">
                <h3 className="font-bold text-slate-900">{exp.position} — <span className="font-normal text-slate-600">{exp.company}</span></h3>
                <span className="text-[11px] text-slate-400">{exp.startDate} – {exp.endDate}</span>
              </div>
              <ul className="list-disc ml-4 text-xs text-slate-700 space-y-1 mt-1">
                {(exp.bullets || []).map((bullet, bIdx) => (
                  <li key={bIdx}>{renderBullet(bullet, { position: exp.position, company: exp.company })}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {education.length > 0 && (
        <div className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Education</h2>
          {education.map((edu, idx) => (
            <div key={idx} className="flex justify-between text-xs">
              <span className="font-bold text-slate-900">{edu.institution} <span className="font-normal">({edu.degree})</span></span>
              <span className="text-slate-400">{edu.endDate}</span>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
