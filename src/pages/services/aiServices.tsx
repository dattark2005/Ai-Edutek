import axios from 'axios';

interface Resource {
  title: string;
  link: string;
}

interface AIPromptData {
  topics: string[];
  weakAreas: string[];
  previousScores: { topic: string; score: number }[];
}

export const generateStudyPlan = async (promptData: AIPromptData) => {
  try {
    // Gemini API endpoint
    const apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

    // Prepare the prompt for Gemini API
    const prompt = `Generate a study plan and resources for the following data: ${JSON.stringify(promptData)}`;

    // Make the API call to Gemini
    const response = await axios.post(
      apiUrl,
      {
        contents: [
          {
            role: 'user',
            parts: [{ text: prompt }],
          },
        ],
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': 'YOUR_GEMINI_API_KEY', // Replace with your Gemini API key
        },
      }
    );

    // Parse Gemini API response
    const aiResponse = (response.data as any).candidates[0].content.parts[0].text;
    const studyPlan: string[] = [];
    const resources: Resource[] = [];

    // Example parsing logic (adjust based on Gemini response format)
    const lines = aiResponse.split('\n');
    lines.forEach((line: { startsWith: (arg0: string) => any; replace: (arg0: string, arg1: string) => { (): any; new(): any; trim: { (): string; new(): any; }; split: { (arg0: string): [any, any]; new(): any; }; }; }) => {
      if (line.startsWith('- Plan:')) {
        studyPlan.push(line.replace('- Plan:', '').trim());
      } else if (line.startsWith('- Resource:')) {
        const [title, link] = line.replace('- Resource:', '').split('|');
        resources.push({ title: title.trim(), link: link.trim() });
      }
    });

    return { studyPlan, resources };
  } catch (error) {
    console.error('Error generating study plan:', error);
    throw error;
  }
};