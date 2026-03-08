import { ISpecialtyRepository, ListSpecialtiesQuery } from "../../domain/repositories/specialty.repository";
import { Specialty, PaginatedResult } from "../../domain/entities/specialty.entity";


/**
 * Use case: List all specialties with optional query parameters.
 */
export class ListSpecialtiesUseCase {
  constructor(private readonly specialtyRepository: ISpecialtyRepository) {}

  /**
   * Lists specialties with optional query parameters.
   * @param query - Query parameters for filtering specialties
   * @returns List of specialties
   */
  async execute(query?: ListSpecialtiesQuery): Promise<PaginatedResult<Specialty>> {
    return this.specialtyRepository.list(query);
  }
}