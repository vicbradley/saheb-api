import { findUserById, updateUserById } from "./user.repository.js";

export const getUserById = async (userId) => {
  const user = await findUserById(userId);
  if (!user) throw Error("User not found");

  return user;
};

export const editUserById = async (userId, userNewData) => {
  const user = await getUserById(userId);
  if (!user) throw Error("User not found");

  const updatedUser = await updateUserById(userId, userNewData);
  return updatedUser;
}