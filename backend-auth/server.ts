/**
 * This file sets up the Oak application, configures middleware, and defines routes for user-related operations.
 * The application listens on a specified port and handles incoming HTTP requests.
 * 
 * Configuration options:
 * - Application: The Oak application instance.
 * - Router: The Oak router instance.
 * - createUser: Function to create a new user.
 * - getUserById: Function to get a user by ID.
 * - updateUser: Function to update an existing user.
 * - deleteUser: Function to delete a user by ID.
 * - PORT: The port number on which the server listens.
 */

import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import { createUser, getUserById, updateUser, deleteUser } from "./userService.ts";

// Create a new Oak application instance
const app = new Application();
// Create a new router instance
const router = new Router();

// Define the routes and their corresponding controller functions
router
  // Route to register a new user
  // This route handles POST requests to /register and calls the createUser function
  .post("/register", async (ctx) => {
    const { value } = await ctx.request.body().value;
    const user = await createUser(value);
    ctx.response.body = user;
  })
  // Route to get a user by ID
  // This route handles GET requests to /user/:id and calls the getUserById function
  .get("/user/:id", async (ctx) => {
    const user = await getUserById(ctx.params.id);
    if (user) {
      ctx.response.body = user;
    } else {
      ctx.response.status = 404;
      ctx.response.body = { message: "User not found" };
    }
  })
  // Route to update an existing user
  // This route handles PUT requests to /user/:id and calls the updateUser function
  .put("/user/:id", async (ctx) => {
    const { value } = await ctx.request.body().value;
    const updatedUser = await updateUser(ctx.params.id, value);
    if (updatedUser) {
      ctx.response.body = updatedUser;
    } else {
      ctx.response.status = 404;
      ctx.response.body = { message: "User not found" };
    }
  })
  // Route to delete a user by ID
  // This route handles DELETE requests to /user/:id and calls the deleteUser function
  .delete("/user/:id", async (ctx) => {
    const deletedUser = await deleteUser(ctx.params.id);
    if (deletedUser) {
      ctx.response.body = { message: "User deleted" };
    } else {
      ctx.response.status = 404;
      ctx.response.body = { message: "User not found" };
    }
  });

// Use the router middleware
app.use(router.routes());
app.use(router.allowedMethods());

// Start the server
const PORT = 8000;
console.log(`Server is running on port ${PORT}`);
await app.listen({ port: PORT });
