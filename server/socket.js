const SocketIO = require("socket.io");
const allowedOrigins = require("./config/allowedOrigins");

const CORS_URL = "http://localhost:3000";

module.exports = (server, app) => {
  const io = SocketIO(server, {
    cors: {
      origin: allowedOrigins,
      methods: ["GET", "POST"],
    },
  });
  app.set("io", io);

  io.on("connection", (socket) => {
    console.log(`User Connected: ${socket.id}`);

    socket.on("join_room", (data) => {
      socket.join(data);
    });

    socket.on("send_message", (data) => {
      // broadcast : 나를 제외한 모두에게 전송
      // socket.broadcast.emit("receive_message", data);
      socket.to(data.room).emit("receive_message", data);
    });
  });
};
