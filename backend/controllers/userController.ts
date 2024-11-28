/**
 * This file contains the UserController class, which handles the HTTP requests related to users.
 * It interacts with the UserService to perform CRUD operations on users.
 * 
 * Configuration options:
 * - params: The parameters object containing the user ID.
 * - response: The response object to send the result.
 * - request: The request object containing the user data.
 */

import { Request, Response } from "oak/mod.ts";
import { getUserById, createUser, updateUser, deleteUser } from "../services/userService.ts";

// The UserController class handles the HTTP requests related to users
export class UserController {
  /**
   * Get a user by ID
   * @param params - The parameters object containing the user ID
   * @param response - The response object to send the result
   */
  async getUser({ params, response }: { params: { id: string }; response: Response }) {
    try {
      const user = await getUserById(params.id);
      if (user) {
        response.status = 200;
        response.body = user;
      } else {
        response.status = 404;
        response.body = { message: "User not found" };
      }
    } catch (error) {
      // Handle error
      response.status = 500;
      response.body = { message: "Failed to fetch user", error: error.message };
    }
  }

  /**
   * Add a new user
   * @param request - The request object containing the user data
   * @param response - The response object to send the result
   */
  async addUser({ request, response }: { request: Request; response: Response }) {
    try {
      const body = await request.body();
      const user = await createUser(body.value);
      response.status = 201;
      response.body = user;
    } catch (error) {
      // Handle error
      response.status = 500;
      response.body = { message: "Failed to add user", error: error.message };
    }
  }

  /**
   * Update an existing user
   * @param params - The parameters object containing the user ID
   * @param request - The request object containing the updated user data
   * @param response - The response object to send the result
   */
  async updateUser({ params, request, response }: { params: { id: string }; request: Request; response: Response }) {
    try {
      const body = await request.body();
      const updatedUser = await updateUser(params.id, body.value);
      if (updatedUser) {
        response.status = 200;
        response.body = updatedUser;
      } else {
        response.status = 404;
        response.body = { message: "User not found" };
      }
    } catch (error) {
      // Handle error
      response.status = 500;
      response.body = { message: "Failed to update user", error: error.message };
    }
  }

  /**
   * Delete a user by ID
   * @param params - The parameters object containing the user ID
   * @param response - The response object to send the result
   */
  async deleteUser({ params, response }: { params: { id: string }; response: Response }) {
    try {
      const deletedUser = await deleteUser(params.id);
      if (deletedUser) {
        response.status = 200;
        response.body = { message: "User deleted" };
      } else {
        response.status = 404;
        response.body = { message: "User not found" };
      }
    } catch (error) {
      // Handle error
      response.status = 500;
      response.body = { message: "Failed to delete user", error: error.message };
    }
  }
}
