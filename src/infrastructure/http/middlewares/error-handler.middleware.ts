import { Request, Response, NextFunction } from "express";
import { DomainError } from "../../../domain/errors/domain.error";

type ValidationError = {
  kind: "validation";
  issues: Array<{ path: (string | number)[]; message: string }>;
};

type UpstreamError = {
  kind: "upstream";
  message?: string;
  details?: unknown;
};

type PrismaLikeError = { code?: string; meta?: any; message?: string };

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  // Validation
  if (typeof err === "object" && err !== null && (err as any).kind === "validation") {
    const v = err as ValidationError;
    return res.status(400).json({
      status: "error",
      error: {
        code: "VALIDATION_ERROR",
        message: "Invalid request",
        details: v.issues.map(i => ({ path: i.path.join("."), message: i.message })),
      },
    });
  }

  // Domain
  if (err instanceof DomainError) {
    return res.status(err.status).json({
      status: "error",
      error: { code: err.code, message: err.message },
    });
  }

  // Prisma common: unique
  const p = err as PrismaLikeError;
  if (p?.code === "P2002") {
    return res.status(409).json({
      status: "error",
      error: { code: "DUPLICATE", message: "Resource already exists" },
      meta: p.meta,
    });
  }

  // Prisma common: record not found (update/delete)
  if (p?.code === "P2025") {
    return res.status(404).json({
      status: "error",
      error: { code: "NOT_FOUND", message: "Resource not found" },
      meta: p.meta,
    });
  }
  
if (typeof err === "object" && err !== null && (err as any).kind === "auth") {
  return res.status(401).json({
    status: "error",
    error: { code: "UNAUTHORIZED", message: (err as any).message ?? "Unauthorized" },
  });
}

  // Upstream dependency errors (external service)
  if (typeof err === "object" && err !== null && (err as any).kind === "upstream") {
    const upstream = err as UpstreamError;
    return res.status(502).json({
      status: "error",
      error: {
        code: "BAD_GATEWAY",
        message: upstream.message ?? "Upstream service error",
      },
      details: upstream.details,
    });
  }

  if ((err as any)?.code === "BAD_GATEWAY") {
    return res.status(502).json({
      status: "error",
      error: {
        code: "BAD_GATEWAY",
        message: (err as any)?.message ?? "Upstream service error",
      },
    });
  }
  // Fallback
  console.error(err);

  const isDev = (process.env.NODE_ENV ?? "development") !== "production";
  if (isDev) {
    return res.status(500).json({
      status: "error",
      error: {
        code: "INTERNAL_ERROR",
        message: (err as any)?.message ?? "Unexpected error",
      },
      stack: (err as any)?.stack,
    });
  }

  return res.status(500).json({
    status: "error",
    error: { code: "INTERNAL_ERROR", message: "Unexpected error" },
  });
}