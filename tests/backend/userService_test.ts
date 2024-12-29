import { assertEquals, assertNotEquals } from "https://deno.land/std@0.205.0/testing/asserts.ts";
import { getUserById, createUser, updateUser, deleteUser } from "../../backend/services/userService.ts";
import { User } from "../../backend/models/userModel.ts";

Deno.test("createUser should add a new user", () => {
  const user: User = { id: "1", name: "John Doe", email: "john@example.com", password: "password" };
  const createdUser = createUser(user);
  assertEquals(createdUser, user);
});

Deno.test("getUserById should return the correct user", () => {
  const user: User = { id: "2", name: "Jane Doe", email: "jane@example.com", password: "password" };
  createUser(user);
  const fetchedUser = getUserById("2");
  assertEquals(fetchedUser, user);
});

Deno.test("updateUser should update the user details", () => {
  const user: User = { id: "3", name: "Alice", email: "alice@example.com", password: "password" };
  createUser(user);
  const updatedUser: User = { id: "3", name: "Alice Updated", email: "alice.updated@example.com", password: "newpassword" };
  const result = updateUser("3", updatedUser);
  assertEquals(result, updatedUser);
});

Deno.test("deleteUser should remove the user", () => {
  const user: User = { id: "4", name: "Bob", email: "bob@example.com", password: "password" };
  createUser(user);
  const deletedUser = deleteUser("4");
  assertEquals(deletedUser, user);
  const fetchedUser = getUserById("4");
  assertEquals(fetchedUser, null);
});

// Add tests for new functions in backend/services/userService.ts
Deno.test("getUserById should return null if user not found", () => {
  const fetchedUser = getUserById("nonexistent");
  assertEquals(fetchedUser, null);
});

Deno.test("updateUser should return null if user not found", () => {
  const updatedUser: User = { id: "nonexistent", name: "Nonexistent User", email: "nonexistent@example.com", password: "password" };
  const result = updateUser("nonexistent", updatedUser);
  assertEquals(result, null);
});

Deno.test("deleteUser should return null if user not found", () => {
  const deletedUser = deleteUser("nonexistent");
  assertEquals(deletedUser, null);
});
