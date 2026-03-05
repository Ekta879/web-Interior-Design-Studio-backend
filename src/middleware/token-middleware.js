import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export function authenticateToken(req, res, next) {
  if (req.path === "/api/auth/login") {
    return next();
  }

  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .send({ message: "Access denied. No token provided." });
  }

  jwt.verify(token, process.env.secretkey || "secret-key", (err, decoded) => {
    if (err) {
      return res.status(403).send("Invalid or expired token.");
    }
    req.user = decoded;
    next();
  });
}