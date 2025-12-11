// --------------------------
// Authentication Middleware
// --------------------------
const isAuthenticated = (req, res, next) => {
  // Use Passport's built-in method to check login state
  if (!req.isAuthenticated || !req.isAuthenticated()) {
    return res.status(401).json("You do not have access");
  }

  next();
};

module.exports = isAuthenticated;
