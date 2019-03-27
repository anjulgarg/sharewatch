# Sharewatch

[![Build Status](https://travis-ci.org/anjulgarg/sharewatch.svg?branch=master)](https://travis-ci.org/anjulgarg/sharewatch)

Fetch Real-time Indian stock market data from NSE (National Stock Exchange) and BSE (Bombay Stock Exchange)

### Installation

Sharewatch requires [Node.js](https://nodejs.org/) v8.10.0+ to run.
```sh
$ npm install sharewatch
```

### Example Usage

Fetch the list of all Equity Securities listed under NSE India
```sh
const NSE = require('sharewatch').NSE
let result = await NSE.equityList()
```

Similarly, you can fetch this list for BSE India
```sh
const BSE = require('sharewatch').BSE
let result = await BSE.equityList()
```

Fetch real-time NSE Indice data
```sh
const NSE = require('sharewatch').NSE
let result = await NSE.indices()
```

Fetch real-time NSE Stock Quote
```sh
const NSE = require('sharewatch').NSE
let result = await NSE.quote('INFY')
```
