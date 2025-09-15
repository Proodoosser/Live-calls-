const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

    socket.on("offer", (data) => socket.broadcast.emit("offer", data));
      socket.on("answer", (data) => socket.broadcast.emit("answer", data));
        socket.on("candidate", (data) => socket.broadcast.emit("candidate", data));
          socket.on("chat-message", (msg) => socket.broadcast.emit("chat-message", msg));
            socket.on("lesson-mode", (mode) => socket.broadcast.emit("lesson-mode", mode));
            });

            server.listen(3000, () => console.log("🚀 Server running on port 3000"));