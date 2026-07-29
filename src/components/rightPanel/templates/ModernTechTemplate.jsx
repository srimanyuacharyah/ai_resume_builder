import React from 'react';
import { Mail, Phone, MapPin, Globe, Linkedin, Flame, Sparkles } from 'lucide-react';

export default function ModernTechTemplate({ 
  resumeData, 
  accentHex = '#0c94e8', 
  heatmapMode = false, 
  heatmapData = [],
  onSelectBulletForBoost
}) {
  const { personalInfo = {}, summary, workExperience = [], education = [], skills = {}, projects = [], certifications = [] } = resumeData;

  const renderBullet = (bulletText, parentContext = {}) => {
    if (!heatmapMode) {
      return <span>{bulletText}</span>;
    }

    const item = heatmapData.find(h => h.bulletText === bulletText) || {
      rating: /\d+%|\$\d+|\d+\+/.test(bulletText) ? 'strong' : 'moderate',
      explanation: 'Evaluated by Live ATS Heatmap.'
    };

    const ratingColors = {
      strong: 'bg-emerald-50 text-emerald-800 border-emerald-300',
      moderate: 'bg-amber-50 text-amber-900 border-amber-300',
      weak: 'bg-rose-50 text-rose-900 border-rose-300 cursor-pointer hover:bg-rose-100'
    };

    const ratingBadge = {
      strong: '🟢 High Impact',
      moderate: '🟡 Add Metric',
      weak: '🔴 Weak (Boost)'
    };

    return (
      <div 
        onClick={() => {
          if (item.rating !== 'strong' && onSelectBulletForBoost) {
            onSelectBulletForBoost(bulletText, parentContext.position, parentContext.company);
          }
        }}
        className={`p-1.5 rounded-lg border text-xs leading-relaxed transition-all my-1 relative group ${ratingColors[item.rating] || 'bg-slate-50'}`}
      >
        <div className="flex items-center justify-between gap-2 mb-0.5 no-print">
          <span className="text-[10px] font-bold tracking-wide uppercase px-1.5 py-0.2 rounded bg-white/80 border border-slate-200">
            {ratingBadge[item.rating]}
          </span>
          {item.rating !== 'strong' && (
            <span className="text-[10px] text-brand-700 font-semibold underline opacity-0 group-hover:opacity-100 transition-opacity">
              Click for Instant AI Boost ✨
            </span>
          )}
        </div>
        <div>{bulletText}</div>
        {item.explanation && heatmapMode && (
          <div className="text-[10px] opacity-75 mt-0.5 italic no-print">
            {item.explanation}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="p-8 sm:p-12 bg-white text-slate-900 max-w-[850px] mx-auto shadow-2xl rounded-sm font-sans leading-normal">
      
      {/* Header */}
      <div className="border-b-2 pb-6 mb-6" style={{ borderColor: accentHex }}>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 uppercase">
          {personalInfo.fullName || "Your Full Name"}
        </h1>
        <p className="text-base font-semibold tracking-wide mt-1" style={{ color: accentHex }}>
          {personalInfo.jobTitle || "Professional Title"}
        </p>

        {/* Contact Strip */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3 text-xs text-slate-600">
          {personalInfo.email && (
            <span className="flex items-center gap-1">
              <Mail className="w-3.5 h-3.5 text-slate-400" /> {personalInfo.email}
            </span>
          )}
          {personalInfo.phone && (
            <span className="flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-slate-400" /> {personalInfo.phone}
            </span>
          )}
          {personalInfo.location && (
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" /> {personalInfo.location}
            </span>
          )}
          {personalInfo.website && (
            <span className="flex items-center gap-1">
              <Globe className="w-3.5 h-3.5 text-slate-400" /> {personalInfo.website}
            </span>
          )}
          {personalInfo.linkedin && (
            <span className="flex items-center gap-1">
              <Linkedin className="w-3.5 h-3.5 text-slate-400" /> {personalInfo.linkedin}
            </span>
          )}
        </div>
      </div>

      {/* Summary */}
      {summary && (
        <div className="mb-6">
          <h2 className="text-xs font-extrabold uppercase tracking-wider mb-2 border-b pb-1 text-slate-800" style={{ borderColor: `${accentHex}40` }}>
            Professional Summary
          </h2>
          <p className="text-xs text-slate-700 leading-relaxed">
            {summary}
          </p>
        </div>
      )}

      {/* Work Experience */}
      {workExperience.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xs font-extrabold uppercase tracking-wider mb-3 border-b pb-1 text-slate-800" style={{ borderColor: `${accentHex}40` }}>
            Work Experience
          </h2>
          <div className="space-y-4">
            {workExperience.map((exp, idx) => (
              <div key={exp.id || idx}>
                <div className="flex justify-between items-baseline">
                  <h3 className="text-sm font-bold text-slate-900">
                    {exp.position} <span className="font-normal text-slate-600">| {exp.company}</span>
                  </h3>
                  <span className="text-xs font-medium text-slate-500">
                    {exp.startDate} – {exp.endDate}
                  </span>
                </div>
                {exp.location && <div className="text-[11px] text-slate-500 mb-1">{exp.location}</div>}

                <ul className="list-disc list-outside ml-4 text-xs text-slate-700 space-y-1 mt-1">
                  {(exp.bullets || []).map((bullet, bIdx) => (
                    <li key={bIdx} className="leading-relaxed">
                      {renderBullet(bullet, { position: exp.position, company: exp.company })}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {((skills.technical && skills.technical.length > 0) || (skills.soft && skills.soft.length > 0)) && (
        <div className="mb-6">
          <h2 className="text-xs font-extrabold uppercase tracking-wider mb-2 border-b pb-1 text-slate-800" style={{ borderColor: `${accentHex}40` }}>
            Skills & Competencies
          </h2>
          <div className="space-y-2 text-xs">
            {skills.technical && skills.technical.length > 0 && (
              <div>
                <span className="font-bold text-slate-800">Technical: </span>
                <span className="text-slate-700">{skills.technical.join(' • ')}</span>
              </div>
            )}
            {skills.soft && skills.soft.length > 0 && (
              <div>
                <span className="font-bold text-slate-800">Leadership & Soft Skills: </span>
                <span className="text-slate-700">{skills.soft.join(' • ')}</span>
              </div>
            )}
            {skills.tools && skills.tools.length > 0 && (
              <div>
                <span className="font-bold text-slate-800">Tools & Platforms: </span>
                <span className="text-slate-700">{skills.tools.join(' • ')}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Education */}
      {education.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xs font-extrabold uppercase tracking-wider mb-3 border-b pb-1 text-slate-800" style={{ borderColor: `${accentHex}40` }}>
            Education
          </h2>
          <div className="space-y-2">
            {education.map((edu, idx) => (
              <div key={edu.id || idx} className="flex justify-between items-baseline text-xs">
                <div>
                  <h3 className="font-bold text-slate-900">{edu.institution}</h3>
                  <p className="text-slate-700">{edu.degree} {edu.fieldOfStudy && `in ${edu.fieldOfStudy}`}</p>
                </div>
                <span className="text-slate-500 text-right">{edu.endDate}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <div>
          <h2 className="text-xs font-extrabold uppercase tracking-wider mb-3 border-b pb-1 text-slate-800" style={{ borderColor: `${accentHex}40` }}>
            Key Projects
          </h2>
          <div className="space-y-3 text-xs">
            {projects.map((proj, idx) => (
              <div key={proj.id || idx}>
                <h3 className="font-bold text-slate-900">
                  {proj.name} {proj.link && <span className="font-normal text-slate-500 text-[11px]">({proj.link})</span>}
                </h3>
                <p className="text-slate-700 leading-relaxed mt-0.5">{proj.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
