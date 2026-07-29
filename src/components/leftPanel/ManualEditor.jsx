import React, { useState } from 'react';
import { 
  User, Briefcase, GraduationCap, Award, Code, FolderGit2, 
  Plus, Trash2, ChevronDown, ChevronUp, Sparkles, Wand2, Check, UploadCloud
} from 'lucide-react';
import { optimizeSingleBullet } from '../../services/geminiService';

export default function ManualEditor({ resumeData, setResumeData, onOpenUpload }) {
  const [activeSection, setActiveSection] = useState('personalInfo');
  const [optimizingBulletIdx, setOptimizingBulletIdx] = useState(null);
  const [bulletSuggestions, setBulletSuggestions] = useState(null);

  // Helper updaters
  const updatePersonalInfo = (field, value) => {
    setResumeData(prev => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: value }
    }));
  };

  const updateSummary = (value) => {
    setResumeData(prev => ({ ...prev, summary: value }));
  };

  // Work Experience Handlers
  const addWorkExperience = () => {
    const newExp = {
      id: 'exp_' + Date.now(),
      company: 'New Company',
      position: 'Role Title',
      location: 'City, State',
      startDate: '2023-01',
      endDate: 'Present',
      current: true,
      bullets: ['Spearheaded strategic initiatives driving measurable impact.']
    };
    setResumeData(prev => ({
      ...prev,
      workExperience: [newExp, ...prev.workExperience]
    }));
  };

  const updateWorkExp = (id, field, value) => {
    setResumeData(prev => ({
      ...prev,
      workExperience: prev.workExperience.map(exp => exp.id === id ? { ...exp, [field]: value } : exp)
    }));
  };

  const removeWorkExp = (id) => {
    setResumeData(prev => ({
      ...prev,
      workExperience: prev.workExperience.filter(exp => exp.id !== id)
    }));
  };

  const updateWorkBullet = (expId, bulletIdx, text) => {
    setResumeData(prev => ({
      ...prev,
      workExperience: prev.workExperience.map(exp => {
        if (exp.id !== expId) return exp;
        const newBullets = [...exp.bullets];
        newBullets[bulletIdx] = text;
        return { ...exp, bullets: newBullets };
      })
    }));
  };

  const addWorkBullet = (expId) => {
    setResumeData(prev => ({
      ...prev,
      workExperience: prev.workExperience.map(exp => {
        if (exp.id !== expId) return exp;
        return { ...exp, bullets: [...exp.bullets, 'Achieved X metric by implementing Y technology.'] };
      })
    }));
  };

  const removeWorkBullet = (expId, bulletIdx) => {
    setResumeData(prev => ({
      ...prev,
      workExperience: prev.workExperience.map(exp => {
        if (exp.id !== expId) return exp;
        return { ...exp, bullets: exp.bullets.filter((_, idx) => idx !== bulletIdx) };
      })
    }));
  };

  // Instant AI Bullet Enhancer
  const handleAIEnhanceBullet = async (expId, bulletIdx, bulletText, position, company) => {
    setOptimizingBulletIdx(`${expId}_${bulletIdx}`);
    try {
      const suggestions = await optimizeSingleBullet({ bulletText, position, company });
      setBulletSuggestions({ expId, bulletIdx, suggestions });
    } catch (err) {
      console.error("AI Enhance error:", err);
    } finally {
      setOptimizingBulletIdx(null);
    }
  };

  const applyBulletSuggestion = (expId, bulletIdx, suggestionText) => {
    updateWorkBullet(expId, bulletIdx, suggestionText);
    setBulletSuggestions(null);
  };

  // Education Handlers
  const addEducation = () => {
    const newEdu = {
      id: 'edu_' + Date.now(),
      institution: 'University Name',
      degree: 'Bachelor of Science',
      fieldOfStudy: 'Computer Science',
      startDate: '2018-08',
      endDate: '2022-05',
      gpa: '3.8'
    };
    setResumeData(prev => ({ ...prev, education: [...prev.education, newEdu] }));
  };

  const updateEducation = (id, field, value) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.map(edu => edu.id === id ? { ...edu, [field]: value } : edu)
    }));
  };

  const removeEducation = (id) => {
    setResumeData(prev => ({ ...prev, education: prev.education.filter(edu => edu.id !== id) }));
  };

  // Skills Tag Input
  const updateSkillsList = (category, commaString) => {
    const arr = commaString.split(',').map(s => s.trim()).filter(Boolean);
    setResumeData(prev => ({
      ...prev,
      skills: { ...prev.skills, [category]: arr }
    }));
  };

  const sections = [
    { id: 'personalInfo', label: 'Personal Details', icon: User },
    { id: 'summary', label: 'Summary', icon: Wand2 },
    { id: 'workExperience', label: 'Work Experience', icon: Briefcase },
    { id: 'education', label: 'Education', icon: GraduationCap },
    { id: 'skills', label: 'Skills & Tools', icon: Code },
    { id: 'projects', label: 'Projects', icon: FolderGit2 },
    { id: 'certifications', label: 'Certifications', icon: Award }
  ];

  return (
    <div className="space-y-4 max-h-[calc(100vh-140px)] overflow-y-auto pr-1">
      
      {/* Upload Banner */}
      {onOpenUpload && (
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-slate-900 via-brand-950/40 to-slate-900 border border-brand-500/20 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 text-xs">
            <div className="p-2 rounded-xl bg-brand-500/10 text-brand-400">
              <UploadCloud className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-slate-100 block">Have an existing resume?</span>
              <span className="text-[11px] text-slate-400">Import PDF, Word, or TXT file to auto-fill</span>
            </div>
          </div>
          <button
            onClick={onOpenUpload}
            className="px-3 py-1.5 text-xs font-bold text-brand-300 bg-brand-500/10 hover:bg-brand-500/20 border border-brand-500/30 rounded-xl transition-all"
          >
            Upload File
          </button>
        </div>
      )}
      
      {/* Accordion Tabs */}
      {sections.map(sec => {
        const Icon = sec.icon;
        const isOpen = activeSection === sec.id;

        return (
          <div 
            key={sec.id}
            className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden transition-all"
          >
            {/* Header */}
            <button
              onClick={() => setActiveSection(isOpen ? null : sec.id)}
              className="w-full px-5 py-4 flex items-center justify-between hover:bg-slate-800/50 transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl border ${
                  isOpen 
                    ? 'bg-brand-500/20 text-brand-400 border-brand-500/30' 
                    : 'bg-slate-800 text-slate-400 border-slate-700/60'
                }`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-sm font-bold text-slate-100">{sec.label}</span>
              </div>
              {isOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </button>

            {/* Body */}
            {isOpen && (
              <div className="px-5 pb-5 pt-2 border-t border-slate-800/80 space-y-4 animate-fadeIn">
                
                {/* 1. PERSONAL DETAILS */}
                {sec.id === 'personalInfo' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block font-medium text-slate-400 mb-1">Full Name</label>
                      <input
                        type="text"
                        value={resumeData.personalInfo?.fullName || ''}
                        onChange={(e) => updatePersonalInfo('fullName', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:border-brand-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-slate-400 mb-1">Target Job Title</label>
                      <input
                        type="text"
                        value={resumeData.personalInfo?.jobTitle || ''}
                        onChange={(e) => updatePersonalInfo('jobTitle', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:border-brand-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-slate-400 mb-1">Email</label>
                      <input
                        type="email"
                        value={resumeData.personalInfo?.email || ''}
                        onChange={(e) => updatePersonalInfo('email', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:border-brand-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-slate-400 mb-1">Phone</label>
                      <input
                        type="text"
                        value={resumeData.personalInfo?.phone || ''}
                        onChange={(e) => updatePersonalInfo('phone', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:border-brand-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-slate-400 mb-1">Location</label>
                      <input
                        type="text"
                        value={resumeData.personalInfo?.location || ''}
                        onChange={(e) => updatePersonalInfo('location', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:border-brand-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-slate-400 mb-1">LinkedIn Profile</label>
                      <input
                        type="text"
                        value={resumeData.personalInfo?.linkedin || ''}
                        onChange={(e) => updatePersonalInfo('linkedin', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:border-brand-500 focus:outline-none"
                      />
                    </div>
                  </div>
                )}

                {/* 2. SUMMARY */}
                {sec.id === 'summary' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-bold text-slate-200">Professional Summary</label>
                      <span className="text-[11px] font-semibold text-brand-400">✨ 1-Click AI Tone Generators</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => updateSummary(`Senior ${resumeData.personalInfo?.jobTitle || 'Engineer'} with 6+ years of experience building high-throughput microservices, cloud systems, and modern AI architectures (${(resumeData.skills?.technical || []).slice(0, 3).join(', ') || 'React, Node.js'}). Proven leader in scaling engineering productivity by 40%.`)}
                        className="p-2.5 rounded-xl bg-brand-500/10 hover:bg-brand-500/20 border border-brand-500/30 text-[11px] font-semibold text-brand-300 hover:text-white text-left transition-all flex flex-col gap-1"
                      >
                        <span className="font-bold text-brand-400">🎯 Senior Executive</span>
                        <span className="text-[10px] text-slate-400 line-clamp-2">Leadership, architecture & high-level impact</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => updateSummary(`High-impact ${resumeData.personalInfo?.jobTitle || 'Engineer'} specializing in rapid full-stack product development, cloud API design, and performance optimization. Delivered scalable web applications handling 1M+ monthly requests with 99.9% uptime.`)}
                        className="p-2.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-[11px] font-semibold text-cyan-300 hover:text-white text-left transition-all flex flex-col gap-1"
                      >
                        <span className="font-bold text-cyan-400">🚀 Product Specialist</span>
                        <span className="text-[10px] text-slate-400 line-clamp-2">High velocity, user growth & cloud scaling</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => updateSummary(`Innovative ${resumeData.personalInfo?.jobTitle || 'AI Engineer'} pioneering modern Generative AI integrations, LLM orchestration, and automated microservice workflows. Spearheaded core machine learning pipelines reducing operational latency by 45%.`)}
                        className="p-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-[11px] font-semibold text-amber-300 hover:text-white text-left transition-all flex flex-col gap-1"
                      >
                        <span className="font-bold text-amber-400">💡 AI & Innovation</span>
                        <span className="text-[10px] text-slate-400 line-clamp-2">LLM pipelines, automation & ML metrics</span>
                      </button>
                    </div>

                    <textarea
                      rows={4}
                      value={resumeData.summary || ''}
                      onChange={(e) => updateSummary(e.target.value)}
                      placeholder="Write 3-4 sentences highlighting your experience, core tech stack, and key metrics..."
                      className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:border-brand-500 focus:outline-none leading-relaxed"
                    />
                  </div>
                )}

                {/* 3. WORK EXPERIENCE */}
                {sec.id === 'workExperience' && (
                  <div className="space-y-4">
                    <div className="flex justify-end">
                      <button
                        onClick={addWorkExperience}
                        className="px-3 py-1.5 text-xs font-semibold text-brand-300 bg-brand-500/10 hover:bg-brand-500/20 border border-brand-500/30 rounded-xl transition-all flex items-center gap-1.5"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add Experience
                      </button>
                    </div>

                    {(resumeData.workExperience || []).map((exp, expIdx) => (
                      <div key={exp.id || expIdx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-bold text-brand-400">Position #{expIdx + 1}</span>
                          <button
                            onClick={() => removeWorkExp(exp.id)}
                            className="p-1 text-rose-400 hover:bg-rose-500/10 rounded transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                          <input
                            type="text"
                            placeholder="Company"
                            value={exp.company}
                            onChange={(e) => updateWorkExp(exp.id, 'company', e.target.value)}
                            className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-100"
                          />
                          <input
                            type="text"
                            placeholder="Job Title"
                            value={exp.position}
                            onChange={(e) => updateWorkExp(exp.id, 'position', e.target.value)}
                            className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-100"
                          />
                          <input
                            type="text"
                            placeholder="Start Date (e.g. 2022-01)"
                            value={exp.startDate}
                            onChange={(e) => updateWorkExp(exp.id, 'startDate', e.target.value)}
                            className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-100"
                          />
                          <input
                            type="text"
                            placeholder="End Date or Present"
                            value={exp.endDate}
                            onChange={(e) => updateWorkExp(exp.id, 'endDate', e.target.value)}
                            className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-100"
                          />
                        </div>

                        {/* Bullets */}
                        <div className="space-y-2 pt-2 border-t border-slate-800/80">
                          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400">
                            <span>Key Bullet Points & Accomplishments</span>
                            <button
                              onClick={() => addWorkBullet(exp.id)}
                              className="text-brand-400 hover:underline flex items-center gap-1"
                            >
                              <Plus className="w-3 h-3" /> Add Bullet
                            </button>
                          </div>

                          {(exp.bullets || []).map((bullet, bIdx) => (
                            <div key={bIdx} className="space-y-1">
                              <div className="flex items-start gap-2">
                                <textarea
                                  rows={2}
                                  value={bullet}
                                  onChange={(e) => updateWorkBullet(exp.id, bIdx, e.target.value)}
                                  className="w-full p-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-100 focus:border-brand-500 focus:outline-none"
                                />
                                <div className="flex flex-col gap-1">
                                  <button
                                    onClick={() => handleAIEnhanceBullet(exp.id, bIdx, bullet, exp.position, exp.company)}
                                    disabled={optimizingBulletIdx === `${exp.id}_${bIdx}`}
                                    title="AI Instant Bullet Booster"
                                    className="p-1.5 text-amber-400 hover:bg-amber-400/10 border border-amber-400/20 rounded-lg transition-all"
                                  >
                                    <Sparkles className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => removeWorkBullet(exp.id, bIdx)}
                                    className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>

                              {/* AI Suggestion Dropdown */}
                              {bulletSuggestions && bulletSuggestions.expId === exp.id && bulletSuggestions.bulletIdx === bIdx && (
                                <div className="p-3 bg-slate-900 border border-amber-500/30 rounded-xl space-y-2 animate-fadeIn text-xs">
                                  <div className="flex items-center gap-1.5 text-amber-300 font-semibold">
                                    <Sparkles className="w-3.5 h-3.5" />
                                    <span>AI Instant Metrics Rewrite Suggestions:</span>
                                  </div>
                                  {bulletSuggestions.suggestions.map((sug, sIdx) => (
                                    <div
                                      key={sIdx}
                                      onClick={() => applyBulletSuggestion(exp.id, bIdx, sug)}
                                      className="p-2 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-brand-500 cursor-pointer transition-all flex items-start gap-2"
                                    >
                                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                                      <span className="text-slate-200">{sug}</span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* 4. EDUCATION */}
                {sec.id === 'education' && (
                  <div className="space-y-3">
                    <div className="flex justify-end">
                      <button
                        onClick={addEducation}
                        className="px-3 py-1.5 text-xs font-semibold text-brand-300 bg-brand-500/10 border border-brand-500/30 rounded-xl flex items-center gap-1.5"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add Education
                      </button>
                    </div>

                    {(resumeData.education || []).map((edu, eduIdx) => (
                      <div key={edu.id || eduIdx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-brand-400">Education #{eduIdx + 1}</span>
                          <button onClick={() => removeEducation(edu.id)} className="text-rose-400 p-1">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                          <input
                            type="text"
                            placeholder="Institution"
                            value={edu.institution}
                            onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                            className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-100"
                          />
                          <input
                            type="text"
                            placeholder="Degree & Major"
                            value={edu.degree}
                            onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                            className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-100"
                          />
                          <input
                            type="text"
                            placeholder="Graduation Year"
                            value={edu.endDate}
                            onChange={(e) => updateEducation(edu.id, 'endDate', e.target.value)}
                            className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-100"
                          />
                          <input
                            type="text"
                            placeholder="GPA (optional)"
                            value={edu.gpa}
                            onChange={(e) => updateEducation(edu.id, 'gpa', e.target.value)}
                            className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-100"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* 5. SKILLS */}
                {sec.id === 'skills' && (
                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="block font-medium text-slate-400 mb-1">Technical Skills (comma separated)</label>
                      <input
                        type="text"
                        value={(resumeData.skills?.technical || []).join(', ')}
                        onChange={(e) => updateSkillsList('technical', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100"
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-slate-400 mb-1">Soft & Leadership Skills (comma separated)</label>
                      <input
                        type="text"
                        value={(resumeData.skills?.soft || []).join(', ')}
                        onChange={(e) => updateSkillsList('soft', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100"
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-slate-400 mb-1">Tools & Platforms (comma separated)</label>
                      <input
                        type="text"
                        value={(resumeData.skills?.tools || []).join(', ')}
                        onChange={(e) => updateSkillsList('tools', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100"
                      />
                    </div>
                  </div>
                )}

                {/* 6. PROJECTS */}
                {sec.id === 'projects' && (
                  <div className="space-y-3">
                    {(resumeData.projects || []).map((proj, pIdx) => (
                      <div key={proj.id || pIdx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-brand-400">Project #{pIdx + 1}</span>
                        </div>
                        <input
                          type="text"
                          placeholder="Project Name"
                          value={proj.name}
                          onChange={(e) => {
                            const newP = [...resumeData.projects];
                            newP[pIdx].name = e.target.value;
                            setResumeData(prev => ({ ...prev, projects: newP }));
                          }}
                          className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-100"
                        />
                        <textarea
                          rows={2}
                          placeholder="Project Description..."
                          value={proj.description}
                          onChange={(e) => {
                            const newP = [...resumeData.projects];
                            newP[pIdx].description = e.target.value;
                            setResumeData(prev => ({ ...prev, projects: newP }));
                          }}
                          className="w-full p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-100"
                        />
                      </div>
                    ))}
                  </div>
                )}

              </div>
            )}
          </div>
        );
      })}

    </div>
  );
}
