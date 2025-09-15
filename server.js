// server.js
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Папка для статических файлов (index.html, CSS, JS)
app.use(express.static(path.join(__dirname, "public")));

// Главная страница
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// WebRTC + чат события
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("offer", (data) => socket.broadcast.emit("offer", data));
  socket.on("answer", (data) => socket.broadcast.emit("answer", data));
  socket.on("candidate", (data) => socket.broadcast.emit("candidate", data));
  socket.on("chat-message", (msg) => socket.broadcast.emit("chat-message", msg));
  socket.on("lesson-mode", (mode) => socket.broadcast.emit("lesson-mode", mode));

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Используем порт, который выдаёт Render
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});