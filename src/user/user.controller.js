// controller.js
import express from "express";
import { getUserById, editUserById } from "./user.services.js";

const userController = express.Router();

userController.get("/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await getUserById(userId);

    res.status(200).json(user);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

userController.patch("/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const userNewData = req.body;

    const updatedUser = await editUserById(userId, userNewData);

    res.status(200).json(updatedUser);

  } catch (error) {
    res.status(400).send(error.message);
  }
});

export { userController };
