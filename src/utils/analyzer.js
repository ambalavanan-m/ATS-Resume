import { normalizeText, extractKeywords, ACTION_VERBS, categorizeSkills } from './textUtils';

export const INDUSTRIES = {
  tech: { name: "Technology", weights: { keywords: 0.5, format: 0.2, readability: 0.3 }, required: ["skills", "experience", "projects"] },
  finance: { name: "Finance", weights: { keywords: 0.4, format: 0.4, readability: 0.2 }, required: ["experience", "education", "certifications"] },
  healthcare: { name: "Healthcare", weights: { keywords: 0.3, format: 0.4, readability: 0.3 }, required: ["education", "experience", "licenses"] },
  creative: { name: "Creative", weights: { keywords: 0.3, format: 0.3, readability: 0.4 }, required: ["portfolio", "projects", "skills"] },
  general: { name: "General", weights: { keywords: 0.4, format: 0.3, readability: 0.3 }, required: ["experience", "education", "skills"] }
};

export const analyzeResume = (resumeText, jobDescription, industryKey = 'general') => {
  const normalizedResume = normalizeText(resumeText);
  const normalizedJD = normalizeText(jobDescription);
  const config = INDUSTRIES[industryKey] || INDUSTRIES.general;
  
  // 1. Keyword Match Score
  const jdKeywords = extractKeywords(jobDescription);
  const resumeWords = new Set(normalizedResume.split(' '));
  
  const matchedKeywords = jdKeywords.filter(kw => resumeWords.has(kw));
  const missingKeywords = jdKeywords.filter(kw => !resumeWords.has(kw));
  
  const keywordMatchScore = jdKeywords.length > 0 
    ? Math.round((matchedKeywords.length / jdKeywords.length) * 100) 
    : 0;

  // 2. Format Score
  let formatScore = 0;
  const sections = ["education", "experience", "skills", "projects", "summary", "contact", "portfolio", "certifications", "licenses"];
  const foundSections = sections.filter(section => resumeText.toLowerCase().includes(section));
  
  // Custom section scoring based on industry
  const industryMetReqs = config.required.filter(req => foundSections.includes(req));
  formatScore += (industryMetReqs.length / config.required.length) * 60; // 60% weight for required sections
  
  if (/[-*•]/.test(resumeText)) formatScore += 20;
  if (!/(\n\s*){3,}/.test(resumeText)) formatScore += 20;
  
  formatScore = Math.min(Math.round(formatScore), 100);

  // 3. Readability Score
  const sentences = resumeText.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const avgSentenceLength = sentences.length > 0 
    ? sentences.reduce((acc, s) => acc + s.trim().split(/\s+/).length, 0) / sentences.length
    : 0;
  
  let readabilityScore = 100;
  if (avgSentenceLength < 8 || avgSentenceLength > 20) readabilityScore -= 30;
  
  const words = normalizedResume.split(' ');
  const repeatedWords = words.filter((w, i) => w === words[i - 1]).length;
  readabilityScore -= (repeatedWords * 5);
  
  readabilityScore = Math.max(Math.min(Math.round(readabilityScore), 100), 0);

  // 4. Section Scores (Specific)
  const experienceScore = foundSections.includes("experience") ? 100 : 0;
  const educationScore = foundSections.includes("education") ? 100 : 0;
  const skillsScore = keywordMatchScore;

  // 5. ATS Score (Industry-Weighted)
  const atsScore = Math.round(
    (keywordMatchScore * config.weights.keywords) + 
    (formatScore * config.weights.format) + 
    (readabilityScore * config.weights.readability)
  );

  // 6. Skill Categorization
  const { soft: matchedSoft, hard: matchedHard } = categorizeSkills(matchedKeywords);
  const { soft: missingSoft, hard: missingHard } = categorizeSkills(missingKeywords);

  // 7. Strengths & Suggestions
  const strengths = [];
  const foundActionVerbs = Array.from(ACTION_VERBS).filter(v => normalizedResume.includes(v));
  if (foundActionVerbs.length >= 5) strengths.push("Strong use of action verbs.");
  if (/\d+[%$]/.test(resumeText)) strengths.push("Includes measurable metrics and data.");
  if (foundSections.length >= 4) strengths.push("Well-structured with clear sections.");
  if (industryMetReqs.length === config.required.length) strengths.push(`Matches essential ${config.name} section requirements.`);

  const suggestions = [];
  if (missingKeywords.length > 5) {
    suggestions.push({ priority: "high", text: `Missing several target keywords. Consider adding: ${missingKeywords.slice(0, 5).join(", ")}.` });
  }
  if (industryMetReqs.length < config.required.length) {
    const missingReqs = config.required.filter(req => !foundSections.includes(req));
    suggestions.push({ priority: "high", text: `Missing critical sections for ${config.name}: ${missingReqs.join(", ")}.` });
  }
  if (avgSentenceLength > 20) {
    suggestions.push({ priority: "medium", text: "Sentences are quite long; consider being more concise." });
  }
  if (!/[-*•]/.test(resumeText)) {
    suggestions.push({ priority: "medium", text: "Use bullet points to improve scannability of your experience." });
  }

  return {
    ats_score: atsScore,
    keyword_match_score: keywordMatchScore,
    format_score: formatScore,
    readability_score: readabilityScore,
    section_scores: {
        experience: experienceScore,
        education: educationScore,
        skills: skillsScore
    },
    skills_categorized: {
        matched_soft: matchedSoft,
        matched_hard: matchedHard,
        missing_soft: missingSoft,
        missing_hard: missingHard
    },
    strengths,
    suggestions,
    summary: atsScore > 80 ? "Excellent match!" : atsScore > 50 ? "Good potential." : "Needs significant work.",
    industry: config.name
  };
};
