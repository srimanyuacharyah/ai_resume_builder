import React from 'react';

export default function ExecutiveTemplate({ 
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
      rating: /\d+%|\$\d+|\d+\+/.test(bulletText) ? 'strong' : 'moderate',
      explanation: 'Evaluated by Heatmap.'
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
        <div className="font-bold text-[10px] uppercase mb-0.5 no-print">
          {item.rating === 'strong' ? '🟢 Strong Impact' : item.rating === 'moderate' ? '🟡 Needs Metric' : '🔴 Weak Bullet (AI Boost)'}
        </div>
        <div>{bulletText}</div>
      </div>
    );
  };

  return (
    <div className="p-10 sm:p-14 bg-white text-slate-900 max-w-[850px] mx-auto shadow-2xl rounded-sm font-serif leading-relaxed">
      
      {/* Header Centered */}
      <div className="text-center border-b-2 pb-6 mb-6" style={{ borderColor: accentHex }}>
        <h1 className="text-3xl font-bold text-slate-900 tracking-wide uppercase">
          {personalInfo.fullName || "Your Full Name"}
        </h1>
        <p className="text-sm font-sans font-medium tracking-widest uppercase mt-1" style={{ color: accentHex }}>
          {personalInfo.jobTitle || "Executive Title"}
        </p>

        <div className="flex flex-wrap justify-center items-center gap-x-3 gap-y-1 mt-3 text-xs text-slate-600 font-sans">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>• {personalInfo.phone}</span>}
          {personalInfo.location && <span>• {personalInfo.location}</span>}
          {personalInfo.linkedin && <span>• {personalInfo.linkedin}</span>}
        </div>
      </div>

      {/* Executive Summary */}
      {summary && (
        <div className="mb-6">
          <h2 className="text-xs font-sans font-bold uppercase tracking-widest mb-2 border-b pb-1 text-slate-800" style={{ borderColor: accentHex }}>
            Executive Summary
          </h2>
          <p className="text-xs text-slate-800 leading-relaxed italic">
            "{summary}"
          </p>
        </div>
      )}

      {/* Leadership Experience */}
      {workExperience.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xs font-sans font-bold uppercase tracking-widest mb-3 border-b pb-1 text-slate-800" style={{ borderColor: accentHex }}>
            Professional Experience
          </h2>
          <div className="space-y-4 font-sans">
            {workExperience.map((exp, idx) => (
              <div key={exp.id || idx}>
                <div className="flex justify-between items-baseline">
                  <h3 className="text-sm font-bold text-slate-900">
                    {exp.position} <span className="font-semibold text-slate-700">| {exp.company}</span>
                  </h3>
                  <span className="text-xs font-medium text-slate-500">{exp.startDate} – {exp.endDate}</span>
                </div>
                <ul className="list-disc list-outside ml-4 text-xs text-slate-700 space-y-1 mt-1">
                  {(exp.bullets || []).map((bullet, bIdx) => (
                    <li key={bIdx}>{renderBullet(bullet, { position: exp.position, company: exp.company })}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {skills.technical && skills.technical.length > 0 && (
        <div className="mb-6 font-sans">
          <h2 className="text-xs font-bold uppercase tracking-widest mb-2 border-b pb-1 text-slate-800" style={{ borderColor: accentHex }}>
            Core Competencies & Expertise
          </h2>
          <div className="text-xs text-slate-700 leading-relaxed">
            {skills.technical.join(' • ')}
          </div>
        </div>
      )}

      {/* Education */}
      {education.length > 0 && (
        <div className="font-sans">
          <h2 className="text-xs font-bold uppercase tracking-widest mb-3 border-b pb-1 text-slate-800" style={{ borderColor: accentHex }}>
            Education & Credentials
          </h2>
          <div className="space-y-2 text-xs">
            {education.map((edu, idx) => (
              <div key={idx} className="flex justify-between">
                <div>
                  <span className="font-bold text-slate-900">{edu.institution}</span> — {edu.degree}
                </div>
                <span className="text-slate-500">{edu.endDate}</span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
