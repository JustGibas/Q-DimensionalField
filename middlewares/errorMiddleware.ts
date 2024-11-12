import { Context } from "https://deno.land/x/oak/mod.ts";

// This middleware function handles errors that occur during request processing
export async function errorMiddleware(ctx: Context, next: () => Promise<void>) {
  try {
    // Proceed to the next middleware or route handler
    await next();
  } catch (err) {
    // If an error occurs, log the error and respond with the appropriate status and message
    console.error("Error occurred:", err);
    ctx.response.status = err.status || 500;
    ctx.response.body = { message: err.message || "Internal Server Error" };
  }
}
