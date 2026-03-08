import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";

import { env } from "./config/env";
// import { initFirebase } from "./config/firebase";
import { swaggerSpec } from "./infrastructure/http/swagger";

// ── Repositories ───────────────────────────────────────────────────────────────
import { PrismaSpecialtyRepository } from "./infrastructure/database/prisma/specialty.repository.impl";

// ── Specialty use cases ────────────────────────────────────────────────────────
import { CreateSpecialtyUseCase } from "./application/use-cases/create-specialty.use-case";
import { ListSpecialtiesUseCase } from "./application/use-cases/list-specialties.use-case";
import { GetSpecialtyUseCase } from "./application/use-cases/get-specialty.use-case";
import { UpdateSpecialtyUseCase } from "./application/use-cases/update-specialty.use-case";
import { DeleteSpecialtyUseCase } from "./application/use-cases/delete-specialty.use-case";

// ── HTTP layer ─────────────────────────────────────────────────────────────────
import { SpecialtiesController } from "./infrastructure/http/controllers/specialties.controller";
import { createSpecialtiesRouter } from "./infrastructure/http/routes/specialties.routes";
import { errorHandler } from "./infrastructure/http/middlewares/error-handler.middleware";

// initFirebase();

const app = express();

// ── Global middlewares ─────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ── Swagger docs ───────────────────────────────────────────────────────────────
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ── Repository instances ───────────────────────────────────────────────────────
const specialtyRepository = new PrismaSpecialtyRepository();

// ── Use case instances ─────────────────────────────────────────────────────────
const listSpecialtiesUseCase = new ListSpecialtiesUseCase(specialtyRepository);
const createSpecialtyUseCase = new CreateSpecialtyUseCase(specialtyRepository);
const getSpecialtyUseCase = new GetSpecialtyUseCase(specialtyRepository);
const updateSpecialtyUseCase = new UpdateSpecialtyUseCase(specialtyRepository);
const deleteSpecialtyUseCase = new DeleteSpecialtyUseCase(specialtyRepository);

// ── Controller instances ───────────────────────────────────────────────────────
const specialtiesController = new SpecialtiesController(
  listSpecialtiesUseCase,
  createSpecialtyUseCase,
  getSpecialtyUseCase,
  updateSpecialtyUseCase,
  deleteSpecialtyUseCase
);

// ── Routes ─────────────────────────────────────────────────────────────────────
app.use("/api/specialties", createSpecialtiesRouter(specialtiesController));

// ── Health check ───────────────────────────────────────────────────────────────
app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "turnos-specialty-service" });
});

// ── Global error handler ───────────────────────────────────────────────────────
app.use(errorHandler);

// ── HTTP server ────────────────────────────────────────────────────────────────
app.listen(env.port, () => {
  console.log(`Server running on port ${env.port}`);
  console.log(`Swagger docs at http://localhost:${env.port}/api-docs`);
});