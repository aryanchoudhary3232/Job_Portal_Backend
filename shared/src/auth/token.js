import jwt from "jsonwebtoken";

const secret = process.env.JWT_SECRET || "change-me";

export const signToken = (user) =>
  jwt.sign({ sub: user.id, role: user.role, email: user.email }, secret, {
    expiresIn: "8h",
  });

export const verifyToken = (token) => jwt.verify(token, secret);
