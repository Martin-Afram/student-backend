// JWT authentication middleware.
// Protects routes that require a valid signed token.

const jwt = require("jsonwebtoken");

// ---------------------------------------------------------------------------
// protect — verify the Bearer token and attach the decoded payload to req.user
// ---------------------------------------------------------------------------
const protect = (req, res, next) => {
  // Read the Authorization header sent with the request.
  const authHeader = req.headers.authorization;

  // Reject the request when the header is missing or has the wrong format.
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized — no token provided" });
  }

  // Extract the raw token after the "Bearer " prefix.
  const token = authHeader.split(" ")[1];

  try {
    // Verify the token using the application secret.
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the decoded user payload so downstream handlers can read it.
    req.user = decoded;

    // Pass control to the next middleware or route handler.
    next();
  } catch (err) {
    // Respond with an appropriate message depending on the failure type.
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token has expired — please log in again" });
    }
    return res.status(401).json({ message: "Invalid token" });
  }
};

// ---------------------------------------------------------------------------
// authorise — restrict access to users with a specific role.
// Usage: router.delete('/...', protect, authorise('admin'), handler)
// ---------------------------------------------------------------------------
const authorise = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Access denied — requires one of: ${roles.join(", ")}`,
      });
    }
    next();
  };
};

module.exports = { protect, authorise };
