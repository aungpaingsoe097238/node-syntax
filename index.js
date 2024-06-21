const express = require("express");
const app = express();
const socket = require("socket.io");

const server = app.listen(4000, () => {
  console.log("Server running on port 4000");
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

const io = socket(server);

io.on("connection", (socket) => {
  socket.on("chat", (data) => {
    io.sockets.emit('chat',data)
  });
  socket.on("typing", (name) => {
    socket.broadcast.emit("typing", name);
  })
});
