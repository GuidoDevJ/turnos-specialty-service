import test from "node:test";
import assert from "node:assert/strict";

import { errorHandler } from "./error-handler.middleware";

function createResMock() {
  const res: any = {
    statusCode: 200,
    body: undefined,
    status(code: number) {
      this.statusCode = code;
      return this;
    },
    json(payload: unknown) {
      this.body = payload;
      return this;
    },
  };

  return res;
}

test("errorHandler: returns 502 for kind='upstream'", () => {
  const req: any = {};
  const res = createResMock();
  const next = () => {};

  errorHandler(
    {
      kind: "upstream",
      message: "Profiles service unavailable",
      details: { service: "profiles" },
    },
    req,
    res,
    next
  );

  assert.equal(res.statusCode, 502);
  assert.deepEqual(res.body, {
    status: "error",
    error: {
      code: "BAD_GATEWAY",
      message: "Profiles service unavailable",
    },
    details: { service: "profiles" },
  });
});

test("errorHandler: returns 502 for code='BAD_GATEWAY'", () => {
  const req: any = {};
  const res = createResMock();
  const next = () => {};

  errorHandler(
    {
      code: "BAD_GATEWAY",
      message: "Gateway timeout calling users service",
    },
    req,
    res,
    next
  );

  assert.equal(res.statusCode, 502);
  assert.deepEqual(res.body, {
    status: "error",
    error: {
      code: "BAD_GATEWAY",
      message: "Gateway timeout calling users service",
    },
  });
});
