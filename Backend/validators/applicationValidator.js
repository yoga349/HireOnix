import Joi from "joi";

export const updateApplicationStatusValidator = Joi.object({
  status: Joi.string()
    .valid(
      "Applied",
      "Under Review",
      "Shortlisted",
      "Interview",
      "Rejected",
      "Selected"
    )
    .required(),
});
