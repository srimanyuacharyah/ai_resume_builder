/**
 * Resilient JSON Parser for Gemini LLM outputs.
 * Handles markdown wrappers, loose formatting, unescaped quotes, and missing structural fields.
 */

export function parseGeminiJson(rawText, fallbackDefault = null) {
  if (!rawText || typeof rawText !== 'string') {
    return fallbackDefault;
  }

  let cleaned = rawText.trim();

  // 1. Strip markdown code fences if present (```json ... ``` or ``` ...)
  cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '');

  // 2. Try direct parse first
  try {
    const parsed = JSON.parse(cleaned);
    return parsed;
  } catch (err1) {
    // Continue to fallback parsing strategies
  }

  // 3. Extract JSON object substring using balanced brace detection or regex
  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');

  if (firstBrace !== -1 && lastBrace > firstBrace) {
    const jsonSub = cleaned.substring(firstBrace, lastBrace + 1);
    try {
      return JSON.parse(jsonSub);
    } catch (err2) {
      // 4. Try repairing trailing commas or common syntax flaws
      const repaired = jsonSub
        .replace(/,\s*([\}\]])/g, '$1') // remove trailing commas before closing braces/brackets
        .replace(/[\u201C\u201D]/g, '"') // replace curly quotes
        .replace(/[\u2018\u2019]/g, "'");

      try {
        return JSON.parse(repaired);
      } catch (err3) {
        console.warn("JSON repair attempt failed:", err3);
      }
    }
  }

  // 5. Extract JSON array substring if expected
  const firstBracket = cleaned.indexOf('[');
  const lastBracket = cleaned.lastIndexOf(']');
  if (firstBracket !== -1 && lastBracket > firstBracket) {
    const jsonArrSub = cleaned.substring(firstBracket, lastBracket + 1);
    try {
      return JSON.parse(jsonArrSub);
    } catch (err4) {
      console.warn("JSON array parse failed:", err4);
    }
  }

  return fallbackDefault;
}

/**
 * Filters out raw binary PDF stream garbage (%PDF-1.7, /FlateDecode, stream...endstream)
 */
