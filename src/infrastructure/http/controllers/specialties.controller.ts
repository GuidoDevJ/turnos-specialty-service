import { Request, Response, NextFunction } from "express";
import { ListSpecialtiesUseCase } from "../../../application/use-cases/list-specialties.use-case";
import { CreateSpecialtyUseCase } from "../../../application/use-cases/create-specialty.use-case";
import { GetSpecialtyUseCase } from "../../../application/use-cases/get-specialty.use-case";
import { UpdateSpecialtyUseCase } from "../../../application/use-cases/update-specialty.use-case";
import { DeleteSpecialtyUseCase } from "../../../application/use-cases/delete-specialty.use-case";

export class SpecialtiesController {
  constructor(
    private readonly listSpecialties: ListSpecialtiesUseCase,
    private readonly createSpecialty: CreateSpecialtyUseCase,
    private readonly getSpecialty: GetSpecialtyUseCase,
    private readonly updateSpecialty: UpdateSpecialtyUseCase,
    private readonly deleteSpecialty: DeleteSpecialtyUseCase
  ) {}

  list = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // validate() pisa req.query con tipos transformados
      const query = (req.validated?.query ?? {}) as any;
      const data = await this.listSpecialties.execute(query);
      res.json({ status: "success", data });
    } catch (err) {
      next(err);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = (req.validated?.params ?? req.params) as any;
      const data = await this.getSpecialty.execute(Number(id));
      res.json({ status: "success", data });
    } catch (err) {
      next(err);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const created = await this.createSpecialty.execute(req.body);
      res.status(201).json({ status: "success", data: created });
    } catch (err) {
      next(err);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = (req.validated?.params ?? req.params) as any;
      const updated = await this.updateSpecialty.execute(Number(id), req.body);
      res.json({ status: "success", data: updated });
    } catch (err) {
      next(err);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = (req.validated?.params ?? req.params) as any;
      await this.deleteSpecialty.execute(Number(id));
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  };
}