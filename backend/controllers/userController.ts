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
import { BaseController } from "./baseController.ts";

// The UserController class handles the HTTP requests related to users
export class UserController extends BaseController {
  /**
   * Get a user by ID
   * @param params - The parameters object containing the user ID
   * @param response - The response object to send the result
   */
  async getUser({ params, response }: { params: { id: string }; response: Response }) {
    try {
      const user = await getUserById(params.id);
      if (user) {
        this.sendJsonResponse(response, 200, user);
      } else {
        this.sendJsonResponse(response, 404, { message: "User not found" });
      }
    } catch (error) {
      this.handleError(response, error);
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
      this.sendJsonResponse(response, 201, user);
    } catch (error) {
      this.handleError(response, error);
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
        this.sendJsonResponse(response, 200, updatedUser);
      } else {
        this.sendJsonResponse(response, 404, { message: "User not found" });
      }
    } catch (error) {
      this.handleError(response, error);
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
        this.sendJsonResponse(response, 200, { message: "User deleted" });
      } else {
        this.sendJsonResponse(response, 404, { message: "User not found" });
      }
    } catch (error) {
      this.handleError(response, error);
    }
  }
}
