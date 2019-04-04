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
const AdmZip = require('adm-zip')
const uuid = require('uuid/v4')
const CSV = require('../utils/csv')

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

const INVALID_RESPONSE = 'invalid server response'
const TIMEOUT = 5 * 1000

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
      let columns = CSV.parse_columns(res)
      if (columns.indexOf('symbol') < 0) return reject(new Error(INVALID_RESPONSE))
      let result = CSV.parse_data(res)
      resolve(result)
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
NSE.bhavcopy = (date, timeout = TIMEOUT) => new Promise((resolve, reject) => {
  let temp_storage = `/tmp/${uuid()}.zip`
  request(BHAVCOPY_URL(date), { timeout: timeout })
    .on('error', (err) => reject(err))
    .pipe(fs.createWriteStream(temp_storage))
    .on('close', () => {
      let zip = new AdmZip(temp_storage)
      let csvData = zip.getEntries()[0].getData().toString('utf8')
      fs.unlinkSync(temp_storage)

      let columns = CSV.parse_columns(csvData)
      if (columns.indexOf('symbol') < 0) return reject(new Error(INVALID_RESPONSE))
      let result = CSV.parse_data(csvData)
      resolve(result)
    })
})
