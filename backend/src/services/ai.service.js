import { GoogleGenerativeAI } from '@google/generative-ai';

const getGenAI = () => new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const generateAIResponse = async (prompt) => {
  try {
    const genAI = getGenAI();
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Gemini API Error:', error);
    if (error.status === 429) {
      throw new Error('API Rate Limit Exceeded: You have reached the free tier limits. Please wait a minute and try again.');
    }
    throw new Error(error.message || 'Failed to generate AI response');
  }
};

export const parseAIJSON = async (prompt) => {
  try {
    const genAI = getGenAI();
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash',
      generationConfig: {
        responseMimeType: "application/json",
      }
    });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return JSON.parse(text);
  } catch (error) {
    console.error('Gemini JSON Parse Error:', error);
    if (error.status === 429) {
      throw new Error('API Rate Limit Exceeded: You have reached the free tier limits. Please wait a minute and try again.');
    }
    // If it's a parsing error vs API error
    if (error instanceof SyntaxError) {
      throw new Error('Failed to parse AI response into JSON');
    }
    throw new Error(error.message || 'Failed to process AI request');
  }
};
