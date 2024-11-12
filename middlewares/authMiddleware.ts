import { Context } from "https://deno.land/x/oak/mod.ts";

export async function authMiddleware(ctx: Context, next: () => Promise<void>) {
  const authHeader = ctx.request.headers.get("Authorization");

  if (!authHeader) {
    ctx.response.status = 401;
    ctx.response.body = { message: "Unauthorized" };
    return;
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    ctx.response.status = 401;
    ctx.response.body = { message: "Unauthorized" };
    return;
  }

  try {
    // Verify the token (this is a placeholder, replace with actual verification logic)
    const isValid = await verifyToken(token);

    if (!isValid) {
      ctx.response.status = 401;
      ctx.response.body = { message: "Unauthorized" };
      return;
    }

    await next();
  } catch (error) {
    ctx.response.status = 500;
    ctx.response.body = { message: "Internal Server Error" };
  }
}

async function verifyToken(token: string): Promise<boolean> {
  // Placeholder function, replace with actual token verification logic
  return token === "valid-token";
}
