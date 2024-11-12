import { Request, Response } from "https://deno.land/x/oak/mod.ts";
import { getUserById, createUser, updateUser, deleteUser } from "../services/userService.ts";

/**
 * Get a user by ID
 * @param params - The parameters object containing the user ID
 * @param response - The response object to send the result
 */
export const getUser = async ({ params, response }: { params: { id: string }; response: Response }) => {
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
    response.body = { message: "Failed to fetch user" };
  }
};

/**
 * Add a new user
 * @param request - The request object containing the user data
 * @param response - The response object to send the result
 */
export const addUser = async ({ request, response }: { request: Request; response: Response }) => {
  try {
    const body = await request.body();
    const user = await createUser(body.value);
    response.status = 201;
    response.body = user;
  } catch (error) {
    // Handle error
    response.status = 500;
    response.body = { message: "Failed to add user" };
  }
};

/**
 * Update an existing user
 * @param params - The parameters object containing the user ID
 * @param request - The request object containing the updated user data
 * @param response - The response object to send the result
 */
export const updateUser = async ({ params, request, response }: { params: { id: string }; request: Request; response: Response }) => {
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
    response.body = { message: "Failed to update user" };
  }
};

/**
 * Delete a user by ID
 * @param params - The parameters object containing the user ID
 * @param response - The response object to send the result
 */
export const deleteUser = async ({ params, response }: { params: { id: string }; response: Response }) => {
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
    response.body = { message: "Failed to delete user" };
  }
};
