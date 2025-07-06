// import cors from "cors";
// import dotenv from "dotenv";
// import express from "express";
// import http from "http";
// import { Server } from "socket.io";
// import { connectDB } from "./config/db.js";
// import messageRouter from "./routes/messageRoutes.js";
// import userRouter from "./routes/userRoutes.js";

// // Create express app and HTTP server
// dotenv.config();
// const app = express();
// const server = http.createServer(app); // Using Http server because socket.io support it

// // Initialize socket.io server
// export const io = new Server(server, {
//   cors: { origin: "*" },
// });

// // Store online users
// export const userSocketMap = {}; //{userId : socketId}

// // socket io connection handler
// io.on("connection", (socket) => {
//   const userId = socket.handshake.query.userId;
//   console.log("User Connected", userId);

//   if (userId) {
//     userSocketMap[userId] = socket.id;
//   }

//   io.emit("getOnlineUsers", Object.keys(userSocketMap));

//   socket.on("disconnect", () => {
//     console.log("User Disconnected", userId);
//     delete userSocketMap[userId];
//     io.emit("getOnlineUser", Object.keys(userSocketMap));
//   });
// });

// // Middleware
// app.use(express.json({ limit: "4mb" }));
// app.use(cors());

// app.use("/api/status", (req, res) => res.send("Server is live"));
// app.use("/api/auth", userRouter); //Auth routes
// app.use("api/messages", messageRouter); //Message routed

// await connectDB();

// const PORT = process.env.PORT || 5000;

// server.listen(PORT, () => console.log("Server is running on PORT:" + PORT));

import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import http from "http";
import { Server } from "socket.io";
import { connectDB } from "./config/db.js";
import messageRouter from "./routes/messageRoutes.js";
import userRouter from "./routes/userRoutes.js";

// Create express app and HTTP server
dotenv.config();
const app = express();
const server = http.createServer(app); // Using Http server because socket.io support it

// Initialize socket.io server
export const io = new Server(server, {
  cors: { origin: "*" },
});

// Store online users
export const userSocketMap = {}; //{userId : socketId}

// socket io connection handler
io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  console.log("User Connected", userId);

  if (userId && userId !== "undefined") {
    userSocketMap[userId] = socket.id;
  }

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("User Disconnected", userId);
    if (userId && userId !== "undefined") {
      delete userSocketMap[userId];
    }
    // Fixed typo: was "getOnlineUser", should be "getOnlineUsers"
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

// Middleware
app.use(express.json({ limit: "4mb" }));
app.use(cors());

app.use("/api/status", (req, res) => res.send("Server is live"));
app.use("/api/auth", userRouter); //Auth routes
// Fixed: Added missing leading slash
app.use("/api/messages", messageRouter); //Message routes

await connectDB();

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log("Server is running on PORT:" + PORT));
