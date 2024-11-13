/**
 * This file contains the error handling middleware for the application.
 * It handles errors that occur during request processing and responds with appropriate status and message.
 * 
 * Configuration options:
 * - ctx: The context object containing request and response.
 * - next: The next middleware function to call.
 * - err: The error object that occurred during request processing.
 */

import { Context } from "@oakserver/oak";

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
