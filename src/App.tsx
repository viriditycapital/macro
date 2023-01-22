import { useEffect, useState } from "react";
import Plotly, { Data, Datum, Layout } from 'plotly.js-dist-min'

// Static data
import USREC from './data/USREC.json';

enum Tab {
  Macro,
  Stocks,
  Options,
  Twitter,
}

enum Timeframe {
  "1w" = 7 * 24 * 60 * 60,
  "2w" = 14 * 24 * 60 * 60,
  "1m" = 30 * 24 * 60 * 60,
  "3m" = 90 * 24 * 60 * 60,
  "6m" = 180 * 24 * 60 * 60,
  "1y" = 365.25 * 24 * 60 * 60,
  "2y" = 2 * 365.25 * 24 * 60 * 60,
  "5y" = 5 * 365.25 * 24 * 60 * 60,
  "10y" = 10 * 365.25 * 24 * 60 * 60,
}

function App() {
  // State
  const [timeFrame, setTimeFrame] = useState(Timeframe["6m"]);

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
      fetch(`/api/stonks/^GSPC?startDate=${Number(new Date()) - timeFrame.valueOf() * 1000}`).then(res => res.json()),
      fetch(`/api/fred/T10Y2Y`).then(res => res.json()),
      fetch(`/api/fred/FPCPITOTLZGUSA`).then(res => res.json()),
      fetch(`/api/stonks/^VIX?startDate=${Number(new Date()) - timeFrame.valueOf() * 1000}`).then(res => res.json()),
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

          increasing: { line: { color: 'green', width: 1 } },
          decreasing: { line: { color: 'red', width: 1 } },

          xaxis: 'x',
          yaxis: 'y',
          type: 'candlestick'
        };

        const dataPlot: Data[] = [trace];

        const SPX_LEVELS: number[] = [3400, 3700, 3850, 3950, 4000, 4125, 4200];
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
          },
          shapes: SPX_LEVELS.map(level => {
            return {
              type: 'line',
              xref: 'paper',
              x0: 0,
              y0: level,
              x1: 1,
              y1: level,
              line: {
                color: 'purple',
                width: 1,
              }
            };
          })
        };

        Plotly.newPlot('chart-spx', dataPlot, layout);

        // VIX
        const vixData = data[3].historical;

        const traceVIX: Data = {
          x: unpack(vixData, 'date'),
          close: unpack(vixData, 'close'),
          high: unpack(vixData, 'high'),
          low: unpack(vixData, 'low'),
          open: unpack(vixData, 'open'),

          increasing: { line: { color: 'green', width: 1 } },
          decreasing: { line: { color: 'red', width: 1 } },

          xaxis: 'x',
          yaxis: 'y',
          type: 'candlestick'
        };

        const layoutVIX: Partial<Layout> = {
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
            text: 'VIX'
          },
          shapes: [
            {
              type: 'line',
              xref: 'paper',
              x0: 0,
              y0: 20,
              x1: 1,
              y1: 20,
              line: {
                color: 'purple',
                width: 2,
              }
            }
          ]
        };

        Plotly.newPlot('chart-vix', [traceVIX], layoutVIX);


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
          },
          shapes: [
            {
              type: 'line',
              xref: 'paper',
              x0: 0,
              y0: 0,
              x1: 1,
              y1: 0,
              line: {
                color: 'purple',
                width: 2,
              }
            }
          ]
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
      <div className="chart" id='chart-vix'></div>
      <div className="chart" id='chart-yield-inversion'></div>
      <div className="chart" id='chart-inflation'></div>
    </div>
  );
}

export default App;
