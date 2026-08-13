import Joi from "joi";

export const registerValidator = Joi.object({
  name: Joi.string()
    .trim()
    .min(2)
    .max(50)
    .required(),

  email: Joi.string()
    .trim()
    .email()
    .required(),

  password: Joi.string()
    .min(6)
    .max(100)
    .required(),

  role: Joi.string()
    .valid("candidate", "recruiter")
    .required(),
});

export const loginValidator = Joi.object({
  email: Joi.string()
    .trim()
    .email()
    .required(),

  password: Joi.string()
    .required(),
});