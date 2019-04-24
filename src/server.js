const express = require("express");
const app = express();
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
const path = require("path");
const fs = require("fs");
const http = require("http").Server(app);
const io = require("socket.io")(http);
const init = require("./scripts/sockets");
const crawler = require("./scripts/crawler");
const twitter = require("./scripts/twitter");
const schedule = require("node-schedule");
const db = require("./scripts/firebase");
const rule = new schedule.RecurrenceRule();
const slugify = require("slugify");
const human = require("humanparser");
const keyword_extractor = require("keyword-extractor");
rule.minute = 37;

schedule.scheduleJob(rule, function() {
  crawler.gatherNewsTitles();
});

app
  .set("views", "src/views/")
  .engine(
    ".hbs",
    exphbs({
      defaultLayout: "main",
      extname: ".hbs",
      layoutsDir: "src/views/layouts",
      partialsDir: "src/views/partials"
    })
  )
  .set("view engine", ".hbs")
  .use(express.static(path.join(__dirname, "../dist")))
  .use(
    bodyParser.urlencoded({
      extended: true
    })
  )
  .use(bodyParser.json())
  .get("/:id", renderDetail)
  .get("/", renderOverview);

async function renderOverview(req, res, next) {
  // let titles = [];
  // let twitterTrends = [];
  // twitterTrends.push(trends.getTrends())
  // twitterTrends.then(res => console.log(res))
  const data = await db
    .collection("news")
    .get()
    .then(querySnapshot => {
      let articles = [];
      querySnapshot.forEach(function(doc) {
        console.log(doc);
        articles.push(doc.data());
      });
      return articles;
    })
    .then(data => {
      res.render("overview", { data: data });
    })
    .catch(err => console.error(err));
}

async function renderDetail(req, res, next) {
  const id = req.params.id;
  const data = await db
    .get()
    .then(querySnapshot => {
      let articles = [];
      querySnapshot.forEach(function(doc) {
        articles.push(doc.data());
      });
      return articles;
    })
    .then(async data => {
      const article = await data.filter(
        article => slugify(article.title) === id
      );
      res.render("detail", { data: article[0] });

      const parsedName = human.parseName(article[0].title);
      const extraction_result = keyword_extractor.extract(article[0].title, {
        language: "english",
        remove_digits: true,
        return_changed_case: true,
        remove_duplicates: false
      });

      const name = parsedName.fullName.replace(" ", "");
      io.on("connection", socket => {
        twitter.getStream(`#${name}`, socket);
        twitter.getTweets(`#${name}`, socket);
      });
    })
    .catch(err => console.error);
}

http.listen(process.env.PORT || 3000);
