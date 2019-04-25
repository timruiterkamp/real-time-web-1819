const Twit = require("twit");
require("dotenv").config();
const Sentiment = require("sentiment");
const sentiment = new Sentiment();

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

  stream.on("tweet", function(tweets) {
    let result = [];

    var analysation = sentiment.analyze(tweets.text);

    if (analysation.score > 0) {
      result.push({
        text: tweets.text,
        country:
          tweets.user && tweets.user.location !== false
            ? tweets.user.location
            : "unknown",
        name:
          tweets.user && tweets.user.name !== null
            ? tweets.user.name
            : "anonymous",
        image:
          tweets.user && tweets.user.profile_image_url_https !== null
            ? tweets.user.profile_image_url_https
            : "",
        sentiment: "negative"
      });
    } else {
      result.push({
        text: tweets.text,
        country:
          tweets.user && tweets.user.location !== false
            ? tweets.user.location
            : "unknown",
        name:
          tweets.user && tweets.user.name !== null
            ? tweets.user.name
            : "anonymous",
        image:
          tweets.user && tweets.user.profile_image_url_https !== null
            ? tweets.user.profile_image_url_https
            : "",
        sentiment: "positive"
      });
    }

    socket.emit("searchTweets", result);
  });
};

const getTweets = (keyword, socket) => {
  T.get("search/tweets", { q: keyword, count: 100 }, function(
    err,
    data,
    response
  ) {
    let tweetResults = [];

    data.statuses.map(tweets => {
      var analysation = sentiment.analyze(tweets.text);

      if (analysation.score > 0) {
        tweetResults.push({
          text: tweets.text,
          country:
            tweets.user && tweets.user.location !== false
              ? tweets.user.location
              : "unknown",
          name:
            tweets.user && tweets.user.name !== null
              ? tweets.user.name
              : "anonymous",
          image:
            tweets.user && tweets.user.profile_image_url_https !== null
              ? tweets.user.profile_image_url_https
              : "",
          sentiment: "negative"
        });
      } else {
        tweetResults.push({
          text: tweets.text,
          country:
            tweets.user && tweets.user.location !== false
              ? tweets.user.location
              : "unknown",
          name:
            tweets.user && tweets.user.name !== null
              ? tweets.user.name
              : "anonymous",
          image:
            tweets.user && tweets.user.profile_image_url_https !== null
              ? tweets.user.profile_image_url_https
              : "",
          sentiment: "positive"
        });
      }
    });
    socket.emit("oldTweets", tweetResults);
  });
};

module.exports = { getTrends, getStream, getTweets };
