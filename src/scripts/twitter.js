const Twit = require("twit");
require("dotenv").config();

const T = new Twit({
  consumer_key: process.env.consumer_key,
  consumer_secret: process.env.consumer_secret,
  access_token: process.env.access_token,
  access_token_secret: process.env.access_token_secret
});

const getTrends = async () => {
  let trends = [];
  await T.get("trends/place", { id: "1" }, (err, data, response) =>
    data.map(items => trends.push(items.trends))
  );
  console.log(trends);
  return trends;
};

const getStream = (keyword, socket) => {
  console.log(keyword);
  const stream = T.stream("statuses/filter", {
    track: keyword,
    language: "en"
  });

  stream.on("tweet", function(tweet) {
    socket.emit("searchTweets", tweet);
    console.log(tweet);
  });
};

const getTweets = keyword => {
  T.get("search/tweets", { q: keyword, count: 100 }, function(
    err,
    data,
    response
  ) {
    console.log(data);
  });
};

module.exports = { getTrends, getStream, getTweets };
