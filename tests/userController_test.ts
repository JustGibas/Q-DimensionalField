import {
  getUser,
  addUser,
  updateUser,
  deleteUser,
} from "../controllers/userController.ts";
import { assertEquals, assertNotEquals } from "https://deno.land/std/testing/asserts.ts";
import { User } from "../models/userModel.ts";

/**
 * Test case for getUser function
 * This test checks if the getUser function returns a user if it exists
 */
Deno.test("getUser - should return user if exists", async () => {
  const response = { status: 0, body: {} };
  const params = { id: "1" };
  await getUser({ params, response });
  assertEquals(response.status, 200);
  assertNotEquals(response.body, {});
});

/**
 * Test case for addUser function
 * This test checks if the addUser function adds a new user
 */
Deno.test("addUser - should add a new user", async () => {
  const request = { body: async () => ({ value: { id: "2", name: "John", email: "john@example.com", password: "password" } }) };
  const response = { status: 0, body: {} };
  await addUser({ request, response });
  assertEquals(response.status, 201);
  assertNotEquals(response.body, {});
});

/**
 * Test case for updateUser function
 * This test checks if the updateUser function updates an existing user
 */
Deno.test("updateUser - should update existing user", async () => {
  const params = { id: "2" };
  const request = { body: async () => ({ value: { id: "2", name: "John Updated", email: "john.updated@example.com", password: "newpassword" } }) };
  const response = { status: 0, body: {} };
  await updateUser({ params, request, response });
  assertEquals(response.status, 200);
  assertNotEquals(response.body, {});
});

/**
 * Test case for deleteUser function
 * This test checks if the deleteUser function deletes an existing user
 */
Deno.test("deleteUser - should delete existing user", async () => {
  const params = { id: "2" };
  const response = { status: 0, body: {} };
  await deleteUser({ params, response });
  assertEquals(response.status, 200);
  assertEquals(response.body, { message: "User deleted" });
});
