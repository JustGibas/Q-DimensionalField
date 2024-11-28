/**
 * This file contains the server setup for the authentication service.
 * It defines the routes for user registration, retrieval, update, and deletion.
 * The server uses Oak framework for handling HTTP requests.
 */

import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import { createUser, getUserById, updateUser, deleteUser } from "./userService.ts";

const app = new Application();
const router = new Router();

/**
 * Register a new user
 * @param ctx - The context object containing request and response
 */
router.post("/register", async (ctx) => {
  const { value } = await ctx.request.body();
  const user = await createUser(value);
  ctx.response.body = user;
});

/**
 * Get a user by ID
 * @param ctx - The context object containing request and response
 */
router.get("/user/:id", async (ctx) => {
  const user = await getUserById(ctx.params.id);
  if (user) {
    ctx.response.body = user;
  } else {
    ctx.response.status = 404;
    ctx.response.body = { message: "User not found" };
  }
});

/**
 * Update a user by ID
 * @param ctx - The context object containing request and response
 */
router.put("/user/:id", async (ctx) => {
  const { value } = await ctx.request.body();
  const updatedUser = await updateUser(ctx.params.id, value);
  if (updatedUser) {
    ctx.response.body = updatedUser;
  } else {
    ctx.response.status = 404;
    ctx.response.body = { message: "User not found" };
  }
});

/**
 * Delete a user by ID
 * @param ctx - The context object containing request and response
 */
router.delete("/user/:id", async (ctx) => {
  const deletedUser = await deleteUser(ctx.params.id);
  if (deletedUser) {
    ctx.response.body = { message: "User deleted" };
  } else {
    ctx.response.status = 404;
    ctx.response.body = { message: "User not found" };
  }
});

app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 8000 });
