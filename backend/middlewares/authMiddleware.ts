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

import { Context } from "oak/mod.ts";
import { verify } from "https://deno.land/x/djwt@v2.4/mod.ts";

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
    // Verify the token using djwt library
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

// Function to verify the token using djwt library
async function verifyToken(token: string): Promise<boolean> {
  try {
    const key = Deno.env.get("JWT_SECRET") || "your-secret-key";
    const payload = await verify(token, key, "HS256");
    return !!payload;
  } catch (error) {
    console.error("Token verification failed:", error);
    return false;
  }
}
