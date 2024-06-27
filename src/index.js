import express from "express";
import cors from "cors";
import config from "../config.js";
import productController from "./product/product.controller.js";
import consultController from "./consult/consult.controller.js";
import { storeController } from "./store/store.controller.js";
import { userController } from "./user/user.controller.js";
import { chatroomController } from "./chatroom/chatroom.controller.js";
import { cartController } from "./cart/cart.controller.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/products", productController);
app.use("/consult", consultController);
app.use("/stores", storeController);
app.use("/users", userController);
app.use("/chatrooms", chatroomController);
app.use("/cart", cartController);

app.listen(config.port, () => console.log(`Server is live @ ${config.hostUrl}`));
