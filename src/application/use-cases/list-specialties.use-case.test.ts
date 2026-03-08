import test from "node:test";
import assert from "node:assert/strict";

import { ListSpecialtiesUseCase } from "./list-specialties.use-case";
import { ISpecialtyRepository } from "../../domain/repositories/specialty.repository";

function buildRepoMock(): ISpecialtyRepository {
  return {
    list: async () => [],
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
  repo.list = async (query) => [
    {
      id: 1,
      name: "Cardiología",
      description: "Corazón",
      isActive: query?.isActive ?? true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  const useCase = new ListSpecialtiesUseCase(repo);
  const result = await useCase.execute({ isActive: true, q: "cardio" });

  assert.equal(result.length, 1);
  assert.equal(result[0].name, "Cardiología");
  assert.equal(result[0].isActive, true);
});
