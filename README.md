# Sharewatch

[![Build Status](https://travis-ci.org/anjulgarg/sharewatch.svg?branch=master)](https://travis-ci.org/anjulgarg/sharewatch)

Fetch Real-time Indian stock market data from NSE (National Stock Exchange) and BSE (Bombay Stock Exchange)

## Features

- List all companies under NSE and BSE India along with their ISIN, Scrip Code etc.
- Fetch Real-Time NSE and BSE indice data like NIFTY50 Index and BSE Index
- Fetch Real-Time Quote (live price) for any Equity listed under NSE and BSE

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

```sh
const NSE = require('sharewatch').NSE
let result = await NSE.quote('INFY')
```

```sh
const BSE = require('sharewatch').BSE
let result = await BSE.quote('INFY')
```

### Fetch real-time BSE Stock Quote with Peer comparison

```sh
const BSE = require('sharewatch').BSE
let result = await BSE.quoteWithComparison('INFY')
```
