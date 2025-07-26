import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { Request } from "express";

const prisma = new PrismaClient();

export interface Context {
  prisma: PrismaClient;
  userId?: number;
}

export function createContext({ req }: { req: Request }): Context {
  const token = req.headers.authorization?.replace("Bearer ", "");
  let userId: number | undefined;
  if (token) {
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET!) as any;
      userId = payload.userId;
    } catch {}
  }
  return { prisma, userId };
}
