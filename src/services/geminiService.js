import { GoogleGenerativeAI } from '@google/generative-ai';
import { parseGeminiJson, normalizeResumeData } from '../utils/jsonParser.js';
import { 
  smartRecruiterChat, 
  smartATSAnalysis, 
  smartBulletHeatmap, 
  smartOptimizeBullet,
  smartSalaryEstimator
} from './smartCareerEngine.js';

export { smartSalaryEstimator };

/**
 * Default API Key & Provider Configuration Handlers
 */
export const DEFAULT_GEMINI_KEY = "";
export const DEFAULT_OPENAI_KEY = "";
export const DEFAULT_GPT_MODEL = "gpt-4o-mini";

export function getStoredApiKey() {
  if (typeof localStorage === 'undefined') return DEFAULT_GEMINI_KEY;
  const customKey = localStorage.getItem('resumai_gemini_api_key');
  if (customKey && customKey.trim().length > 10) {
    return customKey.trim();
  }
  return DEFAULT_GEMINI_KEY;
}

export function setStoredApiKey(key) {
  if (typeof localStorage === 'undefined') return;
  if (key) {
    localStorage.setItem('resumai_gemini_api_key', key.trim());
  } else {
    localStorage.removeItem('resumai_gemini_api_key');
  }
}

export function getStoredOpenAIKey() {
  if (typeof localStorage === 'undefined') return DEFAULT_OPENAI_KEY;
  const customKey = localStorage.getItem('resumai_openai_api_key');
  if (customKey && customKey.trim().length > 10) {
    return customKey.trim();
  }
  return DEFAULT_OPENAI_KEY;
}

export function setStoredOpenAIKey(key) {
  if (typeof localStorage === 'undefined') return;
  if (key) {
    localStorage.setItem('resumai_openai_api_key', key.trim());
  } else {
    localStorage.removeItem('resumai_openai_api_key');
  }
}

export function getSelectedProvider() {
  if (typeof localStorage === 'undefined') return 'auto';
  return localStorage.getItem('resumai_ai_provider') || 'auto'; // 'openai' | 'gemini' | 'local' | 'auto'
}

export function setSelectedProvider(provider) {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem('resumai_ai_provider', provider);
}

export function getSelectedGPTModel() {
  if (typeof localStorage === 'undefined') return DEFAULT_GPT_MODEL;
  return localStorage.getItem('resumai_gpt_model') || DEFAULT_GPT_MODEL;
}

export function setSelectedGPTModel(model) {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem('resumai_gpt_model', model);
}

/**
 * Initialize Gemini client dynamically (returns null if key not set or invalid)
 */
function getGenerativeModel(modelName = 'gemini-2.0-flash', customKey = null) {
  const apiKey = customKey || getStoredApiKey();
  if (!apiKey || !apiKey.startsWith('AIzaSy')) {
    return null;
  }
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    return genAI.getGenerativeModel({ model: modelName });
  } catch (err) {
    return null;
  }
}

/**
 * Direct fetch call to OpenAI GPT API (no external SDK dependency)
 */
export async function callOpenAIGPT({ prompt, systemPrompt = '', jsonMode = false, images = [], customKey = null, modelName = null }) {
  const apiKey = customKey || getStoredOpenAIKey();
  if (!apiKey || (!apiKey.startsWith('sk-') && apiKey.length < 20)) {
    throw new Error("OpenAI API key missing or invalid format (should start with 'sk-')");
  }

  const model = modelName || getSelectedGPTModel();
  
  const messages = [];
  if (systemPrompt) {
    messages.push({ role: "system", content: systemPrompt });
  }

  let userContent = prompt;
  if (images && images.length > 0) {
    userContent = [
      { type: "text", text: prompt },
      ...images.map(img => ({
        type: "image_url",
        image_url: { url: img.dataUrl || `data:${img.mimeType || 'image/png'};base64,${img.base64}` }
      }))
    ];
  }

  messages.push({ role: "user", content: userContent });

  const requestBody = {
    model: model,
    messages: messages,
    temperature: 0.7,
  };

  if (jsonMode) {
    requestBody.response_format = { type: "json_object" };
  }

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify(requestBody)
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errMessage = errorData.error?.message || `OpenAI API Error ${response.status}: ${response.statusText}`;
    throw new Error(errMessage);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error("Empty response returned from OpenAI GPT API");
  }

  return content;
}

