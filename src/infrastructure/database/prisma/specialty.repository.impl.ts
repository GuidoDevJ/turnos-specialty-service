import { prismaClient } from "./client";
import {
  ISpecialtyRepository,
  CreateSpecialtyInput,
  UpdateSpecialtyInput,
  ListSpecialtiesQuery,
} from "../../../domain/repositories/specialty.repository";

import { Specialty, PaginatedResult } from "../../../domain/entities/specialty.entity";

/**
 * Prisma-based implementation of the ISpecialtyRepository port.
 * Adapts Prisma operations to the domain contract.
 */
export class PrismaSpecialtyRepository implements ISpecialtyRepository {
  /** @inheritdoc */
  async list(query?: ListSpecialtiesQuery): Promise<PaginatedResult<Specialty>> {
    const q = query?.q?.trim();
    const page = query?.page ?? 1;
    const limit = query?.limit ?? 10;
    const skip = (page - 1) * limit;

    const where = {
      ...(typeof query?.isActive === "boolean" ? { isActive: query.isActive } : {}),
      ...(q
        ? {
            OR: [
              { name: { contains: q, mode: "insensitive" as const } },
              { description: { contains: q, mode: "insensitive" as const } },
            ],
          }
        : {}),
    };

    const [total, data] = await prismaClient.$transaction([
      prismaClient.specialty.count({ where }),
      prismaClient.specialty.findMany({
        where,
        orderBy: { name: "asc" },
        skip,
        take: limit,
      }),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    };
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