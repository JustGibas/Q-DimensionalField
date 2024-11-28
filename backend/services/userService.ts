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

// In-memory storage for users (replace with a database in a real application)
const users: Map<string, User> = new Map();

/**
 * Get a user by ID
 * @param id - The unique identifier of the user
 * @returns The user object if found, otherwise null
 */
export const getUserById = (id: string): User | null => {
  return users.get(id) || null;
};

/**
 * Create a new user
 * @param user - The user object containing the user data
 * @returns The created user object
 */
export const createUser = (user: User): User => {
  users.set(user.id, user);
  return user;
};

/**
 * Update an existing user
 * @param id - The unique identifier of the user
 * @param updatedUser - The updated user object containing the new data
 * @returns The updated user object if found, otherwise null
 */
export const updateUser = (id: string, updatedUser: User): User | null => {
  if (users.has(id)) {
    users.set(id, updatedUser);
    return updatedUser;
  }
  return null;
};

/**
 * Delete a user by ID
 * @param id - The unique identifier of the user
 * @returns The deleted user object if found, otherwise null
 */
export const deleteUser = (id: string): User | null => {
  const user = users.get(id) || null;
  if (user) {
    users.delete(id);
  }
  return user;
};
