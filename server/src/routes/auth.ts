import { Router } from "express";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma";
import { signToken } from "../utils/jwt";
import { getEnv } from "../config/env";
import { sendVerificationCodeEmail } from "../lib/mailer";
import { otpLimiter, authLimiter } from "../middleware/rateLimit";

export const authRouter = Router();

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1).optional()
});

authRouter.post("/signup", authLimiter, async (req, res, next) => {
  try {
    const { email, password, name } = signupSchema.parse(req.body);
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      res.status(409).json({ error: "Email already in use" });
      return;
    }

    const env = getEnv();
    const salt = await bcrypt.genSalt(env.BCRYPT_SALT_ROUNDS);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await prisma.user.create({ data: { email, passwordHash, name } });
    const token = signToken({ userId: user.id });

    res.status(201).json({ token, user: { id: user.id, email: user.email, name: user.name } });
  } catch (err) {
    next(err);
  }
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

authRouter.post("/login", authLimiter, async (req, res, next) => {
  try {
    const { email, password } = loginSchema.parse(req.body);
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    const token = signToken({ userId: user.id });
    res.json({ token, user: { id: user.id, email: user.email, name: user.name } });
  } catch (err) {
    next(err);
  }
});

// OTP: request code
const requestCodeSchema = z.object({ email: z.string().email() });

authRouter.post("/request-code", otpLimiter, async (req, res, next) => {
  try {
    const { email } = requestCodeSchema.parse(req.body);

    // generate 6-digit code
    const code = String(Math.floor(100000 + Math.random() * 900000));
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 min

    await prisma.verificationCode.create({ data: { email, code, expiresAt } });

    const result = await sendVerificationCodeEmail(email, code);
    if (result.previewUrl) {
      // eslint-disable-next-line no-console
      console.log("OTP email preview:", result.previewUrl);
    }

    res.json({ ok: true, previewUrl: result.previewUrl });
  } catch (err) {
    next(err);
  }
});

// OTP: verify code
const verifyCodeSchema = z.object({ email: z.string().email(), code: z.string().length(6) });

authRouter.post("/verify-code", async (req, res, next) => {
  try {
    const { email, code } = verifyCodeSchema.parse(req.body);

    const now = new Date();
    const record = await prisma.verificationCode.findFirst({
      where: { email, code, consumed: false, expiresAt: { gt: now } },
      orderBy: { createdAt: "desc" }
    });

    if (!record) {
      res.status(400).json({ error: "Invalid or expired code" });
      return;
    }

    // mark consumed
    await prisma.verificationCode.update({ where: { id: record.id }, data: { consumed: true } });

    // create or fetch user, issue token
    let user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      const env = getEnv();
      const salt = await bcrypt.genSalt(env.BCRYPT_SALT_ROUNDS);
      // generate a random password hash for OTP-only accounts
      const passwordHash = await bcrypt.hash("otp-login-placeholder", salt);
      user = await prisma.user.create({ data: { email, passwordHash } });
    }

    const token = signToken({ userId: user.id });
    res.json({ token, user: { id: user.id, email: user.email, name: user.name } });
  } catch (err) {
    next(err);
  }
});
