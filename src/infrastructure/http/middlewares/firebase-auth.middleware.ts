import { Request, Response, NextFunction } from "express";

declare module "express-serve-static-core" {
  interface Request {
    auth?: { uid: string; email?: string };
  }
}

export async function firebaseAuth(req: Request, _res: Response, next: NextFunction) {
  const isDev = (process.env.NODE_ENV ?? "development") !== "production";
  const bypassSecret = process.env.DEV_BYPASS_TOKEN;

  // ✅ BYPASS (solo dev + token configurado)
  if (isDev && bypassSecret) {
    const bypassHeader = req.header("X-Dev-Bypass-Token");
    if (bypassHeader && bypassHeader === bypassSecret) {
      req.auth = { uid: "dev-user", email: "dev@local" };
      return next();
    }
  }

  // ❌ Sin bypass, y como todavía no configuramos Firebase, devolvemos 401
  return next({ kind: "auth", message: "Unauthorized (dev bypass required)" });
}