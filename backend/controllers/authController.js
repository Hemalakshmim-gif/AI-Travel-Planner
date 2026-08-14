import bcrypt from "bcrypt";

import {
  findUserByEmail,
  createUser,
} from "../models/userModel.js";

import generateToken from "../utils/generateToken.js";

// ===============================
// Register User
// ===============================

export const register = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const existingUser = await findUserByEmail(email);

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userId = await createUser(
      fullName,
      email,
      hashedPassword
    );

    const token = generateToken(userId);

    res.status(201).json({
      success: true,
      message: "Registration successful",
      token,
      user: {
        id: userId,
        fullName,
        email,
      },
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ===============================
// Login User
// ===============================

export const login = async (req, res) => {
  try {

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await findUserByEmail(email);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = generateToken(user.id);

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user.id,
        fullName: user.full_name,
        email: user.email,
        profileImage: user.profile_image,
      },
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });

  }
};

// ===============================
// Get Logged In User
// ===============================

export const getMe = async (req, res) => {

  res.status(200).json({

    success: true,

    user: req.user,

  });

};