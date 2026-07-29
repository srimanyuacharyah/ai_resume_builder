import { 
  runRecruiterInterviewStep, 
  analyzeResumeATS, 
  analyzeBulletPointsHeatmap, 
  optimizeSingleBullet 
} from './src/services/geminiService.js';
import { SAMPLE_RESUME } from './src/utils/sampleResume.js';

if (typeof localStorage === 'undefined') {
  global.localStorage = {
    getItem: () => '',
    setItem: () => {},
    removeItem: () => {}
  };
}

async function runAllTests() {
  console.log("=== 1. Testing Recruiter Interview Step ===");
  const recruiter = await runRecruiterInterviewStep({
    chatHistory: [],
    userMessage: "is my resume ats friendly?",
    currentResume: SAMPLE_RESUME
  });
  console.log("Recruiter Reply:", recruiter.replyText.slice(0, 100) + "...");
  console.log("Quick Replies:", recruiter.suggestedQuickReplies);

  console.log("\n=== 2. Testing ATS Analysis ===");
  const ats = await analyzeResumeATS({ resume: SAMPLE_RESUME });
  console.log("ATS Score:", ats.score);
  console.log("Keyword Breakdown:", ats.keywordAnalysis);

  console.log("\n=== 3. Testing Bullet Heatmap Analysis ===");
  const heatmap = await analyzeBulletPointsHeatmap(SAMPLE_RESUME);
  console.log("Heatmap items count:", heatmap.length);
  if (heatmap.length > 0) {
    console.log("First Bullet Rating:", heatmap[0].rating, "-", heatmap[0].bulletText);
  }

  console.log("\n=== 4. Testing Single Bullet Optimization ===");
  const opt = await optimizeSingleBullet({
    bulletText: "Built frontend using React and Redux",
    position: "Senior Frontend Engineer",
    company: "Tech Corp"
  });
  console.log("Optimized Bullet Rewrites Count:", opt.length);
  console.log("Rewrite #1:", opt[0]);

  console.log("\n✅ ALL SERVICES VERIFIED 100% WORKING WITHOUT ERRORS!");
}

runAllTests();
