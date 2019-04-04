# Sharewatch

[![Build Status](https://travis-ci.org/anjulgarg/sharewatch.svg?branch=master)](https://travis-ci.org/anjulgarg/sharewatch)

Fetch Real-time Indian stock market data from NSE (National Stock Exchange) and BSE (Bombay Stock Exchange)

## Features

- List all companies under NSE and BSE India along with their ISIN, Scrip Code etc.
- Fetch Real-Time NSE and BSE indice data like NIFTY50 Index and BSE Index
- Fetch Real-Time Quote (live price) for any Equity listed under NSE and BSE
- Sharewatch CLI. (Allows sharewatch to be used with any language)

## Installation

Sharewatch requires [Node.js](https://nodejs.org/) v6.11.0+ to run.

```sh
$ npm install sharewatch
```

## Example Usage

### Fetch the list of all Equity Securities listed under NSE India

```sh
const NSE = require('sharewatch').NSE
let result = await NSE.equityList()
```

OR if you want to use Promises

```sh
const NSE = require('sharewatch').NSE
NSE.equityList()
    .then((result) => {
        // use `result`
    })
    .catch((err) => {
        // handle error
    })
```

### Similarly, you can fetch this list for BSE India

```sh
const BSE = require('sharewatch').BSE
let result = await BSE.equityList()
```

### Fetch real-time NSE and BSE Indice data

```sh
const NSE = require('sharewatch').NSE
let result = await NSE.indices()
```

```sh
const BSE = require('sharewatch').BSE
let result = await BSE.indices()
```

### Fetch real-time NSE and BSE Stock Quote

NSE quote requires the stock `symbol` which can be found in NSE equity list

```sh
const NSE = require('sharewatch').NSE
let result = await NSE.quote('INFY')
```

BSE quote requires the stock `scrip code` which can be found in BSE equity list

```sh
const BSE = require('sharewatch').BSE
let result = await BSE.quote('500209')
```

### Fetch real-time BSE Stock Quote with Peer comparison

```sh
const BSE = require('sharewatch').BSE
let result = await BSE.quoteWithComparison('500209')
```

### Fetch Bhavcopy for BSE and NSE Stocks on a particular date

```sh
const BSE = require('sharewatch').BSE
let result = await BSE.bhavcopy('2019-01-01')
```

```sh
const NSE = require('sharewatch').NSE
let result = await NSE.bhavcopy('2019-01-01')
```

## Using CLI

### Get NSE/BSE Equity List

```sh
$ sharewatch -p nse equity-list
```

```sh
$ sharewatch -p bse equity-list
```

### Get real-time NSE and BSE Indice data

```sh
$ sharewatch -p nse indices
```

```sh
$ sharewatch -p bse indices
```

### Get real-time NSE and BSE Stock Quote

NSE quote requires the stock `symbol` which can be found in NSE equity list

```sh
$ sharewatch -p nse -c 'infy, bhel, ongc' quote
```

BSE quote requires the stock `scrip code` which can be found in BSE equity list

```sh
$ sharewatch -p bse -c '500209, 500209' quote
```

### Get bhavcopy for NSE and BSE Stock on a date

```sh
$ sharewatch -p nse -d 2019-01-01 bhavcopy
```

```sh
$ sharewatch -p bse -d 2019-01-01 bhavcopy
```