/**
 * This file contains the userService functions, which handle the business logic related to users.
 * It interacts with the userModel to perform CRUD operations on users.
 * 
 * Configuration options:
 * - id: The unique identifier of the user.
 * - name: The name of the user.
 * - email: The email address of the user.
 * - password: The password of the user.
 */

import { User } from "../models/userModel.ts";
import { client } from "../utils/postgresClient.ts";

/**
 * Get a user by ID
 * @param id - The unique identifier of the user
 * @returns The user object if found, otherwise null
 */
export const getUserById = async (id: string): Promise<User | null> => {
  const result = await client.queryObject<User>(
    "SELECT * FROM users WHERE id = $1",
    id,
  );
  return result.rows.length ? result.rows[0] : null;
};

/**
 * Create a new user
 * @param user - The user object containing the user data
 * @returns The created user object
 */
export const createUser = async (user: User): Promise<User> => {
  await client.queryObject(
    "INSERT INTO users (id, name, email, password) VALUES ($1, $2, $3, $4)",
    user.id,
    user.name,
    user.email,
    user.password,
  );
  return user;
};

/**
 * Update an existing user
 * @param id - The unique identifier of the user
 * @param updatedUser - The updated user object containing the new data
 * @returns The updated user object if found, otherwise null
 */
export const updateUser = async (id: string, updatedUser: User): Promise<User | null> => {
  const result = await client.queryObject(
    "UPDATE users SET name = $1, email = $2, password = $3 WHERE id = $4 RETURNING *",
    updatedUser.name,
    updatedUser.email,
    updatedUser.password,
    id,
  );
  return result.rows.length ? result.rows[0] : null;
};

/**
 * Delete a user by ID
 * @param id - The unique identifier of the user
 * @returns The deleted user object if found, otherwise null
 */
export const deleteUser = async (id: string): Promise<User | null> => {
  const result = await client.queryObject<User>(
    "DELETE FROM users WHERE id = $1 RETURNING *",
    id,
  );
  return result.rows.length ? result.rows[0] : null;
};
