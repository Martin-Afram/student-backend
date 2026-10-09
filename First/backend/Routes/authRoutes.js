const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const { register, login, getMe } = require("../Controllers/authController");
const { protect } = require("../middleware/authMiddleware");

// ---------------------------------------------------------------------------
// POST /register — create a new staff / admin account.
// ---------------------------------------------------------------------------
router.post(
  "/register",
  [
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("A valid email is required").normalizeEmail(),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
    body("role")
      .optional()
      .isIn(["admin", "teacher", "staff"])
      .withMessage("Role must be admin, teacher, or staff"),
  ],
  register
);

// ---------------------------------------------------------------------------
// POST /login — authenticate and receive a JWT.
// ---------------------------------------------------------------------------
router.post("/login", login);

// ---------------------------------------------------------------------------
// GET /me — return the authenticated user's profile.
// ---------------------------------------------------------------------------
router.get("/me", protect, getMe);

module.exports = router;
