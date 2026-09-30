const express = require("express");
const User = require("../models/User");
const crypto = require("crypto");

const router = express.Router();

function generateCode() {
  return crypto.randomInt(100000, 1000000).toString();
}

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const { firstName, lastName, email } = req.body;

    if (!firstName || !lastName || !email) {
      return res.status(400).json({
        message: "First name, last name and email are required."
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await User.findOne({
      email: normalizedEmail
    });

    if (existingUser) {
      return res.status(409).json({
        message: "An account with this email already exists."
      });
    }

    const verificationCode = generateCode();

    const user = await User.create({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: normalizedEmail,
      verificationCode
    });

    res.status(201).json({
      message: "Registration successful.",
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
      },

      // Assignment requires the code to be displayed to the user.
      verificationCode
    });
  } catch (error) {
    console.error("Registration error:", error);

    res.status(500).json({
      message: "Unable to complete registration."
    });
  }
});


// RECOGNIZE EMAIL
router.get("/recognize", async (req, res) => {
  try {
    const email = req.query.email;

    if (!email) {
      return res.status(400).json({
        message: "Email is required."
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await User.findOne({
      email: normalizedEmail
    });

    if (!user) {
      return res.json({
        registered: false
      });
    }

    res.json({
      registered: true,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
      }
    });
  } catch (error) {
    console.error("Recognition error:", error);

    res.status(500).json({
      message: "Unable to check email."
    });
  }
});


// VERIFY LOGIN CODE
router.post("/login", async (req, res) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({
        message: "Email and verification code are required."
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await User.findOne({
      email: normalizedEmail
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found."
      });
    }

    if (user.verificationCode !== String(code).trim()) {
      return res.status(401).json({
        message: "Incorrect verification code."
      });
    }

    res.json({
      message: "Login successful.",
      loggedIn: true,

      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
      }
    });
  } catch (error) {
    console.error("Login error:", error);

    res.status(500).json({
      message: "Unable to verify code."
    });
  }
});

module.exports = router;