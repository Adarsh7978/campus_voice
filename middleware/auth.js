import jwt from "jsonwebtoken";

// Middleware to protect routes by verifying a JWT from the Authorization header.
// If the token is valid, the user information from the token payload is attached
// to req.user so later route handlers can access the authenticated user.
export default function auth(req, res, next) {
  // Authorization header should look like: "Bearer <token>"
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Authorization header missing" });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token not found in Authorization header" });
  }

  try {
    // Verify the token using the secret from environment variables.
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach decoded user data to req.user for later use.
    req.user = decoded;

    // Continue to the next middleware or route handler.
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}
