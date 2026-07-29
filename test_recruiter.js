import { runRecruiterInterviewStep, getStoredApiKey, DEFAULT_GEMINI_KEY } from './src/services/geminiService.js';
import { SAMPLE_RESUME } from './src/utils/sampleResume.js';

// Polyfill localStorage for node environment test
if (typeof localStorage === 'undefined') {
  global.localStorage = {
    getItem: (key) => DEFAULT_GEMINI_KEY,
    setItem: () => {},
    removeItem: () => {}
  };
}

async function testRecruiter() {
  console.log("Testing Recruiter Interview Step with Gemini API key:", getStoredApiKey().slice(0, 10) + '...');
  
  try {
    const response = await runRecruiterInterviewStep({
      chatHistory: [],
      userMessage: "is my resume ats friendly?",
      currentResume: SAMPLE_RESUME
    });

    console.log("\n--- GEMINI RECRUITER RESPONSE ---");
    console.log("Reply Text:", response.replyText);
    console.log("\nQuick Replies:", response.suggestedQuickReplies);
    console.log("\nUpdated Resume Keys:", Object.keys(response.updatedResume || {}));
    if (response.error) {
      console.error("\nError:", response.error);
    }
  } catch (err) {
    console.error("Test Exception:", err);
  }
}

testRecruiter();
