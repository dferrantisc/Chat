const { Socket } = require("engine.io");
const express = require("express");
const app = express();

const server = require("http").createServer(app);
const io = require("socket.io")(server);
app.use(express.static("public"));
serve.listen(3000);

io.on("connection", (socket) => {
    socket.on("msg", (msg) => {
        io.emit("msg", msg);
    });
    socket.on("newUser", (user) => {
        io.emit("newUser", user);
    });
});