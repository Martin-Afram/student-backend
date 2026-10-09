// Import the UserModel for database operations.
const UserModel = require("../model/user");

// Import the express-validator result reader.
const { validationResult } = require("express-validator");

// Import jsonwebtoken for creating signed tokens.
const jwt = require("jsonwebtoken");

// ---------------------------------------------------------------------------
// Helper — build and sign a JWT for the given user document.
// ---------------------------------------------------------------------------
const signToken = (user) => {
  return jwt.sign(
    // Payload embedded inside the token.
    { id: user._id, name: user.name, email: user.email, role: user.role },
    // Secret key loaded from environment.
    process.env.JWT_SECRET,
    // Token expires after 7 days.
    { expiresIn: "7d" }
  );
};

// ---------------------------------------------------------------------------
// register — create a new user account.
// POST /register
// ---------------------------------------------------------------------------
const register = async (req, res) => {
  try {
    // Collect any validation errors set by the route middleware.
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg, errors: errors.array() });
    }

    const { name, email, password, role } = req.body;

    // Prevent duplicate email registrations.
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "An account with this email already exists" });
    }

    // Persist the new user — the pre-save hook hashes the password automatically.
    const user = await UserModel.create({ name, email, password, role });

    // Issue a token so the user is immediately logged in after registration.
    const token = signToken(user);

    res.status(201).json({
      message: "Account created successfully",
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    res.status(400).json({ message: "Error creating account", error: error.message });
  }
};

// ---------------------------------------------------------------------------
// login — authenticate with email + password and return a JWT.
// POST /login
// ---------------------------------------------------------------------------
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Both fields are mandatory.
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Find the user by email — also select the password field which is normally hidden.
    const user = await UserModel.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Verify the submitted password against the stored hash.
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Reject deactivated accounts.
    if (!user.isActive) {
      return res.status(403).json({ message: "Account is deactivated — contact an administrator" });
    }

    const token = signToken(user);

    res.status(200).json({
      message: "Login successful",
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    res.status(500).json({ message: "Login failed", error: error.message });
  }
};

// ---------------------------------------------------------------------------
// getMe — return the profile of the currently authenticated user.
// GET /me   (requires protect middleware)
// ---------------------------------------------------------------------------
const getMe = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { register, login, getMe };
