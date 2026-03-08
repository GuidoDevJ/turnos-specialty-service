import test from "node:test";
import assert from "node:assert/strict";

import { ListSpecialtiesUseCase } from "./list-specialties.use-case";
import { ISpecialtyRepository } from "../../domain/repositories/specialty.repository";

function buildRepoMock(): ISpecialtyRepository {
  return {
    list: async () => ({
      data: [],
      total: 0,
      page: 1,
      limit: 10,
      totalPages: 1,
    }),
    getById: async () => null,
    create: async (input) => ({
      id: 1,
      name: input.name,
      description: input.description ?? null,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }),
    update: async (id, input) => ({
      id,
      name: input.name ?? "Cardiología",
      description: input.description ?? null,
      isActive: input.isActive ?? true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }),
    softDelete: async (id) => ({
      id,
      name: "Cardiología",
      description: null,
      isActive: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    }),
  };
}

test("ListSpecialtiesUseCase: returns list with filters", async () => {
  const repo = buildRepoMock();
  repo.list = async (query) => ({
    data: [
      {
        id: 1,
        name: "Cardiología",
        description: "Corazón",
        isActive: query?.isActive ?? true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    total: 1,
    page: query?.page ?? 1,
    limit: query?.limit ?? 10,
    totalPages: 1,
  });

  const useCase = new ListSpecialtiesUseCase(repo);
  const result = await useCase.execute({ isActive: true, q: "cardio", page: 1, limit: 10 });

  assert.equal(result.total, 1);
  assert.equal(result.page, 1);
  assert.equal(result.limit, 10);
  assert.equal(result.data.length, 1);
  assert.equal(result.data[0].name, "Cardiología");
  assert.equal(result.data[0].isActive, true);
});
