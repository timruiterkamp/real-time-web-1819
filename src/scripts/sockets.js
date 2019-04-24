const handler = require("./handlers");

module.exports = {
  initSockets(io, socket) {
    socket.on("searchTweets", data => {
      console.log(data);
    });
  }
};
