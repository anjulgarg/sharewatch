/*!
 * stocker
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
const ERROR_BLANK_RESPONSE = 'blank server response'
const ERROR_INVALID_RESPONSE = 'invalid server response'

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
BSE.equityList = async function (timeout = TIMEOUT * 4) {
  let headers = {'content-type': 'application/x-www-form-urlencoded'}
  let options = {
    url: EQUITY_LIST_URL,
    method: 'POST',
    headers: headers,
    body: fs.readFileSync(__dirname + '/bse_formdata.txt'),
    timeout: timeout,
  }

  let res = await request(options)
  if (!res) throw new Error(ERROR_BLANK_RESPONSE)

  let lines = res.split(/[\r\n]+/)
  if (lines.length < 2) throw new Error(ERROR_INVALID_RESPONSE)

  let columns = lines[0].split(',').map((el) => {
    return el.trim().toLowerCase().replace(/ /g, '_')
  })

  if (columns.indexOf('isin_no') < 0) throw new Error(ERROR_INVALID_RESPONSE)

  let results = []
  lines.forEach((line, index) => {
    if (index == 0) return
    let data = {}
    let values = line.split(',')
    columns.forEach((el, idx) => { data[el] = values[idx] })
    results.push(data)
  })

  return results
}

/**
 * Get live BSE Indice data.
 * 
 * @param {Number} timeout Defaults to 5 * 1000
 * @return {Object}
 * @public
 */
BSE.indices = async function (timeout = TIMEOUT) {
  let res = await request(INDICE_URL, { timeout: timeout })
  if (!res) throw new Error(ERROR_BLANK_RESPONSE)

  try {
    return JSON.parse(res)[0]
  } catch (error) {
    throw new Error(ERROR_INVALID_RESPONSE)
  }
}

/**
 * Get live quote for a `scripCode`
 * 
 * @param {String} scripCode
 * @param {Number} timeout Defaults to 5 * 1000
 * @return {Object}
 * @public
 */
BSE.quote = async function (scripCode, timeout = TIMEOUT) {
  let res = await request(QUOTE_URL(scripCode), { timeout: timeout })
  if (!res) throw new Error(ERROR_BLANK_RESPONSE)

  try {
    return JSON.parse(res)
  } catch (error) {
    throw new Error(ERROR_INVALID_RESPONSE)
  }
}

/**
 * Get live quote and peer comparison for a `scripCode`
 * 
 * @param {String} scripCode
 * @param {Number} timeout Defaults to 5 * 1000
 * @return {Object}
 * @public
 */
BSE.quoteWithComparison = async function (scripCode, timeout = TIMEOUT) {
  let res = await request(QUOTE_PEER(scripCode), { timeout: timeout })
  if (!res) throw new Error(ERROR_BLANK_RESPONSE)

  try {
    return JSON.parse(res)
  } catch (error) {
    throw new Error(ERROR_INVALID_RESPONSE)
  }
}