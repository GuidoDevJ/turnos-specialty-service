import { ISpecialtyRepository, CreateSpecialtyInput } from "../../domain/repositories/specialty.repository";
import { Specialty } from "../../domain/entities/specialty.entity";
import da from "zod/v4/locales/da.js";

/**
 * Use case: Create a new specialty in the system.
 */
export class CreateSpecialtyUseCase {
  constructor(private readonly specialtyRepository: ISpecialtyRepository) {}

    /**
   * Executes specialty creation.
   * @param input - The data needed to create a specialty
   * @returns The newly created specialty
   */
  async execute(input: CreateSpecialtyInput): Promise<Specialty> {

    return this.specialtyRepository.create(input);
  }
}