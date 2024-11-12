import { User } from "../models/userModel.ts";

let users: User[] = [];

export const getUserById = (id: string): User | undefined => {
  return users.find(user => user.id === id);
};

export const createUser = (user: User): User => {
  users.push(user);
  return user;
};

export const updateUser = (id: string, updatedUser: User): User | undefined => {
  const index = users.findIndex(user => user.id === id);
  if (index !== -1) {
    users[index] = updatedUser;
    return updatedUser;
  }
  return undefined;
};

export const deleteUser = (id: string): User | undefined => {
  const index = users.findIndex(user => user.id === id);
  if (index !== -1) {
    const deletedUser = users.splice(index, 1)[0];
    return deletedUser;
  }
  return undefined;
};
