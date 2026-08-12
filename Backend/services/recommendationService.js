import gemini from "../config/gemini.js";

export const getJobRecommendations = async (resumeAnalysis, jobs) => {
  try {
    const candidateData = {
      summary: resumeAnalysis.summary,
      skills: resumeAnalysis.skills,
      missingSkills: resumeAnalysis.missingSkills,
    };

    const jobData = jobs.map((job) => ({
      jobId: job._id.toString(),
      title: job.title,
      description: job.description,
      company: job.company,
      location: job.location,
      skills: job.skills,
      experience: job.experience,
      jobType: job.jobType,
      workMode: job.workMode,
    }));

    const response = await gemini.models.generateContent({
      model: "gemini-3.6-flash",

      contents: `
You are Hireonix's AI Job Recommendation Engine.

Recommend the most relevant jobs for the candidate.

Consider:

- Candidate skills
- Resume summary
- Candidate experience
- Job requirements
- Job type
- Work mode
- Overall relevance

Rank the jobs from best to worst.

Return only the top 5 most relevant jobs.

Important rules:

- Do not recommend jobs with very low relevance.
- Do not invent candidate skills.
- Only consider skills explicitly present in the candidate data.
- Give higher scores when the candidate's skills closely match the job requirements.
- Consider experience requirements when calculating the score.
- Consider job type and work mode as additional factors.
- Match scores must be between 0 and 100.
- Return an empty recommendations array if none of the jobs are meaningfully relevant.
- Keep the reason short and specific.
`,

      config: {
        responseMimeType: "application/json",

        responseSchema: {
          type: "object",

          properties: {
            recommendations: {
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

                  reason: {
                    type: "string",
                  },
                },

                required: [
                  "jobId",
                  "matchScore",
                  "reason",
                ],
              },
            },
          },

          required: ["recommendations"],
        },
      },

      contents: `
CANDIDATE:

${JSON.stringify(candidateData, null, 2)}

AVAILABLE JOBS:

${JSON.stringify(jobData, null, 2)}
`,
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error(
      "Job Recommendation AI Error:",
      error.message
    );

    throw new Error("Unable to generate job recommendations");
  }
};