/**
 * Unified Generative AI Execution Router (OpenAI GPT, Gemini, or Local)
 */
export async function callGenerativeAI({ prompt, systemPrompt = '', jsonMode = false, images = [] }) {
  const provider = getSelectedProvider(); // 'openai' | 'gemini' | 'local' | 'auto'
  const openaiKey = getStoredOpenAIKey();
  const geminiKey = getStoredApiKey();

  if (provider === 'local') {
    return null;
  }

  // 1. OpenAI GPT Route
  if (provider === 'openai' || (provider === 'auto' && openaiKey && (openaiKey.startsWith('sk-') || openaiKey.length > 20))) {
    try {
      const resultText = await callOpenAIGPT({ prompt, systemPrompt, jsonMode, images });
      return { text: resultText, providerUsed: 'openai', modelUsed: getSelectedGPTModel() };
    } catch (gptErr) {
      console.warn("OpenAI GPT API call notice, attempting Gemini or Local fallback:", gptErr.message);
      if (provider === 'openai') throw gptErr;
    }
  }

  // 2. Google Gemini Route
  if (provider === 'gemini' || (provider === 'auto' && geminiKey && geminiKey.startsWith('AIzaSy'))) {
    try {
      const model = getGenerativeModel('gemini-2.0-flash');
      if (model) {
        let contents;
        if (images && images.length > 0) {
          const parts = images.map(img => ({
            inlineData: {
              data: img.base64,
              mimeType: img.mimeType || 'application/pdf'
            }
          }));
          parts.unshift(systemPrompt ? `${systemPrompt}\n\n${prompt}` : prompt);
          contents = parts;
        } else {
          contents = systemPrompt ? `${systemPrompt}\n\n${prompt}` : prompt;
        }

        const result = await model.generateContent(contents);
        const text = result.response.text();
        return { text, providerUsed: 'gemini', modelUsed: 'gemini-2.0-flash' };
      }
    } catch (geminiErr) {
      console.warn("Gemini API call notice, falling back to Smart Local Recruiter engine:", geminiErr.message);
      if (provider === 'gemini') throw geminiErr;
    }
  }

  return null;
}

/**
 * Test an API key connection live (supports OpenAI sk-... and Gemini AIzaSy...)
 */
