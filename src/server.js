const express = require("express");
const app = express();
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
const path = require("path");
const crawler = require('./scripts/crawler')
const trends = require('./scripts/twitter')
const schedule = require('node-schedule');
const db = require('./scripts/firebase')
const rule = new schedule.RecurrenceRule();
rule.minute = 15;
 
schedule.scheduleJob(rule, function(){
    crawler.gatherNewsTitles()
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
  .get('/:id', renderDetail)
  .get("/", renderOverview)
  .listen(process.env.PORT || 3000);


async function renderOverview(req, res, next) {
  // let titles = [];
  // let twitterTrends = [];
  // twitterTrends.push(trends.getTrends())
  // twitterTrends.then(res => console.log(res))
  const data = await db.collection("news").get().then(querySnapshot => {
    let articles = [];
    querySnapshot.forEach(function(doc) {
      articles.push(doc.data())
    });
    return articles
}).then(data => {
  res.render('overview', {data: data})
});
}

async function renderDetail(req, res, next){
  const id = req.params.id
  res.render('detail');
}