const express = require("express");
const yahooFinance = require("yahoo-finance2").default; // NOTE the .default
const KEYS = require("../keys/keys.json");
const { TwitterApi } = require("twitter-api-v2");

const app = express();
const port = process.env.PORT || 3001;

const client = new TwitterApi(KEYS.twitter.bearer_token);

app.get("/api/stonks/:ticker", async (req, res) => {
  let date = new Date();
  date.setDate(date.getDate() - 30);
  const search = await yahooFinance.search(req.params.ticker);

  let quotes;
  if (req.params.ticker.length > 0) {
    quotes = await yahooFinance.quote(req.params.ticker);
  } else {
    quotes = {};
  }

  const historical = await yahooFinance.historical(req.params.ticker, {
    period1: date,
    period2: new Date(),
    interval: "1d",
  });

  res.send({
    search,
    quotes,
    historical,
  });
});

app.get("/api/stonks/quote/:ticker", async (req, res) => {
  let quotes;
  if (req.params.ticker.length > 0) {
    quotes = await yahooFinance.quote(req.params.ticker);
  } else {
    quotes = {};
  }

  res.send({
    quotes,
  });
});

app.get("/api/stonks/options/:ticker", async (req, res) => {
  let queryOptions = { lang: "en-US", formatted: false, region: "US" };

  const expDate = req.query.expdate;

  if (expDate != null) {
    queryOptions.date = new Date(Number(expDate));
  }

  let options;
  if (req.params.ticker.length > 0) {
    options = await yahooFinance.options(req.params.ticker, queryOptions);
  } else {
    options = {};
  }

  res.send({
    options,
  });
});

app.get("/api/tweets/:user", async (req, res) => {
  let user = req.params.user;

  const twitter_user = await client.v2.userByUsername(user);
  const tweets = await client.v2.userTimeline(twitter_user.data.id, {
    exclude: "replies",
  });

  res.send({
    tweets,
  });
});

app.listen(port, function () {
  console.log("App listening on port: " + port);
});
