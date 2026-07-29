import { GoogleGenerativeAI } from '@google/generative-ai';
import { getStoredApiKey, DEFAULT_GEMINI_KEY } from './src/services/geminiService.js';

if (typeof localStorage === 'undefined') {
  global.localStorage = {
    getItem: (key) => DEFAULT_GEMINI_KEY,
    setItem: () => {},
    removeItem: () => {}
  };
}

const genAI = new GoogleGenerativeAI(getStoredApiKey());

async function testModelNames() {
  const candidateModels = [
    'gemini-2.5-flash',
    'gemini-2.0-flash',
    'gemini-1.5-flash-latest',
    'gemini-2.5-pro',
    'gemini-1.5-pro',
    'gemini-2.0-flash-exp',
    'gemini-flash'
  ];

  for (const modelName of candidateModels) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const res = await model.generateContent("Hello, reply with 'OK'");
      console.log(`✅ Model '${modelName}' SUCCESS:`, res.response.text().trim());
      break;
    } catch (err) {
      console.log(`❌ Model '${modelName}' FAILED: ${err.message.split('\n')[0]}`);
    }
  }
}

testModelNames();
