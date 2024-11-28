/**
 * This file sets up the Oak application, configures routes for user-related operations,
 * and starts the server to listen for incoming HTTP requests.
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
import { createUser, getUserById, updateUser, deleteUser } from "../services/userService.ts";
import { BaseController } from "./baseController.ts";

// Create a new Oak application instance
const app = new Application();

// Create a new router instance
const router = new Router();

// Define the routes and their corresponding handler functions
router
  // Route to register a new user
  // This route handles POST requests to /register and calls the createUser function
  .post("/register", async (ctx) => {
    try {
      const { value } = await ctx.request.body();
      const user = await createUser(value);
      BaseController.sendJsonResponse(ctx, 201, user);
    } catch (error) {
      BaseController.handleError(ctx, error);
    }
  })
  // Route to get a user by ID
  // This route handles GET requests to /user/:id and calls the getUserById function
  .get("/user/:id", async (ctx) => {
    try {
      const user = await getUserById(ctx.params.id);
      if (user) {
        BaseController.sendJsonResponse(ctx, 200, user);
      } else {
        BaseController.sendJsonResponse(ctx, 404, { message: "User not found" });
      }
    } catch (error) {
      BaseController.handleError(ctx, error);
    }
  })
  // Route to update an existing user
  // This route handles PUT requests to /user/:id and calls the updateUser function
  .put("/user/:id", async (ctx) => {
    try {
      const { value } = await ctx.request.body();
      const updatedUser = await updateUser(ctx.params.id, value);
      if (updatedUser) {
        BaseController.sendJsonResponse(ctx, 200, updatedUser);
      } else {
        BaseController.sendJsonResponse(ctx, 404, { message: "User not found" });
      }
    } catch (error) {
      BaseController.handleError(ctx, error);
    }
  })
  // Route to delete a user by ID
  // This route handles DELETE requests to /user/:id and calls the deleteUser function
  .delete("/user/:id", async (ctx) => {
    try {
      const deletedUser = await deleteUser(ctx.params.id);
      if (deletedUser) {
        BaseController.sendJsonResponse(ctx, 200, { message: "User deleted" });
      } else {
        BaseController.sendJsonResponse(ctx, 404, { message: "User not found" });
      }
    } catch (error) {
      BaseController.handleError(ctx, error);
    }
  });

// Use the router middleware
app.use(router.routes());
app.use(router.allowedMethods());

// Start the server and listen on the specified port
const PORT = parseInt(Deno.env.get("PORT") || "8000");
console.log(`Server is running on port ${PORT}`);
await app.listen({ port: PORT });
