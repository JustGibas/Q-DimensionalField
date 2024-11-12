import { Context } from "https://deno.land/x/oak/mod.ts";

export async function errorMiddleware(ctx: Context, next: () => Promise<void>) {
  try {
    await next();
  } catch (err) {
    console.error("Error occurred:", err);
    ctx.response.status = err.status || 500;
    ctx.response.body = { message: err.message || "Internal Server Error" };
  }
}
