const Twit = require('twit');
require('dotenv').config()

const T = new Twit({
    consumer_key: process.env.consumer_key,
    consumer_secret: process.env.consumer_secret,
    access_token: process.env.access_token,
    access_token_secret: process.env.access_token_secret
})

const getTrends = async () => {
  let trends = [];
  await T.get('trends/place', {id: '1'}, (err, data, response) => data.map(items => trends.push(items.trends)))
  console.log(trends)
  return trends;  
}


module.exports = {getTrends}