/**
 * This file contains the routes related to users.
 * It defines the endpoints for CRUD operations on users and maps them to the corresponding controller functions.
 * 
 * Configuration options:
 * - Router: The Oak router instance.
 * - getUser: The controller function for handling GET requests to fetch a user by ID.
 * - addUser: The controller function for handling POST requests to add a new user.
 * - updateUser: The controller function for handling PUT requests to update an existing user.
 * - deleteUser: The controller function for handling DELETE requests to delete a user by ID.
 */

import { Router } from "https://deno.land/x/oak/mod.ts";
import { getUser, addUser, updateUser, deleteUser } from "../controllers/userController.ts";

// Create a new router instance
const router = new Router();

// Define the routes and their corresponding controller functions
router
  // Route to get a user by ID
  // This route handles GET requests to /users/:id and calls the getUser function of the userController
  .get("/users/:id", getUser)
  // Route to add a new user
  // This route handles POST requests to /users and calls the addUser function of the userController
  .post("/users", addUser)
  // Route to update an existing user
  // This route handles PUT requests to /users/:id and calls the updateUser function of the userController
  .put("/users/:id", updateUser)
  // Route to delete a user by ID
  // This route handles DELETE requests to /users/:id and calls the deleteUser function of the userController
  .delete("/users/:id", deleteUser);

export { router as userRouter };
