# ante

macro view of the economy

The idea of this project is to be able to look at economic indicators and _approximately_ figure out where we are headed.

## Features

- Current inflation
  - All inflation has gone down during recessions: https://fred.stlouisfed.org/series/FPCPITOTLZGUSA
- Housing prices
  - Relative to income
- Unemployment
  - Goes up during recession: https://fred.stlouisfed.org/series/UNRATE
- Consumer debt
- Highlight recession times: https://fred.stlouisfed.org/series/USREC
- GDP numbers
- Banks Tightening standards: https://fred.stlouisfed.org/series/DRTSCILM#0
  - Tends to go up during recessions
- Treasury rates (3 month, 1/2/5/15/30 YR)
  - Yield inversion: https://fred.stlouisfed.org/series/T10Y2Y
  - When the yield inverts, recession doesn't usually happen until the yield spread starts increasing again
- Risk free-rate (inflation - treasury)
- Gold futures
- ES_F
- NQ_F
- DOW
- Have indicators explaining what the economy is currently going through
- Maybe scan certain sectors to see if they are getting stronger of late
- U.S. ISM Non-Manufacturing Purchasing Managers Index (PMI)

## Quant stuff

- Be able to test out strategies easily

## Infrastructure

- To avoid a ton of HTTP requests, probably a good idea to have a server that scrapes data

## TODO

1. Recession Indicator: instead of doing a lot of work over and over again, we should preprocess it so that we just have a range of dates that are recessions. Then we can probably just filter from there