import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";

export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  const header = req.header("Authorization");
  if (!header) {
    res.status(401).json({ error: "Missing Authorization header" });
    return;
  }

  const [scheme, token] = header.split(" ");
  if (scheme !== "Bearer" || !token) {
    res.status(401).json({ error: "Invalid Authorization header" });
    return;
  }

  try {
    const payload = verifyToken(token);
    req.userId = payload.userId;
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
}
