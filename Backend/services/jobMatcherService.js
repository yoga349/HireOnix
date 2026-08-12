import gemini from "../config/gemini.js";

export const matchJobsWithResume = async (resumeAnalysis, jobs) => {
  try {
    const jobData = jobs.map((job) => ({
      jobId: job._id.toString(),
      title: job.title,
      description: job.description,
      skills: job.skills,
      experience: job.experience,
      jobType: job.jobType,
      workMode: job.workMode,
      location: job.location,
    }));

    const candidateData = {
      resumeSummary: resumeAnalysis.summary,
      skills: resumeAnalysis.skills,
      missingSkills: resumeAnalysis.missingSkills,
    };

    const response = await gemini.models.generateContent({
      model: "gemini-3.6-flash",

      contents: `
You are Hireonix's AI Job Matching Engine.

Compare the candidate's resume information with the available jobs.

For every job:

- Calculate a realistic match score from 0 to 100.
- Identify skills the candidate has that match the job.
- Identify important skills the candidate is missing.
- Give a short reason for the score.

Important rules:

- Do not invent candidate skills.
- Only use skills explicitly present in the candidate data as matched skills.
- Do not give every job a high score.
- A high score should only be given when the candidate's skills and experience strongly match the job.
- Return only jobs with a meaningful match.
- Keep the reason concise and useful.
- Match scores must be between 0 and 100.

CANDIDATE:

${JSON.stringify(candidateData, null, 2)}

AVAILABLE JOBS:

${JSON.stringify(jobData, null, 2)}
`,

      config: {
        responseMimeType: "application/json",

        responseSchema: {
          type: "object",

          properties: {
            matches: {
              type: "array",

              items: {
                type: "object",

                properties: {
                  jobId: {
                    type: "string",
                  },

                  matchScore: {
                    type: "number",
                  },

                  matchedSkills: {
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

                  reason: {
                    type: "string",
                  },
                },

                required: [
                  "jobId",
                  "matchScore",
                  "matchedSkills",
                  "missingSkills",
                  "reason",
                ],
              },
            },
          },

          required: ["matches"],
        },
      },
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Job Matching AI Error:", error.message);

    throw new Error("Unable to match jobs");
  }
};