export function cleanString(str, fallbackText = '') {
  if (typeof str !== 'string') return fallbackText;
  
  // Detect raw PDF binary stream markers
  if (/%PDF-|\/FlateDecode|\/Length \d+|endstream|endobj|<<\s*\/Filter/i.test(str)) {
    let cleaned = str
      .replace(/%PDF-[\s\S]*?endobj/gi, '')
      .replace(/<<[\s\S]*?>>/g, '')
      .replace(/\/FlateDecode|\/Length \d+|stream[\s\S]*?endstream/gi, '')
      .replace(/[^\x20-\x7E\n\r\t]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    if (cleaned.length < 10 || /%PDF-/i.test(cleaned)) {
      return fallbackText;
    }
    return cleaned;
  }
  
  return str.trim();
}

/**
 * Normalizes resume data structure ensuring safe defaults for all fields.
 * If inputData.isNewResume or options.isNewResume is true, replaces old resume sections completely.
 */
export function normalizeResumeData(inputData, existingResume = {}, options = {}) {
  if (!inputData || typeof inputData !== 'object') {
    return existingResume;
  }

  const isNew = Boolean(inputData.isNewResume || options.isNewResume);
  const baseResume = isNew ? {} : existingResume;

  const result = {
    personalInfo: {
      fullName: cleanString(inputData.personalInfo?.fullName, baseResume.personalInfo?.fullName || 'Alex Rivers'),
      email: cleanString(inputData.personalInfo?.email, baseResume.personalInfo?.email || 'alex.rivers@email.com'),
      phone: cleanString(inputData.personalInfo?.phone, baseResume.personalInfo?.phone || '+1 (555) 234-5678'),
      location: cleanString(inputData.personalInfo?.location, baseResume.personalInfo?.location || 'San Francisco, CA'),
      website: cleanString(inputData.personalInfo?.website, baseResume.personalInfo?.website || 'github.com/alexrivers'),
      linkedin: cleanString(inputData.personalInfo?.linkedin, baseResume.personalInfo?.linkedin || 'linkedin.com/in/alexrivers'),
      jobTitle: cleanString(inputData.personalInfo?.jobTitle, baseResume.personalInfo?.jobTitle || 'Senior Professional Role'),
    },
    summary: cleanString(inputData.summary, baseResume.summary || 'Accomplished professional with proven expertise driving system performance and business outcomes.'),
    workExperience: Array.isArray(inputData.workExperience) 
      ? inputData.workExperience
          .map(exp => ({
            id: exp.id || 'exp_' + Math.random().toString(36).substring(2, 9),
            company: cleanString(exp.company, 'Company'),
            position: cleanString(exp.position, 'Role'),
            location: cleanString(exp.location, ''),
            startDate: cleanString(exp.startDate, '2022'),
            endDate: cleanString(exp.endDate, 'Present'),
            current: Boolean(exp.current),
            bullets: Array.isArray(exp.bullets) 
              ? exp.bullets.map(b => cleanString(b, '')).filter(b => b.length > 3 && !/%PDF-/i.test(b))
              : (exp.description ? [cleanString(exp.description, '')].filter(Boolean) : [])
          }))
          .filter(exp => exp.company !== 'Company' || exp.bullets.length > 0)
      : (baseResume.workExperience || []),
    education: Array.isArray(inputData.education)
      ? inputData.education.map(edu => ({
          id: edu.id || 'edu_' + Math.random().toString(36).substring(2, 9),
          institution: cleanString(edu.institution, 'University'),
          degree: cleanString(edu.degree, 'Degree'),
          fieldOfStudy: cleanString(edu.fieldOfStudy, ''),
          startDate: cleanString(edu.startDate, ''),
          endDate: cleanString(edu.endDate, ''),
          gpa: cleanString(edu.gpa, '')
        }))
      : (baseResume.education || []),
    skills: {
      technical: Array.isArray(inputData.skills?.technical) 
        ? inputData.skills.technical.map(s => cleanString(s, '')).filter(s => s.length > 1 && !/%PDF-/i.test(s)) 
        : (baseResume.skills?.technical || []),
      soft: Array.isArray(inputData.skills?.soft) 
        ? inputData.skills.soft.map(s => cleanString(s, '')).filter(s => s.length > 1 && !/%PDF-/i.test(s)) 
        : (baseResume.skills?.soft || []),
      tools: Array.isArray(inputData.skills?.tools) 
        ? inputData.skills.tools.map(s => cleanString(s, '')).filter(s => s.length > 1 && !/%PDF-/i.test(s)) 
        : (baseResume.skills?.tools || []),
    },
    projects: Array.isArray(inputData.projects)
      ? inputData.projects.map(proj => ({
          id: proj.id || 'proj_' + Math.random().toString(36).substring(2, 9),
          name: cleanString(proj.name, 'Project'),
          description: cleanString(proj.description, ''),
          technologies: Array.isArray(proj.technologies) ? proj.technologies.map(t => cleanString(t, '')).filter(Boolean) : [],
          link: cleanString(proj.link, ''),
          bullets: Array.isArray(proj.bullets) ? proj.bullets.map(b => cleanString(b, '')).filter(Boolean) : []
        }))
      : (baseResume.projects || []),
    certifications: Array.isArray(inputData.certifications)
      ? inputData.certifications.map(cert => ({
          id: cert.id || 'cert_' + Math.random().toString(36).substring(2, 9),
          name: cleanString(cert.name, 'Certification'),
          issuer: cleanString(cert.issuer, ''),
          date: cleanString(cert.date, '')
        }))
      : (baseResume.certifications || [])
  };

  return result;
}
