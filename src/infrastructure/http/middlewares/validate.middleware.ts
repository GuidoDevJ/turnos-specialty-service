import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

type Source = "body" | "params" | "query";

declare module "express-serve-static-core" {
  interface Request {
    validated?: Partial<Record<Source, unknown>>;
  }
}

export function validate(schema: ZodSchema, source: Source = "body") {
  return (req: Request, _res: Response, next: NextFunction) => {
    const input = source === "query" ? req.query : source === "params" ? req.params : req.body;

    const result = schema.safeParse(input);
    if (!result.success) {
      return next({
        kind: "validation",
        issues: result.error.issues,
      });
    }

    req.validated = req.validated ?? {};
    req.validated[source] = result.data;

    next();
  };
}