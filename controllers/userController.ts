import { Request, Response } from "https://deno.land/x/oak/mod.ts";
import { getUserById, createUser, updateUser, deleteUser } from "../services/userService.ts";

export const getUser = async ({ params, response }: { params: { id: string }; response: Response }) => {
  const user = await getUserById(params.id);
  if (user) {
    response.status = 200;
    response.body = user;
  } else {
    response.status = 404;
    response.body = { message: "User not found" };
  }
};

export const addUser = async ({ request, response }: { request: Request; response: Response }) => {
  const body = await request.body();
  const user = await createUser(body.value);
  response.status = 201;
  response.body = user;
};

export const updateUser = async ({ params, request, response }: { params: { id: string }; request: Request; response: Response }) => {
  const body = await request.body();
  const updatedUser = await updateUser(params.id, body.value);
  if (updatedUser) {
    response.status = 200;
    response.body = updatedUser;
  } else {
    response.status = 404;
    response.body = { message: "User not found" };
  }
};

export const deleteUser = async ({ params, response }: { params: { id: string }; response: Response }) => {
  const deletedUser = await deleteUser(params.id);
  if (deletedUser) {
    response.status = 200;
    response.body = { message: "User deleted" };
  } else {
    response.status = 404;
    response.body = { message: "User not found" };
  }
};
