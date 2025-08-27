import jwt from "jsonwebtoken";
import { getEnv } from "../config/env";

export interface JwtPayload {
  userId: string;
}

export function signToken(payload: JwtPayload): string {
  const env = getEnv();
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): JwtPayload {
  const env = getEnv();
  return jwt.verify(token, env.JWT_SECRET) as JwtPayload;
}
