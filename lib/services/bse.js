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
const request = require('request-promise')


/**
 * Module settings
 * @private
 */
const HOST_URL = 'https://www.bseindia.com'
const EQUITY_LIST_URL = `${HOST_URL}/corporates/List_Scrips.aspx`
const INDICE_URL = 'https://api.bseindia.com/bseindia/api/Sensex/getSensexData?json={"fields":"2,3,4,5,6,7"}'
const QUOTE_URL = (scripCode) => `https://api.bseindia.com/BseIndiaAPI/api/StockReachGraph/w?scripcode=${scripCode}&flag=0&fromdate=&todate=&seriesid=`
const QUOTE_PEER = (scripCode) => `https://api.bseindia.com/BseIndiaAPI/api/EQPeerGp/w?scripcode=${scripCode}&scripcomare=`
const TIMEOUT = 5 * 1000
const INVALID_RESPONSE = 'invalid server response'

/**
 * Service object
 * @public
 */
const BSE = Object.create(null)

/**
 * Module exports
 * @public
 */
module.exports = BSE

/**
 * Get a list of all the equity securities listed under NSE
 * 
 * @param {Number} timeout Defaults to 5 * 1000
 * @return {Array} Array containing fields like `isin_no` etc.
 * @public
 */
BSE.equityList = (timeout = TIMEOUT * 4) => new Promise((resolve, reject) => {
  let headers = { 'content-type': 'application/x-www-form-urlencoded' }
  let options = {
    url: EQUITY_LIST_URL,
    method: 'POST',
    headers: headers,
    body: fs.readFileSync(__dirname + '/bse_formdata.txt'),
    timeout: timeout,
  }
  request(options)
    .then((res) => {
      let lines = res.split(/[\r\n]+/)
      if (lines.length < 2) return reject(new Error(INVALID_RESPONSE))

      let columns = lines[0].split(',').map((el) => {
        return el.trim().toLowerCase().replace(/ /g, '_')
      })

      if (columns.indexOf('isin_no') < 0) return reject(new Error(INVALID_RESPONSE))

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
 * Get live BSE Indice data.
 * 
 * @param {Number} timeout Defaults to 5 * 1000
 * @return {Object}
 * @public
 */
BSE.indices = (timeout = TIMEOUT) => new Promise((resolve, reject) => {
  request(INDICE_URL, { timeout: timeout })
    .then((res) => {
      if (!res) return reject(new Error(INVALID_RESPONSE))
      try {
        let result = JSON.parse(res)[0]
        resolve(result)
      } catch (err) { return reject(new Error(INVALID_RESPONSE)) }
    })
    .catch((err) => reject(err))
})

/**
 * Get live quote for a `scripCode`
 * 
 * @param {String} scripCode
 * @param {Number} timeout Defaults to 5 * 1000
 * @return {Object}
 * @public
 */
BSE.quote = (scripCode, timeout = TIMEOUT) => new Promise((resolve, reject) => {
  request(QUOTE_URL(scripCode), { timeout: timeout })
    .then((res) => {
      if (!res) return reject(new Error(ERROR_BLANK_RESPONSE))
      try {
        let result = JSON.parse(res)
        resolve(result)
      } catch (error) { return reject(new Error(INVALID_RESPONSE)) }
    })
    .catch((err) => reject(err))
})

/**
 * Get live quote and peer comparison for a `scripCode`
 * 
 * @param {String} scripCode
 * @param {Number} timeout Defaults to 5 * 1000
 * @return {Object}
 * @public
 */
BSE.quoteWithComparison = (scripCode, timeout = TIMEOUT) => new Promise((resolve, reject) => {
  request(QUOTE_PEER(scripCode), { timeout: timeout })
    .then((res) => {
      if (!res) return reject(new Error(ERROR_BLANK_RESPONSE))
      try {
        let result = JSON.parse(res)
        resolve(result)
      } catch (error) { return reject(new Error(INVALID_RESPONSE)) }
    })
    .catch((err) => reject(err))
})