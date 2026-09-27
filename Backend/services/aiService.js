import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export const analyzeResume = async (resumeText) => {
  try {
    const response = await groq.chat.completions.create({
      model: "openai/gpt-oss-20b",
      messages: [
        {
          role: "system",
          content: `
You are an expert resume analyzer for a job portal called Hireonix.

Analyze the candidate's resume carefully.

Evaluate:

- Overall resume quality
- Technical and professional skills
- Missing or weak skills
- Strengths
- Areas for improvement
- Resume summary

Give a score from 0 to 100.

Important rules:

- Do not invent information that is not present in the resume.
- Only identify skills that are actually present in the resume.
- Keep suggestions practical and useful for improving the resume.
- missingSkills should contain skills that would improve the candidate's profile based on the resume, but clearly distinguish them from skills the candidate already has.
- Return only the requested JSON structure.
`,
        },
        {
          role: "user",
          content: `
Analyze the following resume:

--- RESUME START ---
${resumeText}
--- RESUME END ---
`,
        },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "resume_analysis",
          strict: true,
          schema: {
            type: "object",
            properties: {
              score: {
                type: "number",
              },
              summary: {
                type: "string",
              },
              skills: {
                type: "array",
                items: {
                  type: "string",
                },
              },
              missingSkills: {
                type: "array",
                items: {
                  type: "string",
                },
              },
              strengths: {
                type: "array",
                items: {
                  type: "string",
                },
              },
              suggestions: {
                type: "array",
                items: {
                  type: "string",
                },
              },
            },
            required: [
              "score",
              "summary",
              "skills",
              "missingSkills",
              "strengths",
              "suggestions",
            ],
            additionalProperties: false,
          },
        },
      },
    });

    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    console.error("Groq Resume Analysis Error:", error.message);
    throw new Error("Unable to analyze resume");
  }
};