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

async function testMoreModels() {
  const modelsToTest = [
    'gemini-2.0-flash-lite',
    'gemini-2.0-flash-lite-preview-02-05',
    'gemini-1.5-flash-8b',
    'gemini-2.0-flash',
    'gemini-2.5-flash-lite',
    'gemini-1.5-flash-002',
    'gemini-1.5-pro-002'
  ];

  for (const mName of modelsToTest) {
    try {
      const model = genAI.getGenerativeModel({ model: mName });
      const res = await model.generateContent("Respond with OK");
      console.log(`🎉 SUCCESS WITH MODEL '${mName}':`, res.response.text().trim());
      return mName;
    } catch (err) {
      console.log(`Model '${mName}' -> ${err.message.split('\n')[0]}`);
    }
  }
}

testMoreModels();
