import express from "express";
import cors from "cors";
import config from "../config.js";
import productController from "./product/product.controller.js";
import consultController from "./consult/consult.controller.js";
import { storeController } from "./store/store.controller.js";
import { Server as SocketIOServer } from "socket.io";
import http from "http";
import { userController } from "./user/user.controller.js";
import { chatroomController } from "./chatroom/chatroom.controller.js";
import { getProductsByStoreRealtime } from "./store/store.services.js";
import { getChatroomMessagesRealTime, getChatroomsDataRealTime } from "./chatroom/chatroom.services.js";

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server);

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Membuat koneksi websocket di luar dari rute
io.on("connection", (socket) => {
  console.log("Client connected");

  const { type } = socket.handshake.query;

  // Memilih listener berdasarkan jenis koneksi
  switch (type) {
    case "products dashboard":
      console.log("Client listen to products dashboard change");
      getProductsByStoreRealtime(socket, socket.handshake.query.storeId);
      break;
    case "chatroom messages":
      const {chatroomId, mainUserId} = socket.handshake.query
      console.log(`Client ${mainUserId} listen to chatroom message change`);
      getChatroomMessagesRealTime(socket, chatroomId, mainUserId);
      break;
    case "chatrooms data":
      console.log("Client listen to chatrooms data change");
      const {uid} = socket.handshake.query;
      getChatroomsDataRealTime(socket, uid);
    default:
      socket.emit("error", "Invalid connection type");
  }
});

// Endpoint untuk memberi respon bahwa koneksi real-time berhasil dibuat
app.get("/api/realtime", (req, res) => {
  res.send("Real-time connection established.");
});

app.use("/products", productController);
app.use("/consult", consultController);
app.use("/stores", storeController);
app.use("/users", userController);
app.use("/chatrooms", chatroomController);

server.listen(config.port, () => console.log(`Server is live @ ${config.hostUrl}`));
