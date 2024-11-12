import { Router } from "https://deno.land/x/oak/mod.ts";
import { getUser, addUser, updateUser, deleteUser } from "../controllers/userController.ts";

// Create a new router instance
const router = new Router();

// Define the routes and their corresponding controller functions
router
  // Route to get a user by ID
  .get("/users/:id", getUser)
  // Route to add a new user
  .post("/users", addUser)
  // Route to update an existing user
  .put("/users/:id", updateUser)
  // Route to delete a user by ID
  .delete("/users/:id", deleteUser);

export { router as userRouter };
