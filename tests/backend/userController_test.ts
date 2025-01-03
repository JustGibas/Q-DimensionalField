import { assertEquals, assertNotEquals } from "https://deno.land/std@0.205.0/testing/asserts.ts";
import { UserController } from "../../backend/controllers/userController.ts";
import { User } from "../../backend/models/userModel.ts";
import { createUser, getUserById, updateUser as updateUserService, deleteUser as deleteUserService } from "../../backend/services/userService.ts";

Deno.test("getUser should return the correct user", async () => {
  const user: User = { id: "1", name: "John Doe", email: "john@example.com", password: "password" };
  createUser(user);
  const response = { status: 0, body: {} };
  const userController = new UserController();
  await userController.getUser({ params: { id: "1" }, response });
  assertEquals(response.status, 200);
  assertEquals(response.body, user);
});

Deno.test("addUser should add a new user", async () => {
  const user: User = { id: "2", name: "Jane Doe", email: "jane@example.com", password: "password" };
  const request = { body: () => ({ value: user }) };
  const response = { status: 0, body: {} };
  const userController = new UserController();
  await userController.addUser({ request, response });
  assertEquals(response.status, 201);
  assertEquals(response.body, user);
});

Deno.test("updateUser should update the user details", async () => {
  const user: User = { id: "3", name: "Alice", email: "alice@example.com", password: "password" };
  createUser(user);
  const updatedUser: User = { id: "3", name: "Alice Updated", email: "alice.updated@example.com", password: "newpassword" };
  const request = { body: () => ({ value: updatedUser }) };
  const response = { status: 0, body: {} };
  const userController = new UserController();
  await userController.updateUser({ params: { id: "3" }, request, response });
  assertEquals(response.status, 200);
  assertEquals(response.body, updatedUser);
});

Deno.test("deleteUser should remove the user", async () => {
  const user: User = { id: "4", name: "Bob", email: "bob@example.com", password: "password" };
  createUser(user);
  const response = { status: 0, body: {} };
  const userController = new UserController();
  await userController.deleteUser({ params: { id: "4" }, response });
  assertEquals(response.status, 200);
  assertEquals(response.body.message, "User deleted");
});

// Add tests for new functions in backend/controllers/userController.ts
Deno.test("getUser should return 404 if user not found", async () => {
  const response = { status: 0, body: {} };
  const userController = new UserController();
  await userController.getUser({ params: { id: "nonexistent" }, response });
  assertEquals(response.status, 404);
  assertEquals(response.body.message, "User not found");
});

Deno.test("updateUser should return 404 if user not found", async () => {
  const updatedUser: User = { id: "nonexistent", name: "Nonexistent User", email: "nonexistent@example.com", password: "password" };
  const request = { body: () => ({ value: updatedUser }) };
  const response = { status: 0, body: {} };
  const userController = new UserController();
  await userController.updateUser({ params: { id: "nonexistent" }, request, response });
  assertEquals(response.status, 404);
  assertEquals(response.body.message, "User not found");
});

Deno.test("deleteUser should return 404 if user not found", async () => {
  const response = { status: 0, body: {} };
  const userController = new UserController();
  await userController.deleteUser({ params: { id: "nonexistent" }, response });
  assertEquals(response.status, 404);
  assertEquals(response.body.message, "User not found");
});