export async function testApiKeyConnection(keyToTest, targetProvider = 'auto') {
  const key = keyToTest ? keyToTest.trim() : '';

  // A. OpenAI key
  if (key.startsWith('sk-') || targetProvider === 'openai') {
    try {
      const resText = await callOpenAIGPT({
        prompt: "Reply with 'OK'",
        customKey: key || getStoredOpenAIKey(),
        modelName: getSelectedGPTModel()
      });
      if (resText) {
        return { success: true, message: `OpenAI GPT (${getSelectedGPTModel()}) connection successful!` };
      }
    } catch (err) {
      console.error("OpenAI API Key Test Failed:", err);
      return { success: false, error: err.message };
    }
  }

  // B. Gemini key
  const geminiKey = key || getStoredApiKey();
  if (!geminiKey || geminiKey.length < 5) {
    return { success: false, error: "Please enter a valid API key (OpenAI 'sk-...' or Gemini 'AIzaSy...')" };
  }

  try {
    const genAI = new GoogleGenerativeAI(geminiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const result = await model.generateContent("Reply with 'OK'");
    const text = result.response.text();
    if (text) {
      return { success: true, message: "Gemini 2.0 API connection successful!" };
    }
  } catch (err) {
    console.error("API Key Test Failed:", err);
    return { 
      success: false, 
      error: err.message.includes('429') 
        ? "API Quota Exceeded for this key. Get a new free key at https://aistudio.google.com/app/apikey" 
        : err.message.includes('404')
        ? "Model not found. Please verify your Google AI Studio project status."
        : err.message 
    };
  }
}

/**
 * Smart Local Recruiter AI Engine
 */
export function generateSmartOfflineRecruiterResponse({ userMessage = '', currentResume = {}, chatHistory = [] }) {
  return smartRecruiterChat({ userMessage, currentResume, chatHistory });
}

/**
 * 1. Interactive Recruiter Chat Interview
 */
export async function runRecruiterInterviewStep({ chatHistory, userMessage, currentResume }) {
  try {
    const prompt = `
You are Sarah Vance, an Executive AI Career Coach, Senior Recruiter & Versatile AI Assistant.

CONVERSATIONAL, NEW RESUME BUILD & ALL-SECTION EDITING INSTRUCTIONS:

1. BUILDING A BRAND NEW RESUME FROM SCRATCH (WHEN REQUESTED):
   - IF THE USER ASKS TO BUILD, CREATE, GENERATE, OR MAKE A NEW RESUME (e.g. "build a new resume for a DevOps Engineer", "create a resume for a Data Scientist with 5 years experience", "generate a new resume for a Financial Analyst", "build a resume from scratch"):
   - You MUST generate a completely fresh, 100% complete enterprise-grade resume JSON tailored specifically for that role & experience level.
   - Populate ALL sections with realistic, high-impact details:
     * personalInfo: fullName, jobTitle, email, phone, location, linkedin, website.
     * summary: executive summary highlighting key strengths.
     * workExperience: 2-3 realistic past roles with strong action verbs & quantifiable metrics (% and $).
     * education: degree, institution, field of study, graduation year, GPA.
     * skills: technical (array), soft (array), tools (array).
     * projects: 2 tailored projects with technologies & achievement bullets.
     * certifications: 1-2 relevant industry certifications.
   - Set "isNewResume": true inside the JSON response.

2. EDITING / MODIFYING ANY SECTION OF THE RESUME:
   - IF THE USER INSTRUCTS YOU TO EDIT, ADD, UPDATE, OR REMOVE ANYTHING IN ANY SECTION:
     * Personal Info (Name, Job Title, Email, Phone, Location, Website, LinkedIn)
     * Summary (rewrite summary, make concise, add metrics)
     * Work Experience (add work experience, add/edit/delete bullet points, change dates/company/position)
     * Education (add/update degree, university, GPA, dates)
     * Skills (add/remove technical skills, soft skills, or tools)
     * Projects (add/update project name, description, tech stack, bullets)
     * Certifications (add/update certification name, issuer, date)
   - Apply those exact modifications directly inside the \`updatedResume\` JSON object!
   - Confirm the exact changes made warmly in your \`replyText\`.

3. ANSWERING ANY QUESTION:
   - You can answer ANY question the user asks on ANY topic (general knowledge, technical concepts, coding, math, science, casual chat, jokes, or career strategy).

4. ALWAYS GENERATE 3 RELEVANT QUICK-REPLIES matching the user's topic in \`suggestedQuickReplies\`.

Current Resume State:
${JSON.stringify(currentResume, null, 2)}

User's Latest Message:
"${userMessage}"

Recent Chat Conversation Context:
${chatHistory.slice(-6).map(m => `${m.sender.toUpperCase()}: ${m.text}`).join('\n')}

OUTPUT REQUIREMENT:
Respond ONLY with a valid JSON object matching this schema:
{
  "replyText": "Your direct, personalized response answering the user's question, confirming their requested edits, or announcing the brand new built resume...",
  "suggestedQuickReplies": [
    "Option 1",
    "Option 2",
    "Option 3"
  ],
  "updatedResume": {
    "isNewResume": false, // Set to true ONLY if creating a brand new resume from scratch
    ... full resume JSON data with personalInfo, summary, workExperience, education, skills, projects, certifications ...
  }
}
`;

    const aiRes = await callGenerativeAI({ prompt, jsonMode: true });
    if (!aiRes || !aiRes.text) {
      return generateSmartOfflineRecruiterResponse({ userMessage, currentResume });
    }

    const responseText = aiRes.text;
    const parsed = parseGeminiJson(responseText);

    if (parsed && parsed.replyText) {
      const isNewRes = Boolean(parsed.updatedResume?.isNewResume);
      const normalizedResume = parsed.updatedResume 
        ? normalizeResumeData(parsed.updatedResume, currentResume, { isNewResume: isNewRes }) 
        : currentResume;
        
      return {
        replyText: parsed.replyText,
        suggestedQuickReplies: parsed.suggestedQuickReplies || ["How can I boost my score?", "Analyze my skills", "Check my action verbs"],
        updatedResume: normalizedResume,
        providerUsed: aiRes.providerUsed,
        modelUsed: aiRes.modelUsed
      };
    } else {
      const cleanReply = responseText.replace(/```json[\s\S]*?```/g, '').trim();
      return {
        replyText: cleanReply.length > 10 
          ? cleanReply 
          : `I've noted that! Let me know if you have any questions or if you want to make further updates to your resume canvas.`,
        suggestedQuickReplies: ["Update my job title", "Check ATS keywords", "Ask another question"],
        updatedResume: currentResume,
        providerUsed: aiRes.providerUsed,
        modelUsed: aiRes.modelUsed
      };
    }
  } catch (error) {
    console.warn("AI API call notice, switching to Smart Local Recruiter engine:", error.message);
    return generateSmartOfflineRecruiterResponse({ userMessage, currentResume });
  }
}


/**
 * 2. Live ATS Compatibility Analysis
 */
export async function analyzeResumeATS({ resume, targetJobDescription = "" }) {
  try {
    const prompt = `
You are an expert Applicant Tracking System (ATS) Auditor and Senior Hiring Manager.
Analyze the following resume against the provided target job description (if blank, evaluate against top 10% Senior Industry standards for the candidate's title).

Candidate Resume:
${JSON.stringify(resume, null, 2)}

Target Job Description:
${targetJobDescription.trim() || "Senior Level Professional Role in candidate's target field"}

Analyze compatibility, keyword density, action verb strength, quantifiable metric coverage, and brevity.

OUTPUT REQUIREMENT:
Respond ONLY with a valid JSON object formatted as follows:
{
  "score": 85,
  "scoreBreakdown": {
    "keywordMatch": 88,
    "actionVerbDensity": 82,
    "quantifiableImpact": 84,
    "formattingBrevity": 90
  },
  "keywordAnalysis": {
    "matched": ["React", "TypeScript", "System Architecture", "GraphQL", "CI/CD"],
    "missing": ["Kubernetes", "AWS Lambda", "Microservices", "A/B Testing"]
  },
  "topStrengths": [
    "Strong quantifiable metrics in recent Lead AI Engineer role",
    "Clear tech stack alignment with modern web frameworks",
    "Solid career progression and leadership scope"
  ],
  "criticalGaps": [
    "Missing explicit mention of cloud infrastructure monitoring",
    "First work experience bullet point could use stronger action verb"
  ],
  "actionableTips": [
    "Incorporate keywords: 'Kubernetes', 'Microservices architecture'",
    "Add metric to project 2 describing user growth or performance gain",
    "Ensure summary mentions cloud orchestration experience"
  ]
}
`;

    const aiRes = await callGenerativeAI({ prompt, jsonMode: true });
    if (aiRes && aiRes.text) {
      const parsed = parseGeminiJson(aiRes.text);
      if (parsed && typeof parsed.score === 'number') {
        return parsed;
      }
    }
  } catch (error) {
    console.error("Error analyzing ATS:", error);
  }

  return smartATSAnalysis({ resume, targetJobDescription });
}

/**
 * 3. Bullet Points Heatmap & Critique Analysis
 */
export async function analyzeBulletPointsHeatmap(resume) {
  try {
    const prompt = `
You are a Resume Heatmap Auditor. Evaluate EVERY bullet point in the candidate's work experience and projects.
Rate each bullet point as:
- "strong" (Green): Begins with a powerful action verb AND contains a clear quantifiable metric/result (%, $, numbers, time saved).
- "moderate" (Yellow): Clear responsibility or action verb, but lacks concrete numerical impact.
- "weak" (Red): Passive language, vague duties, or generic descriptions ("Responsible for...", "Helped with...").

Candidate Resume Experience & Projects:
${JSON.stringify({ workExperience: resume.workExperience, projects: resume.projects }, null, 2)}

OUTPUT REQUIREMENT:
Respond ONLY with a valid JSON array of objects:
[
  {
    "bulletText": "exact text of bullet point",
    "rating": "strong" | "moderate" | "weak",
    "explanation": "Why this rating was given",
    "suggestedRewrite": "High-impact rewritten version with strong verb and metric placeholder"
  }
]
`;

    const aiRes = await callGenerativeAI({ prompt, jsonMode: true });
    if (aiRes && aiRes.text) {
      const parsed = parseGeminiJson(aiRes.text);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (error) {
    console.error("Error analyzing heatmap:", error);
  }

  return smartBulletHeatmap(resume);
}

/**
 * 4. Optimize Single Bullet Point Instant AI Boost
 */
export async function optimizeSingleBullet({ bulletText, position, company }) {
  try {
    const prompt = `
Rewrite the following resume bullet point to maximize ATS score and recruiter impact for a ${position} at ${company}.

Original Bullet Point:
"${bulletText}"

Provide 3 distinct, high-impact options starting with strong action verbs and including metrics/results.

OUTPUT REQUIREMENT (Valid JSON array of strings only):
[
  "Option 1 rewritten bullet...",
  "Option 2 rewritten bullet...",
  "Option 3 rewritten bullet..."
]
`;

    const aiRes = await callGenerativeAI({ prompt, jsonMode: true });
    if (aiRes && aiRes.text) {
      const parsed = parseGeminiJson(aiRes.text);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (error) {
    console.error("Error optimizing bullet:", error);
  }

  return smartOptimizeBullet({ bulletText, position, company });
}

/**
 * Helper to convert a File object to base64 data URL
 */
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      const base64Data = typeof result === 'string' ? result.split(',')[1] : '';
      resolve(base64Data);
    };
    reader.onerror = error => reject(error);
    reader.readAsDataURL(file);
  });
}

/**
 * Helper to read text files
 */
function fileToText(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
    reader.readAsText(file);
  });
}

