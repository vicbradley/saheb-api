import express from "express";
import cors from "cors";
import productController from "./src/product/product.controller.js";
import consultController from "./src/consult/consult.controller.js";
import { storeController } from "./src/store/store.controller.js";
import { userController } from "./src/user/user.controller.js";
import { chatroomController } from "./src/chatroom/chatroom.controller.js";
import { cartController } from "./src/cart/cart.controller.js";
import { transactionController } from "./src/transaction/transaction.controller.js";

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
app.use("/transactions", transactionController);

app.listen(5000, () => console.log(`Server is live @localhost: 5000`));

export default app;
