import { Specialty } from "../entities/specialty.entity";

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
};

export interface ISpecialtyRepository {
  list(query?: ListSpecialtiesQuery): Promise<Specialty[]>;
  getById(id: number): Promise<Specialty | null>;
  create(input: CreateSpecialtyInput): Promise<Specialty>;
  update(id: number, input: UpdateSpecialtyInput): Promise<Specialty>;
  softDelete(id: number): Promise<Specialty>;
}