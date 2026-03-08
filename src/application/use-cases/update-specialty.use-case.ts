import { ISpecialtyRepository, UpdateSpecialtyInput } from "../../domain/repositories/specialty.repository";
import { DomainError } from "../../domain/errors/domain.error";
import { Specialty } from "../../domain/entities/specialty.entity";


/**
 * Use case: Update an existing specialty in the system.
 */
export class UpdateSpecialtyUseCase {
  constructor(private readonly repo: ISpecialtyRepository) {}

  /**
   * Updates an existing specialty in the system.
   * @param id - The ID of the specialty to update
   * @param input - The data to update the specialty with
   * @returns The updated specialty
   */
  async execute(id: number, input: UpdateSpecialtyInput): Promise<Specialty> {
    const existing = await this.repo.getById(id);
    if (!existing) throw new DomainError("Specialty not found", "SPECIALTY_NOT_FOUND", 404);

    return this.repo.update(id, input);
  }
}