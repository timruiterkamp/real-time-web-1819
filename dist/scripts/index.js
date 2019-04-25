
var socket = io()

socket.on('searchTweets', msg => {
  const messages = document.querySelector('#tweets')
  messages.innerHTML += `<article class="mb-3 mt-3">
  <div class="heading">
  <img src=${msg && msg[0].image ? msg[0].image : ''} alt=${msg[0].name} />
  <h5>${msg[0] && msg[0].name ? msg[0].name : ''}</h5>
  ${
    msg[0].sentiment === 'positive'
      ? `<h4 class="card-title"> ${
          msg[0].country !== undefined ? `Tweet from ${msg[0].country}` : ''
        } <span class="badge badge-success">positive</span></h4>`
      : `<h4 class="card-title">Tweet from ${
          msg[0].country
        } <span class="badge badge-danger">Negative</span>`
  }
  </div>
   ${
     msg && msg[0].country !== null
       ? `<h4  class="card-title">Tweet from ${msg[0].country}</h4>`
       : ''
   }
  <p class="card-text">${msg[0].text}</p>
  </article>`
})

socket.on('oldTweets', data => {
  let negativeAmount = data.filter(tweet => tweet.sentiment === 'negative')
  let positiveAmount = data.filter(tweet => tweet.sentiment === 'positive')
  const tweets = document.querySelector('#oldTweets')
  var ctx = document.getElementById('myChart').getContext('2d')
  var myChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Negative', 'Positive'],
      datasets: [
        {
          label: 'Amount of sentiment',
          data: [negativeAmount.length, positiveAmount.length],
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
          ],
          borderWidth: 1
        }
      ]
    },
    options: {
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true
            }
          }
        ]
      }
    }
  })

  data.map(tweet => {
    tweets.innerHTML += `<article class="mb-3 mt-3">
  <div class="heading">
  <img src=${tweet.image ? tweet.image : ''} alt=${tweet.name} />
  <h5>${tweet.name ? tweet.name : ''}</h5>
  </div>
  
  ${
    tweet.sentiment === 'positive'
      ? `<h4 class="card-title"> ${
          tweet.country !== undefined ? `Tweet from ${tweet.country}` : ''
        } <span class="badge badge-success">positive</span></h4>`
      : `<h4 class="card-title">Tweet from ${
          tweet.country
        } <span class="badge badge-danger">Negative</span>`
  }
 <p class="card-text">${tweet.text}</p>
 </article>`
  })
})
;(() => {
  console.log('doet t wel')
  const likeBtn = document.querySelectorAll('.like-button')
  if (likeBtn) {
    likeBtn.forEach(btn =>
      btn.addEventListener('click', e => {
        e.preventDefault()
        console.log(e.currentTarget.dataset.name)
        value = e.currentTarget.dataset.name
        socket.emit('addHotItem', value)
      })
    )
  }

  socket.emit('listenToChanges', true)
})()

socket.on('newHotItems', data => {
  const section = document.querySelector('.hotSection')
  const articles = document.querySelector('.hotArticles')

  if (section) {
    articles.innerHTML = ''

    data.map(msg => {
      articles.innerHTML += `<article class="col-md-3 col-sm-6 card ml-2 mr-2 mb-2 mt-2">
      <div class="card-body">
      <p class="card-text">${msg.site}</p>
      <h5 class="card-title">${msg.title}</h5>
      <p class="card-text">${msg.subtitle}</p>
      <a href="${msg.permalink}" class="btn btn-primary">See tweets</a>
      <button type="button" class="btn btn-outline-danger dislike-button" data-name="${
        msg.title
      }"><svg enable-background="new 0 0 96 96" height="96px" id="circle_cross" version="1.1" viewBox="0 0 96 96" width="96px" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M48,4C23.7,4,4,23.699,4,48s19.7,44,44,44s44-19.699,44-44S72.3,4,48,4z M48,84c-19.882,0-36-16.118-36-36s16.118-36,36-36  s36,16.118,36,36S67.882,84,48,84z"/><path d="M53.657,48l8.485-8.485c1.562-1.562,1.562-4.095,0-5.656c-1.562-1.562-4.096-1.562-5.658,0L48,42.343l-8.485-8.484  c-1.562-1.562-4.095-1.562-5.657,0c-1.562,1.562-1.562,4.096,0,5.656L42.343,48l-8.485,8.485c-1.562,1.562-1.562,4.095,0,5.656  c1.562,1.562,4.095,1.562,5.657,0L48,53.657l8.484,8.484c1.562,1.562,4.096,1.562,5.658,0c1.562-1.562,1.562-4.096,0-5.656  L53.657,48z"/></svg></button>
      </div>
    </article>`
    })
  }
  const dislikeBtn = document.querySelectorAll('.dislike-button')
  if (dislikeBtn.length) {
    console.log(dislikeBtn, 'komt hier')
    dislikeBtn.forEach(btn =>
      btn.addEventListener('click', e => {
        console.log('clicked')
        e.preventDefault()
        console.log(e.currentTarget.dataset.name)
        value = e.currentTarget.dataset.name
        socket.emit('removeHotItem', value)
      })
    )
  }
})
