import User from "../Models/User.js";
import bcrypt from "bcryptjs";
import sendEmail from "../utils/sendEmail.js";
import { welcomeEmail } from "../templates/welcomeMail.js";

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({
        message: "Please fill all fields",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    // Send response immediately
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

    // Send welcome email in the background
    sendEmail(
      user.email,
      "Welcome to HireOnix 🎉",
      welcomeEmail(user.name)
    )
      .then(() => {
        console.log(`Welcome email sent to ${user.email}`);
      })
      .catch((emailError) => {
        console.error("Welcome email failed:", emailError);
      });

  } catch (error) {
    console.error("Registration error:", error);

    return res.status(500).json({
      message: error.message,
    });
  }
};

