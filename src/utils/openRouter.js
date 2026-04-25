export const analyzeWithLLM = async (resumeText, jobDescription, industry) => {
  // Use the static .env key first, fallback to localStorage if needed
  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY || (typeof window !== 'undefined' ? localStorage.getItem('openrouter_api_key') : null);
  
  if (!apiKey) {
    throw new Error("OpenRouter API Key is missing. Please check your .env file or Settings.");
  }

  const systemPrompt = `You are an expert ATS (Applicant Tracking System) Analyzer and Career Coach. Your job is to deeply analyze a candidate's resume against a specific job description for the ${industry} industry.

You must return a STRICT JSON object without any markdown formatting, no \`\`\`json wrappers. Just raw JSON.
The JSON must adhere to the following schema exactly:

{
  "ats_score": number (0-100),
  "keyword_match_score": number (0-100),
  "format_score": number (0-100),
  "readability_score": number (0-100),
  "section_scores": {
    "experience": number (0-100),
    "education": number (0-100),
    "skills": number (0-100)
  },
  "skills_categorized": {
    "matched_soft": [string, string],
    "matched_hard": [string, string],
    "missing_soft": [string, string],
    "missing_hard": [string, string]
  },
  "strengths": [string, string, string],
  "suggestions": [
    { "priority": "high" | "medium" | "low", "text": "suggestion description" }
  ],
  "summary": "Short 1-2 sentence summary of the candidate's fit.",
  "industry": "${industry}",
  "cover_letter": "A full, professional cover letter (3-4 paragraphs) tailored to the job description, highlighting the candidate's matched skills.",
  "job_match_breakdown": {
    "skills_match": "Brief assessment of skills overlap",
    "experience_level": "Assessment of years and depth of experience vs required",
    "education": "Assessment of educational background vs required",
    "tools_technologies": "Match of specific software/tools",
    "seniority_alignment": "Is candidate over/under qualified or right fit",
    "domain_knowledge": "Industry specific knowledge match",
    "certifications": "Match of required/nice-to-have certifications"
  },
  "rewrite_suggestions": [
    { "original": "Original weak bullet from resume", "improved": "Improved bullet using action verb + metric + impact", "reason": "Why the original was weak" }
  ],
  "skill_gap_plan": [
    { "skill": "Missing critical skill", "difficulty": "Easy|Medium|Hard", "estimated_time": "e.g., 2 weeks", "suggested_project": "A small project to learn this skill" }
  ],
  "format_issues": [
    { "issue": "Description of risky formatting detected based on text/missing sections", "severity": "high|medium|low" }
  ],
  "linkedin_optimization": {
    "headline": "Suggested optimized LinkedIn headline",
    "about_section": "A professional, optimized 'About' section summary",
    "featured_skills": ["Skill 1", "Skill 2", "Skill 3"],
    "experience_bullets": ["A great bullet to feature on LinkedIn", "Another bullet"]
  },
  "interview_prep": [
    { 
      "question": "Targeted interview question", 
      "type": "Technical|Behavioral", 
      "star_framework": { "situation": "suggested situation to pull from their resume", "task": "the task to highlight", "action": "the action they should describe", "result": "the metric or impact to end on" },
      "follow_up": "A likely follow-up question the interviewer might ask"
    }
  ]
}

Be realistic and strict like a real ATS. Penalize for missing keywords heavily. Look for measurable metrics in the experience section. Assume the resume text might have formatting issues. Return exactly this JSON structure.`;

  const userPrompt = `JOB DESCRIPTION:\n${jobDescription}\n\n======================\n\nRESUME:\n${resumeText}`;

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        max_tokens: 8192,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        response_format: { type: "json_object" }
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      if (response.status === 401 || response.status === 403) {
        throw new Error("Invalid or missing OpenRouter API Key. Please update it in the Settings menu (top right).");
      }
      throw new Error(`OpenRouter API error: ${response.status} - ${errText}`);
    }

    const data = await response.json();
    let content = data.choices[0].message.content;
    
    // In case the model still returns markdown wrappers despite instruction
    if (content.startsWith("\`\`\`json")) {
        content = content.replace(/\`\`\`json/g, "").replace(/\`\`\`/g, "").trim();
    } else if (content.startsWith("\`\`\`")) {
        content = content.replace(/\`\`\`/g, "").trim();
    }

    return JSON.parse(content);
  } catch (error) {
    console.error("LLM Analysis Error:", error);
    throw error;
  }
};
