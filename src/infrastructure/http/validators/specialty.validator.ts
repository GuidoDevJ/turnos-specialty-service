import { z } from "zod";

export const createSpecialtySchema = z.object({
  name: z.string().trim().min(3).max(100),
  description: z.string().trim().max(500).optional().nullable(),
});

export const specialtyIdParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const listSpecialtiesQuerySchema = z.object({
  isActive: z
    .enum(["true", "false"])
    .optional()
    .transform(v => (v === undefined ? undefined : v === "true")),
  q: z.string().trim().min(1).max(100).optional(),
});

export const updateSpecialtySchema = z
  .object({
    name: z.string().trim().min(3).max(100).optional(),
    description: z.string().trim().max(500).optional().nullable(),
    isActive: z.boolean().optional(),
  })
  .refine(obj => Object.keys(obj).length > 0, {
    message: "At least one field is required",
    path: [],
  });