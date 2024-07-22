import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import favicon from "serve-favicon";
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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicDirectory = path.join(__dirname, "public");

// Favicon middleware should be used before static middleware
app.use(express.static(publicDirectory));

app.use(favicon(path.join(publicDirectory, "favicon.ico")));

app.get("/", (req, res) => {
  res.sendFile(path.join(publicDirectory, "index.html"));
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
