import Joi from "joi";

export const createJobValidator = Joi.object({
  title: Joi.string()
    .trim()
    .min(2)
    .max(100)
    .required(),

  description: Joi.string()
    .trim()
    .min(20)
    .required(),

  company: Joi.string()
    .trim()
    .min(2)
    .max(100)
    .required(),

  location: Joi.string()
    .trim()
    .min(2)
    .max(100)
    .required(),

  salary: Joi.number()
    .min(0)
    .required(),

  experience: Joi.string()
    .trim()
    .required(),

  jobType: Joi.string()
    .valid(
      "Full-Time",
      "Part-Time",
      "Internship"
    )
    .required(),

  workMode: Joi.string()
    .valid(
      "Remote",
      "Onsite",
      "Hybrid"
    )
    .required(),

  skills: Joi.array()
    .items(Joi.string().trim().min(1))
    .min(1)
    .required(),

  vacancies: Joi.number()
    .integer()
    .min(1)
    .required(),

  deadline: Joi.date()
    .greater("now")
    .required(),
});