const express = require('express')
const app = express()
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const path = require('path')
const fs = require('fs')
const http = require('http').Server(app)
const io = require('socket.io')(http)
const init = require('./scripts/sockets')
const crawler = require('./scripts/crawler')
const twitter = require('./scripts/twitter')
const schedule = require('node-schedule')
const db = require('./scripts/firebase')
const rule = new schedule.RecurrenceRule()
const slugify = require('slugify')
const human = require('humanparser')
const keyword_extractor = require('keyword-extractor')
const natural = require('natural')
const tokenizer = new natural.SentenceTokenizer()
// rule.minute = 19;

// schedule.scheduleJob(rule, function() {
//   crawler.gatherNewsTitles();
// });

app
  .set('views', 'src/views/')
  .engine(
    '.hbs',
    exphbs({
      defaultLayout: 'main',
      extname: '.hbs',
      layoutsDir: 'src/views/layouts',
      partialsDir: 'src/views/partials'
    })
  )
  .set('view engine', '.hbs')
  .use(express.static(path.join(__dirname, '../dist')))
  .use(
    bodyParser.urlencoded({
      extended: true
    })
  )
  .use(bodyParser.json())
  .get('/:id', renderDetail)
  .get('/', renderOverview)

function renderOverview(req, res, next) {
  db.collection('news')
    .orderBy('added', 'asc')
    .limit(25)
    .get()
    .then(querySnapshot => {
      let articles = []
      querySnapshot.forEach(function(doc) {
        articles.push(doc.data())
      })
      return articles
    })
    .then(data => {
      fs.writeFile(
        'src/newsItems.json',
        JSON.stringify(data),
        'utf8',
        (err, data, res) =>
          err ? console.log(err) : console.log('document succesfully written')
      )

      res.render('overview', { data: data })
    })
    .catch(err => console.error(err))
}

async function renderDetail(req, res, next) {
  const id = req.params.id
  fs.readFile('src/newsItems.json', 'utf8', (err, data) => {
    if (err) console.error(err)
    const result = JSON.parse(data)
    const filtered = result.filter(article => slugify(article.title) === id)
    res.render('detail', { data: filtered[0] })
    const article = filtered[0]
    // console.log(article);

    if (article) {
      const parsedName = human.parseName(article.title)
      const extraction_result = keyword_extractor
        .extract(article.title, {
          language: 'english',
          remove_digits: true,
          return_changed_case: true,
          remove_duplicates: false
        })
        .join(' ', ' ')
        .toLowerCase()
        .split(' ')
        .map(s => s.charAt(0).toUpperCase() + s.substring(1))
        .join(' ')
        .replace(/\s/g, '')

      var source = parsedName.firstName + parsedName.lastName
      var target = article.title

      const foundSubject = natural.LevenshteinDistance(source, target, {
        search: true
      })
      console.log('substring:', foundSubject.substring)

      console.log('res:', extraction_result)
      const name = foundSubject.substring.replace(/\s/g, '')
      console.log('name:', name)
      io.on('connection', socket => {
        twitter.getStream(
          `#${extraction_result.length > 10 ? name : extraction_result}`,
          socket
        )
        twitter.getTweets(
          `#${extraction_result.length > 10 ? name : extraction_result}`,
          socket
        )
      })
    }
  })
  // const article = await data.filter(article => slugify(article.title) === id);
}

io.on('connection', socket => {
  socket.on('addHotItem', value => {
    db.collection('news')
      .where('title', '==', value)
      .get()
      .then(querySnapshot => {
        let id = ''
        querySnapshot.forEach(function(doc) {
          db.collection('news')
            .doc(doc.id)
            .update({ likes: 1 })

          db.collection('hot')
            .doc()
            .set({
              site: doc.data().site ? doc.data().site : '',
              title: doc.data().title ? doc.data().title : '',
              subtitle: doc.data().subtitle ? doc.data().subtitle : '',
              permalink: doc.data().title ? slugify(doc.data().title) : '',
              added: new Date(),
              likes: 1
            })
            .then(function() {
              console.log('Document successfully written!')
            })
            .catch(function(error) {
              console.error('Error writing document: ', error)
            })
        })
        return id
      })
  })

  socket.on('removeHotItem', value => {
    db.collection('hot')
      .where('title', '==', value)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(function(doc) {
          db.collection('hot')
            .doc(doc.id)
            .delete()
            .then(function() {
              console.log('Document successfully deleted!')
            })
            .catch(function(error) {
              console.error('Error removing document: ', error)
            })
        })
      })
  })

  db.collection('hot')
    .where('likes', '>', 0)
    .onSnapshot(function(querySnapshot) {
      var data = []
      querySnapshot.forEach(function(doc) {
        data.push(doc.data())
      })
      socket.emit('newHotItems', data)
    })
})

http.listen(process.env.PORT || 3000)
