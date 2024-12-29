import { assertEquals } from "https://deno.land/std@0.205.0/testing/asserts.ts";
import { errorMiddleware } from "../../backend/middlewares/errorMiddleware.ts";
import { Context } from "oak/mod.ts";

Deno.test("errorMiddleware: No Error", async () => {
  const ctx = {
    response: {
      status: null,
      body: null,
    },
  } as unknown as Context;

  await errorMiddleware(ctx, async () => {
    ctx.response.status = 200;
    ctx.response.body = { message: "No Error" };
  });
  assertEquals(ctx.response.status, 200);
  assertEquals(ctx.response.body, { message: "No Error" });
});

Deno.test("errorMiddleware: Handle Error", async () => {
  const ctx = {
    response: {
      status: null,
      body: null,
    },
  } as unknown as Context;

  await errorMiddleware(ctx, async () => {
    throw new Error("Test Error");
  });
  assertEquals(ctx.response.status, 500);
  assertEquals(ctx.response.body, { message: "Test Error" });
});

// Add tests for new functions in backend/middlewares/errorMiddleware.ts
Deno.test("errorMiddleware: Handle Not Found Error", async () => {
  const ctx = {
    response: {
      status: null,
      body: null,
    },
  } as unknown as Context;

  await errorMiddleware(ctx, async () => {
    const error = new Error("Not Found");
    error.status = 404;
    throw error;
  });
  assertEquals(ctx.response.status, 404);
  assertEquals(ctx.response.body, { message: "Not Found" });
});

Deno.test("errorMiddleware: Handle Unauthorized Error", async () => {
  const ctx = {
    response: {
      status: null,
      body: null,
    },
  } as unknown as Context;

  await errorMiddleware(ctx, async () => {
    const error = new Error("Unauthorized");
    error.status = 401;
    throw error;
  });
  assertEquals(ctx.response.status, 401);
  assertEquals(ctx.response.body, { message: "Unauthorized" });
});
