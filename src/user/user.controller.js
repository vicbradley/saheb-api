// controller.js
import express from "express";
import jwt from "jsonwebtoken";
import { getUserById, editUserById, checkUserAuth, editUserShippingData } from "./user.services.js";
import { verifyToken } from "../middleware/auth.js";
import { checkUserValidity } from "../middleware/checkUserValidity.js";
import config from "../../config.js";

const userController = express.Router();

userController.post("/login", async (req, res) => {
  try {
    const isUserAuth = await checkUserAuth(req.body);

    if (!isUserAuth) {
      return res.status(400).send("Invalid Auth");
    }

    const accessToken = jwt.sign({ userId: req.body.userId }, config.jwtSecret);

    res.status(200).send(accessToken);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

userController.get("/:userId", verifyToken, async (req, res) => {
  try {
    if (req.params.userId !== req.userId) {
      return res.status(401).send({ message: "Invalid User!" });
    }

    const userId = req.params.userId;
    const user = await getUserById(userId);

    res.status(200).json(user);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

userController.put("/:userId", verifyToken, checkUserValidity, async (req, res) => {
  try {
    const userId = req.params.userId;
    const { userOldData, userNewData } = req.body;

    const updatedUser = await editUserById(userId, userOldData, userNewData);

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

userController.patch("/:userId", verifyToken, checkUserValidity, async (req, res) => {
  try {
    const userId = req.params.userId;

    const updatedData = await editUserShippingData(userId, req.body);

    res.status(200).json(updatedData);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

export { userController };
