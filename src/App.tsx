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
        <div className="tab">
          {Tab[tab]}
        </div>
      );
    }
  }

  const timeFrames = [];
  for (const time in Timeframe) {
    if (Number(time) >= 0) {
      timeFrames.push(
        <div className="timeframe">
          {Timeframe[time]}
        </div>
      );
    }
  }

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
