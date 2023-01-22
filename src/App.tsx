import { useEffect, useState } from "react";
import Plotly, { Data, Layout } from 'plotly.js-dist-min'

enum Tab {
  Macro,
  Stocks,
  Options,
  Twitter,
}

enum Timeframe {
  "1w" = 5 * 24 * 60 * 60,
  "2w" = 2 * 5 * 24 * 60 * 60,
  "1m" = 4 * 5 * 24 * 60 * 60,
  "3m" = 12 * 5 * 24 * 60 * 60,
  "6m" = 24 * 5 * 24 * 60 * 60,
  "1y" = 365.25 * 24 * 60 * 60,
  "2y" = 2 * 365.25 * 24 * 60 * 60,
  "5y" = 5 * 365.25 * 24 * 60 * 60,
  "10y" = 10 * 365.25 * 24 * 60 * 60,
}

function App() {
  // State
  const [timeFrame, setTimeFrame] = useState(Timeframe["3m"]);

  // UI components
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
      fetch(`/api/stonks/^GSPC?startDate=${Number(new Date()) - timeFrame.valueOf()*1000}`).then(res => res.json()),
      // fetch(`/api/stonks/^VIX`).then(res => res.json()),
      fetch(`/api/fred/T10Y2Y`).then(res => res.json()),
      fetch(`/api/fred/FPCPITOTLZGUSA`).then(res => res.json()),
    ])
      .then(data => {
        console.log(data);
        const unpack = (rows: any, key: string) => rows.map((row: any) => row[key]);

        const historical = data[0].historical;

        const trace: Data = {
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
          },
          title: {
            text: 'SPX'
          }
        };

        Plotly.newPlot('chart-spx', dataPlot, layout);

        // Yields
        const yieldData = data[1].response.observations;
        const traceYields: Data = {
          x: unpack(yieldData, 'date'),
          y: unpack(yieldData, 'value'),
          xaxis: 'x',
          yaxis: 'y',
        };
        const layoutYields: Partial<Layout> = {
          title: {
            text: '10YR - 2YR Bond Yields'
          }
        }

        Plotly.newPlot('chart-yield-inversion', [traceYields], layoutYields);

        // Inflation
        const inflationData = data[2].response.observations;
        const traceInflation: Data = {
          x: unpack(inflationData, 'date'),
          y: unpack(inflationData, 'value'),
          xaxis: 'x',
          yaxis: 'y',
        };
        const layoutInflation: Partial<Layout> = {
          title: {
            text: 'Consumer Inflation (US)'
          }
        }

        Plotly.newPlot('chart-inflation', [traceInflation], layoutInflation);
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
      <div className="chart" id='chart-inflation'></div>
    </div>
  );
}

export default App;