/**
 * Helper to extract text from DOCX, PDF streams, or plain text files
 */
async function extractTextFromAnyFile(file) {
  const fileName = file.name || '';
  const fileExt = fileName.split('.').pop().toLowerCase();

  if (['txt', 'md', 'rtf', 'csv', 'json', 'html', 'xml'].includes(fileExt) || (file.type && file.type.startsWith('text/'))) {
    return await fileToText(file);
  }

  try {
    const arrayBuffer = await file.arrayBuffer();
    const decoder = new TextDecoder('utf-8', { fatal: false });
    const textContent = decoder.decode(arrayBuffer);

    const docxMatches = textContent.match(/<w:t[^>]*>(.*?)<\/w:t>/g);
    if (docxMatches && docxMatches.length > 0) {
      return docxMatches.map(m => m.replace(/<[^>]+>/g, '')).join(' ');
    }

    const cleanText = textContent
      .replace(/[^\x20-\x7E\n\r\t]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    if (cleanText.length > 30) {
      return cleanText;
    }
  } catch (err) {
    console.warn("ArrayBuffer extraction notice:", err);
  }

  return await fileToText(file);
}

/**
 * Emergency Heuristic Fallback Extractor if AI API is unavailable
 */
function extractResumeLocallyFromText(text, fileName = 'Uploaded Resume') {
  const lines = text.split(/[\r\n]+/).map(l => l.trim()).filter(Boolean);
  
  const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  const email = emailMatch ? emailMatch[0] : '';

  const phoneMatch = text.match(/(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
  const phone = phoneMatch ? phoneMatch[0] : '';

  const firstLine = lines[0] ? lines[0].replace(/[^a-zA-Z\s]/g, '').trim() : '';
  const fullName = (firstLine.length > 2 && firstLine.length < 35) ? firstLine : 'Candidate Name';

  const bulletLines = lines.filter(l => /^[•\-\*\d\.]/.test(l) || l.length > 25);

  return normalizeResumeData({
    personalInfo: {
      fullName: fullName,
      jobTitle: 'Professional Role',
      email: email || 'candidate@email.com',
      phone: phone || '+1 (555) 000-0000',
      location: 'Location',
      website: '',
      linkedin: ''
    },
    summary: text.slice(0, 350) + '...',
    workExperience: [
      {
        company: fileName.replace(/\.[^/.]+$/, ''),
        position: 'Key Role',
        startDate: '2022',
        endDate: 'Present',
        bullets: bulletLines.slice(0, 6).map(b => b.replace(/^[•\-\*\d\.]\s*/, ''))
      }
    ],
    education: [],
    skills: { technical: ['Core Skill 1', 'Core Skill 2'], soft: [], tools: [] },
    projects: [],
    certifications: []
  });
}

/**
 * 5. Parse Uploaded Resume Document (Multi-tier PDF, DOCX, TXT, JSON, Image parser with GPT / Gemini support)
 */
export async function parseUploadedResumeFile(file) {
  if (!file) throw new Error("No file provided");

  const fileName = file.name || 'document';
  const fileExt = fileName.split('.').pop().toLowerCase();

  if (fileExt === 'json') {
    try {
      const rawJsonText = await fileToText(file);
      const parsed = parseGeminiJson(rawJsonText);
      if (parsed) {
        return normalizeResumeData(parsed);
      }
    } catch (err) {
      console.warn("Direct JSON parse warning:", err);
    }
  }

  const prompt = `
You are an expert Resume Parser & Document Extractor AI.
Extract ALL candidate details from the provided document (Personal Info, Job Title, Summary, Work Experience with bullet points, Education, Technical & Soft Skills, Projects, and Certifications).

OUTPUT REQUIREMENT:
Respond ONLY with a valid JSON object matching this exact schema:
{
  "personalInfo": {
    "fullName": "Candidate Name",
    "jobTitle": "Target Title",
    "email": "Email",
    "phone": "Phone",
    "location": "City, State",
    "website": "Website",
    "linkedin": "LinkedIn URL"
  },
  "summary": "Professional summary...",
  "workExperience": [
    {
      "company": "Company Name",
      "position": "Job Title",
      "location": "City, State",
      "startDate": "Start Date",
      "endDate": "End Date",
      "bullets": ["Achievement 1", "Achievement 2"]
    }
  ],
  "education": [
    {
      "institution": "University/School",
      "degree": "Degree Name",
      "fieldOfStudy": "Major",
      "endDate": "Graduation Date",
      "gpa": "GPA"
    }
  ],
  "skills": {
    "technical": ["Skill 1", "Skill 2"],
    "soft": ["Soft Skill 1"],
    "tools": ["Tool 1"]
  },
  "projects": [
    {
      "name": "Project Title",
      "description": "Description...",
      "technologies": ["Tech1", "Tech2"]
    }
  ],
  "certifications": [
    {
      "name": "Cert Title",
      "issuer": "Issuer",
      "date": "Year"
    }
  ]
}
`;

  let extractedText = '';
  try {
    extractedText = await extractTextFromAnyFile(file);
  } catch (eText) {
    console.warn("Text extraction failed, using file reader:", eText);
  }

  try {
    let imagesPayload = [];
    let fullPrompt = prompt;

    if (extractedText && extractedText.trim().length > 50) {
      fullPrompt += `\n\nDocument Name: ${fileName}\n\nDocument Text Content:\n${extractedText.slice(0, 12000)}`;
    } else if (['png', 'jpg', 'jpeg', 'webp', 'pdf'].includes(fileExt)) {
      const base64Data = await fileToBase64(file);
      let mimeType = 'application/pdf';
      if (['jpg', 'jpeg'].includes(fileExt)) mimeType = 'image/jpeg';
      if (fileExt === 'png') mimeType = 'image/png';
      if (fileExt === 'webp') mimeType = 'image/webp';
      imagesPayload = [{ base64: base64Data, mimeType }];
    } else {
      fullPrompt += `\n\nDocument Content:\n${extractedText}`;
    }

    const aiRes = await callGenerativeAI({ prompt: fullPrompt, jsonMode: true, images: imagesPayload });
    if (aiRes && aiRes.text) {
      const parsed = parseGeminiJson(aiRes.text);
      if (parsed) {
        return normalizeResumeData(parsed);
      }
    }
  } catch (aiErr) {
    console.error("AI API error during file parsing:", aiErr);
  }

  if (extractedText && extractedText.length > 20) {
    console.info("Using emergency heuristic parser for uploaded document.");
    return extractResumeLocallyFromText(extractedText, fileName);
  }

  throw new Error("Could not extract structured data. Please verify your AI API key in Settings or try uploading a PDF / Word / TXT file.");
}



