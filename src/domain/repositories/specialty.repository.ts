import { Specialty, PaginatedResult } from "../entities/specialty.entity";

export type CreateSpecialtyInput = {
  name: string;
  description?: string | null;
};

export type UpdateSpecialtyInput = {
  name?: string;
  description?: string | null;
  isActive?: boolean;
};

export type ListSpecialtiesQuery = {
  isActive?: boolean;
  q?: string;
  page?: number;
  limit?: number;
};

export interface ISpecialtyRepository {
  list(query?: ListSpecialtiesQuery): Promise<PaginatedResult<Specialty>>;
  getById(id: number): Promise<Specialty | null>;
  create(input: CreateSpecialtyInput): Promise<Specialty>;
  update(id: number, input: UpdateSpecialtyInput): Promise<Specialty>;
  softDelete(id: number): Promise<Specialty>;
}