// Middleware to allow only admin users to access certain routes.
// It assumes `auth` middleware has already authenticated the request
// and attached user info to `req.user`.
export default function admin(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ message: "User not authenticated" });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }

  // User is admin, so continue to the route handler.
  return next();
}
