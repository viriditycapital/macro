import React, { useState, useEffect } from "react";

// User feeds to retrieve tweets from
const TWITTER_USERNAMES = ["DeItaone", "Fxhedgers", "FirstSquawk"];

export default function Twitter() {
  const [tweetFeed, setTweetFeed] = useState();

  /*
  const renderTweets = () => {
    console.log("rendering tweets from", tweetFeed);
    let tweet_columns = [];
    for (const [_username, tweets] of Object.entries(tweetFeed)) {
      let tweets_elements = tweets.map((tweet) => (
        <div className="tweet">{tweet.text}</div>
      ));
      tweet_columns.push(<div className="tweet-column">{tweets_elements}</div>);
    }

    return tweet_columns;
  };
  */

  const fetchTweets = async () => {
    let tweet_data = await Promise.all(TWITTER_USERNAMES.map(async (username) => {
      let response = await fetch(`/api/tweets/${username}`);
      let json = await response.json();

      return json.tweets._realData.data;
    }));

    let tweet_columns = [];
    for (const [idx, tweets] of Object.entries(tweet_data)) {
      let tweets_elements = tweets.map((tweet) => (
        <div className="tweet" key={tweet.id}>{tweet.text}</div>
      ));
      tweet_columns.push(<div className="tweet-column" key={idx}><h2>@{TWITTER_USERNAMES[idx]}</h2>{tweets_elements}</div>);
    }

    setTweetFeed(tweet_columns);
  };

  useEffect(() => {
    fetchTweets();
  }, []);

  return (
    <div id="twitter">
      <h1>Twitter</h1>
      <div id="tweet-feeds">{tweetFeed}</div>
    </div>
  );
}
