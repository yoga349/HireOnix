import rateLimit from "express-rate-limit";

// Login protection
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,

  message: {
    success: false,
    message: "Too many login attempts. Please try again later.",
  },

  standardHeaders: true,
  legacyHeaders: false,
});


// AI protection
export const aiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20,

  message: {
    success: false,
    message: "Too many AI requests. Please try again later.",
  },

  standardHeaders: true,
  legacyHeaders: false,
});