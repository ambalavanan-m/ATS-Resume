const OPENROUTER_API_KEY = "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";

export const analyzeWithLLM = async (resumeText, jobDescription, industry) => {
  const systemPrompt = `You are an expert ATS (Applicant Tracking System) Analyzer. Your job is to deeply analyze a candidate's resume against a specific job description for the ${industry} industry.

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
  "interview_questions": [
    "Technical or behavioral question 1 tailored to the candidate's experience and the job requirements.",
    "Question 2...",
    "Question 3...",
    "Question 4...",
    "Question 5..."
  ]
}

Be realistic and strict like a real ATS. Penalize for missing keywords heavily. Look for measurable metrics in the experience section.`;

  const userPrompt = `JOB DESCRIPTION:\n${jobDescription}\n\n======================\n\nRESUME:\n${resumeText}`;

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        max_tokens: 2500,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        response_format: { type: "json_object" }
      })
    });

    if (!response.ok) {
      const errText = await response.text();
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
