import { findAllConsultant, findToken } from "./consult.repository.js"

export const getAllConsultant = async () => {
  const consultants = await findAllConsultant();

  return consultants;
}

export const getToken = async (tokenValue) => {
  const token = await findToken(tokenValue);
  if (!token) throw Error("Token yang anda masukkan salah");

  return token;
}