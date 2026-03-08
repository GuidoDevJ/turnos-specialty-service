
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
 *       - in: query
 *         name: page
 *         schema: { type: integer, minimum: 1, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, minimum: 1, maximum: 100, default: 10 }
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string }
 *                 data: { $ref: '#/components/schemas/PaginatedSpecialtyResult' }
 */
  router.get("/", validate(listSpecialtiesQuerySchema, "query"), controller.list);

  /**
 * @openapi
 * /api/specialties/{id}:
 *   get:
 *     summary: Get specialty by id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: OK
 *       404:
 *         description: Not found
 */
  router.get("/:id", validate(specialtyIdParamsSchema, "params"), controller.getById);

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

  /**
 * @openapi
 * /api/specialties/{id}:
 *   put:
 *     summary: Update specialty
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               description: { type: string, nullable: true }
 *               isActive: { type: boolean }
 *     responses:
 *       200:
 *         description: OK
 *       400:
 *         description: Validation error
 *       404:
 *         description: Not found
 */
  router.put(
    "/:id",
    firebaseAuth,
    validate(specialtyIdParamsSchema, "params"),
    validate(updateSpecialtySchema, "body"),
    controller.update
  );

  /**
 * @openapi
 * /api/specialties/{id}:
 *   delete:
 *     summary: Soft delete specialty
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: OK
 *       404:
 *         description: Not found
 */
  router.delete("/:id", firebaseAuth, validate(specialtyIdParamsSchema, "params"), controller.delete);

  return router;
};