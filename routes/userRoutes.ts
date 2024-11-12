import { Router } from "https://deno.land/x/oak/mod.ts";
import { getUser, addUser, updateUser, deleteUser } from "../controllers/userController.ts";

const router = new Router();

router
  .get("/users/:id", getUser)
  .post("/users", addUser)
  .put("/users/:id", updateUser)
  .delete("/users/:id", deleteUser);

export { router as userRouter };
