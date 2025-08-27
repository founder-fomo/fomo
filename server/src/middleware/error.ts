import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof ZodError) {
    res.status(400).json({ error: "ValidationError", details: err.flatten() });
    return;
  }

  if (err instanceof Error) {
    const status = (err as any).statusCode ?? 500;
    res.status(status).json({ error: err.message });
    return;
  }

  res.status(500).json({ error: "Unknown error" });
}
