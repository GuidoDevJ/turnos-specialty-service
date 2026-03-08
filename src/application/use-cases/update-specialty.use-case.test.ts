import test from "node:test";
import assert from "node:assert/strict";

import { UpdateSpecialtyUseCase } from "./update-specialty.use-case";
import { DomainError } from "../../domain/errors/domain.error";
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

test("UpdateSpecialtyUseCase: updates specialty when it exists", async () => {
  const repo = buildRepoMock();
  repo.getById = async (id) => ({
    id,
    name: "Cardiología",
    description: "Corazón",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  const useCase = new UpdateSpecialtyUseCase(repo);
  const result = await useCase.execute(1, { name: "Cardio Infantil", isActive: true });

  assert.equal(result.id, 1);
  assert.equal(result.name, "Cardio Infantil");
});

test("UpdateSpecialtyUseCase: throws DomainError when specialty does not exist", async () => {
  const repo = buildRepoMock();
  const useCase = new UpdateSpecialtyUseCase(repo);

  await assert.rejects(
    () => useCase.execute(999, { name: "x" }),
    (error: unknown) => {
      assert.ok(error instanceof DomainError);
      assert.equal(error.code, "SPECIALTY_NOT_FOUND");
      assert.equal(error.status, 404);
      return true;
    }
  );
});
