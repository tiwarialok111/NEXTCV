import 'dotenv/config';
import { GoogleGenerativeAI } from '@google/generative-ai';

async function test() {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash',
      generationConfig: { responseMimeType: 'application/json' }
    });
    const prompt = `
      You are an expert technical interviewer.
      The candidate was asked the following question:
      "What is React?"
      The candidate provided the following answer:
      "It is a UI library."
      Provide a JSON output with the exact keys:
      {
        "score": 5,
        "feedback": "Good",
        "strengths": ["Short"],
        "weaknesses": ["Too short"],
        "idealAnswer": "A great answer"
      }
    `;
    const result = await model.generateContent(prompt);
    console.log('RESULT:', result.response.text());
  } catch(err) {
    console.error('ERROR:', err);
  }
}
test();
