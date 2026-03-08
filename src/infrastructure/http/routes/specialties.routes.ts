
import { Router } from "express";
import { SpecialtiesController } from "../controllers/specialties.controller";
import { validate } from "../middlewares/validate.middleware";
import {
  createSpecialtySchema,
  listSpecialtiesQuerySchema,
  specialtyIdParamsSchema,
  updateSpecialtySchema,
} from "../validators/specialty.validator";

import { firebaseAuth } from "../middlewares/firebase-auth.middleware";

export const createSpecialtiesRouter = (controller: SpecialtiesController) => {
  const router = Router();

  /**
 * @openapi
 * /api/specialties:
 *   get:
 *     summary: List specialties
 *     parameters:
 *       - in: query
 *         name: isActive
 *         schema: { type: boolean }
 *       - in: query
 *         name: q
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string }
 *                 data:
 *                   type: array
 *                   items: { $ref: '#/components/schemas/Specialty' }
 */
  router.get("/", validate(listSpecialtiesQuerySchema, "query"), controller.list);

  /**
 * @openapi
 * /api/specialties:
 *   post:
 *     summary: Create specialty
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name: { type: string }
 *               description: { type: string, nullable: true }
 *     responses:
 *       201:
 *         description: Created
 *       409:
 *         description: Duplicate name
 */
router.post("/", firebaseAuth, validate(createSpecialtySchema, "body"), controller.create);
router.put("/:id", firebaseAuth, validate(specialtyIdParamsSchema, "params"), validate(updateSpecialtySchema, "body"), controller.update);
router.delete("/:id", firebaseAuth, validate(specialtyIdParamsSchema, "params"), controller.deactivate);

// router.post("/", validate(createSpecialtySchema, "body"), controller.create);

  // router.get("/:id", validate(specialtyIdParamsSchema, "params"), controller.getById);
  // router.put("/:id", validate(specialtyIdParamsSchema, "params"), validate(updateSpecialtySchema, "body"), controller.update);
  // router.delete("/:id", validate(specialtyIdParamsSchema, "params"), controller.deactivate);

  return router;
};