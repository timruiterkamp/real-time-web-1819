const handler = require("./handlers");

module.exports = {
  initSockets(io, players, socket) {
    socket.on("new player", ({ name, id, color }) => {
      players[socket.id] = {
        playerName: name,
        playerId: id,
        playerColor: color,
        x: 300,
        y: 300
      };
      console.log(players);
      io.sockets.emit("new player");
    });

    socket.on("movement", (data, width, height) => {
      const player = players[socket.id] || {};
      if (data.left) {
        handler.checkIfMoveAllowed("left", player.x, width)
          ? (player.x -= 5)
          : (player.x -= 0);
      }
      if (data.up) {
        handler.checkIfMoveAllowed("up", player.y, height)
          ? (player.y -= 5)
          : (player.y -= 0);
      }
      if (data.right) {
        handler.checkIfMoveAllowed("right", player.x, width)
          ? (player.x += 5)
          : (player.x += 0);
      }
      if (data.down) {
        handler.checkIfMoveAllowed("down", player.y, height)
          ? (player.y += 5)
          : (player.y += 0);
      }
    });
    socket.on("disconnection", () => delete players[socket.id]);
  }
};
