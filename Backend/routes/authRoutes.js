import express from "express";
import { registerUser } from "../controllers/user.js";
import { loginUser } from "../controllers/loginController.js";
import { validate } from "../middleware/validationMiddleware.js";
import {
  registerValidator,
  loginValidator,
} from "../validators/userValidator.js";
import { loginLimiter } from "../middleware/rateLimit.js";
const router = express.Router();

router.post("/register", validate(registerValidator), registerUser);
router.post("/login",loginLimiter,validate(loginValidator),loginUser);
export default router;