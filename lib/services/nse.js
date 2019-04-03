/*!
 * sharewatch
 * Copyright(c) 2019 Anjul Garg <anjulgarg@live.com>
 * MIT Licensed
 */

'use strict'

/**
 * Module dependencies
 * @private
 */
const fs = require('fs')
const moment = require('moment')
const request = require('request-promise')

/**
 * Module settings
 * @private
 */
const HOST_URL = 'https://www.nseindia.com'
const EQUITY_LIST_URL = `${HOST_URL}/content/equities/EQUITY_L.csv`
const INDICE_URL = `${HOST_URL}/homepage/Indices1.json`
const QUOTE_URL = (symbol) => `${HOST_URL}/live_market/dynaContent/live_watch/get_quote/GetQuote.jsp?symbol=${symbol}`
const SECTOR_URL = (symbol) => `${HOST_URL}/live_market/dynaContent/live_watch/get_quote/getPEDetails.jsp?symbol=${symbol}`
const BHAVCOPY_URL = (dt) => {
  dt = moment(dt)
  let year = dt.format('YYYY')
  let month = dt.format('MMM').toUpperCase()
  let day = dt.format('DD')
  return `${HOST_URL}/content/historical/EQUITIES/${year}/${month}/cm${day}${month}${year}bhav.csv.zip`
}

const TIMEOUT = 5 * 1000
const INVALID_RESPONSE = 'invalid server response'

/**
 * Service object
 * @public
 */
const NSE = Object.create(null)

/**
 * Module exports
 * @public
 */
module.exports = NSE

/**
 * Get a list of all the equity securities listed under NSE
 * 
 * @param {Number} timeout Defaults to 5 * 1000
 * @return {Array} Array containing fields like `symbol`, `isin` etc.
 * @public
 */
NSE.equityList = (timeout = TIMEOUT) => new Promise((resolve, reject) => {
  request.get(EQUITY_LIST_URL, { timeout: timeout })
    .then((res) => {
      let lines = res.split(/[\r\n]+/)
      if (lines.length < 2) return reject(new Error(INVALID_RESPONSE))

      let columns = lines[0].split(',').map((el) => {
        return el.trim().toLowerCase().replace(/ /g, '_')
      })

      if (columns.indexOf('symbol') < 0) return reject(new Error(INVALID_RESPONSE))

      let results = []
      lines.forEach((line, index) => {
        if (index == 0) return
        let data = {}
        let values = line.split(',')
        columns.forEach((el, idx) => { data[el] = values[idx] })
        results.push(data)
      })

      resolve(results)
    })
    .catch((err) => reject(err))
})

/**
 * Get live NSE Indices like NIFTY50 index value.
 * 
 * @param {Number} timeout Defaults to 5 * 1000
 * @return {Object}
 * @public
 */
NSE.indices = (timeout = TIMEOUT) => new Promise((resolve, reject) => {
  request(INDICE_URL, { timeout: timeout })
    .then((res) => {
      if (!res) return reject(new Error(INVALID_RESPONSE))
      try {
        let result = JSON.parse(res)
        resolve(result)
      } catch (err) { return reject(new Error(INVALID_RESPONSE)) }
    })
    .catch((err) => reject(err))
})

/**
 * Get live quote for a `symbol`
 * 
 * @param {String} symbol
 * @param {Number} timeout Defaults to 5 * 1000
 * @return {Object}
 * @public
 */
NSE.quote = (symbol, timeout = TIMEOUT) => new Promise((resolve, reject) => {
  request(QUOTE_URL(symbol), { timeout: timeout })
    .then((res) => {
      let body = res.replace(/(\r\n|\n|\r)/gm, '')
      let rp = new RegExp(/<div id="responseDiv" style="display:none">(.*?)<\/div>/)
      let matches = body.match(rp)
      if (!matches) return reject(new Error(INVALID_RESPONSE))

      try {
        let result = JSON.parse(matches[1])
        resolve(result)
      } catch (error) { return reject(new Error(INVALID_RESPONSE)) }
    })
    .catch((err) => reject(err))
})

/**
 * Get Sector information for a `symbol`
 * 
 * @param {String} symbol
 * @param {Number} timeout Defaults to 5 * 1000
 * @return {Object}
 * @public
 */
NSE.sectorDetails = (symbol, timeout = TIMEOUT) => new Promise((resolve, reject) => {
  request(SECTOR_URL(symbol), { timeout: timeout })
    .then((res) => {
      if (!res) return reject(new Error(INVALID_RESPONSE))
      try {
        let result = JSON.parse(res)
        resolve(result)
      } catch (error) { return reject(new Error(INVALID_RESPONSE)) }
    })
    .catch((err) => reject(err))
})

/**
 * Download Bhavcopy (End of day stats) for a `date`
 * Creates a zip file containing the bhavcopy for this date.
 * 
 * @param {String} date YYYY-MM-DD Example: 2018-01-01
 * @param {String} output Output File path
 * @param {Number} timeout Defaults to 5 * 1000
 * @return {String}
 * @public
 */
NSE.bhavcopy = (date, output, timeout = TIMEOUT) => new Promise((resolve, reject) => {
  request(BHAVCOPY_URL(date), { timeout: timeout })
    .on('error', (err) => reject(err))
    .pipe(fs.createWriteStream(output))
    .on('close', () => resolve(output))
})
