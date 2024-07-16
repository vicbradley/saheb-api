import jwt from "jsonwebtoken";
import config from "../../config.js";

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(403).send({ message: "No token provided." });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, config.jwtSecret, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "Unauthorized!" });
    }

    req.userId = decoded.userId;

    next();
  });
};
