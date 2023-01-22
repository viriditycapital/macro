import { useEffect, useState } from "react";
import Plotly, { Data, Layout, OhclData } from 'plotly.js-dist-min'

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
        <div className="tab" id={tab} key={tab}>
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
        const unpack = (rows: any, key: string) => rows.map((row: any) => row[key]);

        const historical = data[0].historical;

        const trace: Data ={
          x: unpack(historical, 'date'),
          close: unpack(historical, 'close'),
          high: unpack(historical, 'high'),
          low: unpack(historical, 'low'),
          open: unpack(historical, 'open'),

          increasing: { line: { color: 'green' } },
          decreasing: { line: { color: 'red' } },

          xaxis: 'x',
          yaxis: 'y',
          type: 'candlestick'
        };

        const dataPlot: Data[] = [trace];

        const layout: Partial<Layout> = {
          dragmode: 'zoom',
          showlegend: false,
          xaxis: {
            autorange: true,
            title: 'Date',
            type: 'date',
            rangeslider: {
              visible: false
            }
          },
          yaxis: {
            autorange: true,
            type: 'linear'
          }
        };

        Plotly.newPlot('chart-spx', dataPlot, layout);

        // Yields
        const yieldData = data[1].response.observations;
        const traceYields: Data ={
          x: unpack(yieldData, 'date'),
          y: unpack(yieldData, 'value'),
          xaxis: 'x',
          yaxis: 'y',
        };

        Plotly.newPlot('chart-yield-inversion', [traceYields]);
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
      <div className="chart" id='chart-spx'></div>
      <div className="chart" id='chart-yield-inversion'></div>
    </div>
  );
}

export default App;
