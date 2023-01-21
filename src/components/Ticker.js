import React, { useState, useEffect } from "react";

export default function Ticker({ is_market_hours, ticker, currency_symbol }) {
  const [price, setPrice] = useState();

  const fetchAndUpdateQuoteData = async (ticker) => {
    if (ticker != null && ticker.length > 0) {
      let response = await fetch(`/api/stonks/quote/${ticker}`);
      let json = await response.json();
      setPrice(json.quotes.regularMarketPrice);
    }
  }

  useEffect(() => {
    if (is_market_hours) {
      const interval = setInterval(async () => {
        fetchAndUpdateQuoteData(ticker);
      }, 1000);

      return () => {
        clearInterval(interval);
      };
    } else {
      fetchAndUpdateQuoteData(ticker);
    }
  }, [ticker]);

  return <div>{price != null ? `${currency_symbol}${price}` : null}</div>;
}
