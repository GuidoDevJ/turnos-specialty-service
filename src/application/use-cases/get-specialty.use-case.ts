import { ISpecialtyRepository } from "../../domain/repositories/specialty.repository";
import { DomainError } from "../../domain/errors/domain.error";
import { Specialty } from "../../domain/entities/specialty.entity";

/**
 * Use case: Retrieve a single specialty by its ID.
 */
export class GetSpecialtyUseCase {
  constructor(private readonly specialtyRepository: ISpecialtyRepository) {}

    /**
   * Finds a specialty by numeric ID.
   * @param id - The specialty's ID
   * @returns The found specialty
   * @throws NotFoundError when the specialty does not exist
   */
  async execute(id: number): Promise<Specialty> {
    const sp = await this.specialtyRepository.getById(id);
    if (!sp) throw new DomainError("Specialty not found", "SPECIALTY_NOT_FOUND", 404);
    return sp;
  }
}