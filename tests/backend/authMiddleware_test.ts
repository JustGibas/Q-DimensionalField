import { assertEquals } from "https://deno.land/std@0.205.0/testing/asserts.ts";
import { authMiddleware } from "../../backend/middlewares/authMiddleware.ts";
import { Context } from "oak/mod.ts";

Deno.test("authMiddleware: Missing Authorization Header", async () => {
  const ctx = {
    request: {
      headers: new Headers(),
    },
    response: {
      status: null,
      body: null,
    },
  } as unknown as Context;

  await authMiddleware(ctx, async () => {});
  assertEquals(ctx.response.status, 401);
  assertEquals(ctx.response.body, { message: "Unauthorized" });
});

Deno.test("authMiddleware: Missing Token", async () => {
  const ctx = {
    request: {
      headers: new Headers({
        "Authorization": "Bearer ",
      }),
    },
    response: {
      status: null,
      body: null,
    },
  } as unknown as Context;

  await authMiddleware(ctx, async () => {});
  assertEquals(ctx.response.status, 401);
  assertEquals(ctx.response.body, { message: "Unauthorized" });
});

Deno.test("authMiddleware: Invalid Token", async () => {
  const ctx = {
    request: {
      headers: new Headers({
        "Authorization": "Bearer invalid-token",
      }),
    },
    response: {
      status: null,
      body: null,
    },
  } as unknown as Context;

  await authMiddleware(ctx, async () => {});
  assertEquals(ctx.response.status, 401);
  assertEquals(ctx.response.body, { message: "Unauthorized" });
});

Deno.test("authMiddleware: Valid Token", async () => {
  const ctx = {
    request: {
      headers: new Headers({
        "Authorization": "Bearer valid-token",
      }),
    },
    response: {
      status: null,
      body: null,
    },
  } as unknown as Context;

  await authMiddleware(ctx, async () => {
    ctx.response.status = 200;
    ctx.response.body = { message: "Authorized" };
  });
  assertEquals(ctx.response.status, 200);
  assertEquals(ctx.response.body, { message: "Authorized" });
});
