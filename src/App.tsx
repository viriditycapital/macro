import { useEffect, useState } from "react";

enum Tab {
  Macro,
  Stocks,
  Options,
  Twitter,
}

enum Timeframe {
  "1w",
  "2w",
  "1m",
  "3m",
  "6m",
  "1y",
  "2y",
  "5y",
  "10y",
}

function App() {
  const tabComponents = [];
  for (const tab in Tab) {
    if (Number(tab) >= 0) {
      tabComponents.push(
        <div className="tab" id={tab}>
          {Tab[tab]}
        </div>
      );
    }
  }

  const timeFrames = [];
  for (const time in Timeframe) {
    if (Number(time) >= 0) {
      timeFrames.push(
        <div className="timeframe" key={time}>
          {Timeframe[time]}
        </div>
      );
    }
  }

  // Stock data
  useEffect(() => {
    Promise.all([
      fetch(`/api/stonks/^GSPC`).then(res => res.json()),
      // fetch(`/api/stonks/^VIX`).then(res => res.json()),
      fetch(`/api/fred/T10Y2Y`).then(res => res.json()),
    ])
      .then(data => {
        console.log(data);
      });
  }, []);

  return (
    <div className="App">
      <div className="tab-wrapper">
        {tabComponents}
      </div>
      <div className="timeframe-wrapper">
        {timeFrames}
      </div>
    </div>
  );
}

export default App;
