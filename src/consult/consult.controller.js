import express from "express";
import { getAllConsultant, getToken } from "./consult.services.js";
import { verifyToken } from "../middleware/auth.js";

const consultController = express.Router();

consultController.get("/consultants", async (req, res) => {
  try {
    const consultants = await getAllConsultant();
    res.status(200).send(consultants);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

consultController.get("/token/:tokenValue", verifyToken, async (req, res) => {
  try {
    const token = await getToken(req.params.tokenValue);

    res.status(200).send(token);
  } catch (error) {
    res.status(400).send(error.message);
  }
})

export default consultController;
