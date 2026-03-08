import { ISpecialtyRepository } from "../../domain/repositories/specialty.repository";
import { DomainError } from "../../domain/errors/domain.error";
import { Specialty } from "../../domain/entities/specialty.entity";


/**
 * Use case: Delete an existing specialty in the system.
 */
export class DeleteSpecialtyUseCase {
  constructor(private readonly repo: ISpecialtyRepository) {}

  async execute(id: number): Promise<Specialty> {
    const existing = await this.repo.getById(id);
    if (!existing) throw new DomainError("Specialty not found", "SPECIALTY_NOT_FOUND", 404);

    return this.repo.softDelete(id);
  }
}