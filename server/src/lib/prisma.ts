import { PrismaClient } from "@prisma/client";

// Prevent multiple instances during dev hot-reload
declare global {
  // eslint-disable-next-line no-var
  var __prismaClient: PrismaClient | undefined;
}

export const prisma: PrismaClient = global.__prismaClient ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") global.__prismaClient = prisma;
