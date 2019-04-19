const express = require("express");
const app = express();
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
const path = require("path");
const fs = require("fs");
const http = require("http").Server(app);
const io = require("socket.io")(http);
const init = require("./scripts/sockets");
var Twit = require('twit')
require('dotenv').config()

var T = new Twit({
    consumer_key: process.env.consumer_key,
    consumer_secret: process.env.consumer_secret,
    access_token: process.env.access_token,
    access_token_secret: process.env.access_token_secret
})

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


T.get('trends/place', {id: '1'}, gotData);

    function gotData(err, data, response) {
        var tweets = JSON.stringify(data);
        console.log(tweets);
    }
 
// stream.on('tweet', function (tweet) {
//   console.log(tweet)
// })

// const players = {};
// const balls = {};
// io.on("connection", sockets => init.initSockets(io, players, sockets));

// setInterval(function() {
//   io.sockets.emit("state", players);
//   io.sockets.emit("collision", players);
//   // io.sockets.emit("ballFired", balls);
// }, 1000 / 60);

http.listen(process.env.PORT || 3000);
