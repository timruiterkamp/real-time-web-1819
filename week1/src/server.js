const express = require("express");
const app = express();
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
const path = require("path");
const fs = require("fs");
const http = require("http").Server(app);
const io = require("socket.io")(http);
const init = require("./scripts/sockets");
app
  .engine("handlebars", exphbs({ defaultLayout: "main" }))
  .set("view engine", "handlebars")
  .set("views", path.join(__dirname, "/views"))
  .use(express.static(path.join(__dirname, "../dist")))
  .use(
    bodyParser.urlencoded({
      extended: true
    })
  )
  .use(bodyParser.json())
  .get("/", function(req, res) {
    res.render("overview");
  });

const players = {};
const balls = {};
io.on("connection", sockets => init.initSockets(io, players, sockets));

setInterval(function() {
  io.sockets.emit("state", players);
  io.sockets.emit("collision", players);
  // io.sockets.emit("ballFired", balls);
}, 1000 / 60);

http.listen(process.env.PORT || 3000);
