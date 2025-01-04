require('dotenv').config();
const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Registration
const registerUser = async (req, res) => {
  try {
    const { userName, userEmail, password, role = "user" } = req.body;

    // Validate input fields
    if (!userName || !userEmail || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields: userName, userEmail, and password",
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userEmail)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    // Check if user exists
    const existingUser = await User.findOne({
      $or: [{ userEmail }, { userName }],
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User name or email already exists",
      });
    }

    // Hash password
    const hashPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      userName,
      userEmail,
      role,
      password: hashPassword,
    });

    await newUser.save();

    return res.status(201).json({
      success: true,
      message: "User registered successfully!",
    });
  } catch (error) {
    console.error("Error registering user:", error.message);
    return res.status(500).json({
      success: false,
      message: "An error occurred while registering the user",
    });
  }
};


// Login
const loginUser = async (req, res) => {
  const { userEmail, password } = req.body;

  const checkUser = await User.findOne({ userEmail });

  if (!checkUser || !(await bcrypt.compare(password, checkUser.password))) {
    return res.status(401).json({
      success: false,
      message: "Invalid credentials",
    });
  }

  const accessToken = jwt.sign(
    {
      _id: checkUser._id,
      userName: checkUser.userName,
      userEmail: checkUser.userEmail,
      role: checkUser.role,
    },
    process.env.JWT_SECRET,  // Use the secret from .env
    { expiresIn: "120m" }
  );

  res.status(200).json({
    success: true,
    message: "Logged in successfully",
    data: {
      accessToken,
      user: {
        _id: checkUser._id,
        userName: checkUser.userName,
        userEmail: checkUser.userEmail,
        role: checkUser.role,
      },
    },
  });
};

module.exports = { registerUser, loginUser };
