import { prismaClient } from "./client";
import {
  ISpecialtyRepository,
  CreateSpecialtyInput,
  UpdateSpecialtyInput,
  ListSpecialtiesQuery,
} from "../../../domain/repositories/specialty.repository";

import { Specialty } from "../../../domain/entities/specialty.entity";

/**
 * Prisma-based implementation of the ISpecialtyRepository port.
 * Adapts Prisma operations to the domain contract.
 */
export class PrismaSpecialtyRepository implements ISpecialtyRepository {
  /** @inheritdoc */
  async list(query?: ListSpecialtiesQuery): Promise<Specialty[]> {
    const q = query?.q?.trim();
    return prismaClient.specialty.findMany({
      where: {
        ...(typeof query?.isActive === "boolean" ? { isActive: query.isActive } : {}),
        ...(q
          ? {
              OR: [
                { name: { contains: q, mode: "insensitive" } },
                { description: { contains: q, mode: "insensitive" } },
              ],
            }
          : {}),
      },
      orderBy: { name: "asc" },
    });
  }

  /** @inheritdoc */
  async getById(id: number): Promise<Specialty | null> {
    return prismaClient.specialty.findUnique({ where: { id } });
  }

  /** @inheritdoc */
  async create(input: CreateSpecialtyInput): Promise<Specialty> {
    return prismaClient.specialty.create({
      data: {
        name: input.name,
        description: input.description ?? null,
      },
    });
  }

  /** @inheritdoc */
  async update(id: number, input: UpdateSpecialtyInput): Promise<Specialty> {
    return prismaClient .specialty.update({
      where: { id },
      data: {
        ...(input.name !== undefined ? { name: input.name } : {}),
        ...(input.description !== undefined ? { description: input.description } : {}),
        ...(input.isActive !== undefined ? { isActive: input.isActive } : {}),
      },
    });
  }

  /** @inheritdoc */
  async softDelete(id: number): Promise<Specialty> {
    return prismaClient.specialty.update({
      where: { id },
      data: { isActive: false },
    });
  }
}