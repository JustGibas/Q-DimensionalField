import { User } from "../models/userModel.ts";

let users: User[] = [];

/**
 * Get a user by ID
 * @param {string} id - The ID of the user
 * @returns {User | undefined} - The user object or undefined if not found
 */
export const getUserById = (id: string): User | undefined => {
  try {
    return users.find(user => user.id === id);
  } catch (error) {
    // Handle error
    console.error("Error fetching user by ID:", error);
    return undefined;
  }
};

/**
 * Create a new user
 * @param {User} user - The user object to create
 * @returns {User} - The created user object
 */
export const createUser = (user: User): User => {
  try {
    users.push(user);
    return user;
  } catch (error) {
    // Handle error
    console.error("Error creating user:", error);
    throw error;
  }
};

/**
 * Update an existing user
 * @param {string} id - The ID of the user to update
 * @param {User} updatedUser - The updated user data
 * @returns {User | undefined} - The updated user object or undefined if not found
 */
export const updateUser = (id: string, updatedUser: User): User | undefined => {
  try {
    const index = users.findIndex(user => user.id === id);
    if (index !== -1) {
      users[index] = updatedUser;
      return updatedUser;
    }
    return undefined;
  } catch (error) {
    // Handle error
    console.error("Error updating user:", error);
    return undefined;
  }
};

/**
 * Delete a user by ID
 * @param {string} id - The ID of the user to delete
 * @returns {User | undefined} - The deleted user object or undefined if not found
 */
export const deleteUser = (id: string): User | undefined => {
  try {
    const index = users.findIndex(user => user.id === id);
    if (index !== -1) {
      const deletedUser = users.splice(index, 1)[0];
      return deletedUser;
    }
    return undefined;
  } catch (error) {
    // Handle error
    console.error("Error deleting user:", error);
    return undefined;
  }
};
