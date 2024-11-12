/**
 * This file contains the authentication middleware for the application.
 * It handles the authentication of incoming requests by verifying the provided token.
 * If the token is valid, the request is allowed to proceed; otherwise, it responds with an appropriate error message.
 * 
 * Configuration options:
 * - ctx: The context object containing request and response.
 * - next: The next middleware function to call.
 * - authHeader: The Authorization header containing the token.
 * - token: The token extracted from the Authorization header.
 * - isValid: A boolean indicating whether the token is valid.
 */

import { Context } from "https://deno.land/x/oak/mod.ts";

// This middleware function handles authentication for incoming requests
export async function authMiddleware(ctx: Context, next: () => Promise<void>) {
  const authHeader = ctx.request.headers.get("Authorization");

  // If the Authorization header is missing, respond with 401 Unauthorized
  if (!authHeader) {
    ctx.response.status = 401;
    ctx.response.body = { message: "Unauthorized" };
    return;
  }

  const token = authHeader.split(" ")[1];

  // If the token is missing, respond with 401 Unauthorized
  if (!token) {
    ctx.response.status = 401;
    ctx.response.body = { message: "Unauthorized" };
    return;
  }

  try {
    // Verify the token (this is a placeholder, replace with actual verification logic)
    const isValid = await verifyToken(token);

    // If the token is not valid, respond with 401 Unauthorized
    if (!isValid) {
      ctx.response.status = 401;
      ctx.response.body = { message: "Unauthorized" };
      return;
    }

    // If the token is valid, proceed to the next middleware or route handler
    await next();
  } catch (error) {
    // If an error occurs during token verification, respond with 500 Internal Server Error
    ctx.response.status = 500;
    ctx.response.body = { message: "Internal Server Error" };
  }
}

// Placeholder function to verify the token, replace with actual token verification logic
async function verifyToken(token: string): Promise<boolean> {
  // This is a placeholder implementation, replace with actual token verification logic
  return token === "valid-token";
}
