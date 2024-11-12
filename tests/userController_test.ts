/**
 * This file contains the test cases for the userController functions.
 * It tests the functionality of CRUD operations on users, including getting a user by ID, adding a new user, updating an existing user, and deleting a user.
 * 
 * Configuration options:
 * - getUser: The controller function for handling GET requests to fetch a user by ID.
 * - addUser: The controller function for handling POST requests to add a new user.
 * - updateUser: The controller function for handling PUT requests to update an existing user.
 * - deleteUser: The controller function for handling DELETE requests to delete a user by ID.
 * - assertEquals: Asserts that two values are equal.
 * - assertNotEquals: Asserts that two values are not equal.
 * - params: The parameters object containing the user ID.
 * - response: The response object to send the result.
 * - request: The request object containing the user data.
 */

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
 * 
 * Configuration options:
 * - params: The parameters object containing the user ID.
 * - response: The response object to send the result.
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
 * 
 * Configuration options:
 * - request: The request object containing the user data.
 * - response: The response object to send the result.
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
 * 
 * Configuration options:
 * - params: The parameters object containing the user ID.
 * - request: The request object containing the updated user data.
 * - response: The response object to send the result.
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
 * 
 * Configuration options:
 * - params: The parameters object containing the user ID.
 * - response: The response object to send the result.
 */
Deno.test("deleteUser - should delete existing user", async () => {
  const params = { id: "2" };
  const response = { status: 0, body: {} };
  await deleteUser({ params, response });
  assertEquals(response.status, 200);
  assertEquals(response.body, { message: "User deleted" });
});
