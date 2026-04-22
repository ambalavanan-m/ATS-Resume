import { analyzeWithLLM } from './openRouter';

export const INDUSTRIES = {
  tech: { name: "Technology" },
  finance: { name: "Finance" },
  healthcare: { name: "Healthcare" },
  creative: { name: "Creative" },
  general: { name: "General" }
};

export const analyzeResume = async (resumeText, jobDescription, industryKey = 'general') => {
  if (!resumeText || !jobDescription) {
    throw new Error("Resume and Job Description are required.");
  }
  
  const config = INDUSTRIES[industryKey] || INDUSTRIES.general;
  
  // Call the LLM service to do the heavy lifting
  const results = await analyzeWithLLM(resumeText, jobDescription, config.name);
  
  return results;
};
