import { checkUserAuthByToken, findUserById, updateUserById, updateUserShippingData } from "./user.repository.js";

export const checkUserAuth = async (userData) => {
  const isUserAuth = await checkUserAuthByToken(userData);

  return isUserAuth;
};

export const getUserById = async (userId) => {
  const user = await findUserById(userId);
  if (!user) throw Error("User not found!");

  return user;
};

export const editUserById = async (userId, userOldData, userNewData) => {
  await getUserById(userId);

  const updatedUser = await updateUserById(userId, userOldData, userNewData);
  return updatedUser;
};

export const editUserShippingData = async (userId, shippingData) => {
  const updatedData = await updateUserShippingData(userId, shippingData);
  
  return updatedData;
}