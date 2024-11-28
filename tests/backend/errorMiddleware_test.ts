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
