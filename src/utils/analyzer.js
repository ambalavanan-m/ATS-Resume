import { normalizeText, extractKeywords, ACTION_VERBS } from './textUtils';

export const analyzeResume = (resumeText, jobDescription) => {
  const normalizedResume = normalizeText(resumeText);
  const normalizedJD = normalizeText(jobDescription);
  
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
  const sections = ["education", "experience", "skills", "projects", "summary", "contact"];
  const foundSections = sections.filter(section => resumeText.toLowerCase().includes(section));
  formatScore += (foundSections.length / sections.length) * 50;
  
  if (/[-*•]/.test(resumeText)) formatScore += 25;
  if (!/(\n\s*){3,}/.test(resumeText)) formatScore += 25;
  
  formatScore = Math.min(Math.round(formatScore), 100);

  // 3. Readability Score
  const sentences = resumeText.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const avgSentenceLength = sentences.reduce((acc, s) => acc + s.trim().split(/\s+/).length, 0) / sentences.length;
  
  let readabilityScore = 100;
  if (avgSentenceLength < 8 || avgSentenceLength > 20) readabilityScore -= 30;
  
  const words = normalizedResume.split(' ');
  const repeatedWords = words.filter((w, i) => w === words[i - 1]).length;
  readabilityScore -= (repeatedWords * 5);
  
  readabilityScore = Math.max(Math.min(Math.round(readabilityScore), 100), 0);

  // 4. ATS Score (Weighted)
  const atsScore = Math.round(
    (keywordMatchScore * 0.4) + (formatScore * 0.3) + (readabilityScore * 0.3)
  );

  // 5. Strengths
  const strengths = [];
  const foundActionVerbs = Array.from(ACTION_VERBS).filter(v => normalizedResume.includes(v));
  if (foundActionVerbs.length >= 5) strengths.push("Strong use of action verbs.");
  if (/\d+[%$]/.test(resumeText)) strengths.push("Includes measurable metrics and data.");
  if (foundSections.length >= 4) strengths.push("Well-structured with clear sections.");

  // 6. Suggestions
  const suggestions = [];
  if (missingKeywords.length > 5) {
    suggestions.push({ priority: "high", text: `Missing several target keywords. Consider adding: ${missingKeywords.slice(0, 5).join(", ")}.` });
  }
  if (foundSections.length < 3) {
    suggestions.push({ priority: "high", text: "Resume is missing critical sections like Experience or Skills." });
  }
  if (avgSentenceLength > 20) {
    suggestions.push({ priority: "medium", text: "Sentences are quite long; consider being more concise." });
  }
  if (!/[-*•]/.test(resumeText)) {
    suggestions.push({ priority: "medium", text: "Use bullet points to improve scannability of your experience." });
  }
  if (readabilityScore < 70) {
    suggestions.push({ priority: "low", text: "Improve overall flow and avoid word repetition." });
  }

  // 7. Summary
  let summary = "";
  if (atsScore > 80) {
    summary = "Overall, this is an excellent resume that matches the job description very well. High chance of passing ATS filters.";
  } else if (atsScore > 50) {
    summary = "The resume is decent but needs optimization in keyword matching and formatting to stand out.";
  } else {
    summary = "The resume requires significant improvements in keywords and structure to better align with the role.";
  }

  return {
    ats_score: atsScore,
    keyword_match_score: keywordMatchScore,
    format_score: formatScore,
    readability_score: readabilityScore,
    matched_keywords: matchedKeywords,
    missing_keywords: missingKeywords,
    strengths,
    suggestions,
    summary
  };
};
