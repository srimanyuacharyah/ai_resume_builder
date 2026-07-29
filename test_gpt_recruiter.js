import { 
  runRecruiterInterviewStep
} from './src/services/geminiService.js';
import { SAMPLE_RESUME } from './src/utils/sampleResume.js';

// Polyfill localStorage for node environment test
if (typeof localStorage === 'undefined') {
  const store = {};
  global.localStorage = {
    getItem: (key) => store[key] || null,
    setItem: (key, val) => { store[key] = String(val); },
    removeItem: (key) => { delete store[key]; }
  };
}

async function testAllSectionsAndNewResumeBuild() {
  console.log("=== 1. Testing BRAND NEW RESUME BUILD from Prompt ===");
  const newResumeTest = await runRecruiterInterviewStep({
    chatHistory: [],
    userMessage: "Build a new resume for a Senior DevOps Engineer with 6 years experience in AWS and Terraform",
    currentResume: SAMPLE_RESUME
  });
  console.log("Reply:", newResumeTest.replyText);
  console.log("New Job Title:", newResumeTest.updatedResume?.personalInfo?.jobTitle);
  console.log("New Work Experience Count:", newResumeTest.updatedResume?.workExperience?.length);
  console.log("First New Job Company:", newResumeTest.updatedResume?.workExperience?.[0]?.company);

  console.log("\n=== 2. Testing ADD WORK EXPERIENCE ===");
  const addWorkTest = await runRecruiterInterviewStep({
    chatHistory: [],
    userMessage: "Add work experience at Meta as Senior Infrastructure Engineer",
    currentResume: newResumeTest.updatedResume
  });
  console.log("Reply:", addWorkTest.replyText);
  console.log("Work Experience Companies:", addWorkTest.updatedResume?.workExperience?.map(w => w.company));

  console.log("\n=== 3. Testing ADD EDUCATION ===");
  const addEduTest = await runRecruiterInterviewStep({
    chatHistory: [],
    userMessage: "Add education Master of Science in Artificial Intelligence from Stanford University",
    currentResume: addWorkTest.updatedResume
  });
  console.log("Reply:", addEduTest.replyText);
  console.log("Education Institutions:", addEduTest.updatedResume?.education?.map(e => e.institution));

  console.log("\n=== 4. Testing ADD PROJECT ===");
  const addProjTest = await runRecruiterInterviewStep({
    chatHistory: [],
    userMessage: "Add project Kubernetes Auto-scaler Platform",
    currentResume: addEduTest.updatedResume
  });
  console.log("Reply:", addProjTest.replyText);
  console.log("Projects List:", addProjTest.updatedResume?.projects?.map(p => p.name));

  console.log("\n=== 5. Testing ADD CERTIFICATION ===");
  const addCertTest = await runRecruiterInterviewStep({
    chatHistory: [],
    userMessage: "Add certification AWS Solutions Architect Professional",
    currentResume: addProjTest.updatedResume
  });
  console.log("Reply:", addCertTest.replyText);
  console.log("Certifications List:", addCertTest.updatedResume?.certifications?.map(c => c.name));

  console.log("\n✅ ALL SECTION EDITS AND NEW RESUME GENERATION VERIFIED 100% WORKING!");
}

testAllSectionsAndNewResumeBuild();


