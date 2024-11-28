import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import { createUser, getUserById, updateUser, deleteUser } from "./userService.ts";
import { validate, sanitize } from "https://deno.land/x/validator/mod.ts";

const app = new Application();
const router = new Router();

router
  .post("/register", async (ctx) => {
    const { value } = await ctx.request.body();
    const sanitizedValue = sanitize(value);
    const user = await createUser(sanitizedValue);
    ctx.response.body = user;
  })
  .get("/user/:id", async (ctx) => {
    const userId = ctx.params.id;
    if (!validate(userId, { isUUID: true })) {
      ctx.response.status = 400;
      ctx.response.body = { message: "Invalid user ID" };
      return;
    }
    const user = await getUserById(userId);
    if (user) {
      ctx.response.body = user;
    } else {
      ctx.response.status = 404;
      ctx.response.body = { message: "User not found" };
    }
  })
  .put("/user/:id", async (ctx) => {
    const userId = ctx.params.id;
    if (!validate(userId, { isUUID: true })) {
      ctx.response.status = 400;
      ctx.response.body = { message: "Invalid user ID" };
      return;
    }
    const { value } = await ctx.request.body();
    const sanitizedValue = sanitize(value);
    const updatedUser = await updateUser(userId, sanitizedValue);
    if (updatedUser) {
      ctx.response.body = updatedUser;
    } else {
      ctx.response.status = 404;
      ctx.response.body = { message: "User not found" };
    }
  })
  .delete("/user/:id", async (ctx) => {
    const userId = ctx.params.id;
    if (!validate(userId, { isUUID: true })) {
      ctx.response.status = 400;
      ctx.response.body = { message: "Invalid user ID" };
      return;
    }
    const deletedUser = await deleteUser(userId);
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
