// Import the JSON Web Token (JWT) library
import jwt from 'jsonwebtoken';

// Middleware to authenticate requests using JWT
export function authenticateToken(req, res, next) {
  // Get the Authorization header (e.g., "Bearer <token>")
  const authHeader = req.headers['authorization'];

  // Extract the token from the header (the part after "Bearer")
  const token = authHeader && authHeader.split(' ')[1];

  // If there's no token, respond with 401 Unauthorized
  if (!token) return res.sendStatus(401);

  try {
    // Verify the token using the secret key from environment variables
    const user = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the decoded user info to the request object
    req.user = user;

    // Continue to the next middleware or route handler
    next();
  } catch (err) {
    // If token is invalid or expired, respond with 403 Forbidden
    res.sendStatus(403);
  }
}

export function requireAdmin(req, res, next) {
  if (!req.user?.is_admin) {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
}