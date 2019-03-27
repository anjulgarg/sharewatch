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
const request = require('request-promise')

/**
 * Module settings
 * @private
 */
const HOST_URL = 'https://www.nseindia.com'
const EQUITY_LIST_URL = `${HOST_URL}/content/equities/EQUITY_L.csv`
const INDICE_URL = `${HOST_URL}/homepage/Indices1.json`
const QUOTE_URL = (symbol) => `${HOST_URL}/live_market/dynaContent/live_watch/get_quote/GetQuote.jsp?symbol=${symbol}`
const TIMEOUT = 5 * 1000
const ERROR_BLANK_RESPONSE = 'blank server response'
const ERROR_INVALID_RESPONSE = 'invalid server response'

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
NSE.equityList = async function (timeout = TIMEOUT) {
  let res = await request.get(EQUITY_LIST_URL, { timeout: timeout })
  if (!res) throw new Error(ERROR_BLANK_RESPONSE)

  let lines = res.split(/[\r\n]+/)
  if (lines.length < 2) throw new Error(ERROR_INVALID_RESPONSE)

  let columns = lines[0].split(',').map((el) => {
    return el.trim().toLowerCase().replace(/ /g, '_')
  })

  if (columns.indexOf('symbol') < 0) throw new Error(ERROR_INVALID_RESPONSE)

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
 * Get live NSE Indices like NIFTY50 index value.
 * 
 * @param {Number} timeout Defaults to 5 * 1000
 * @return {Object}
 * @public
 */
NSE.indices = async function (timeout = TIMEOUT) {
  let res = await request(INDICE_URL, { timeout: timeout })
  if (!res) throw new Error(ERROR_BLANK_RESPONSE)

  try {
    return JSON.parse(res)
  } catch (error) {
    throw new Error(ERROR_INVALID_RESPONSE)
  }
}

/**
 * Get live quote for a `symbol`
 * 
 * @param {String} symbol
 * @param {Number} timeout Defaults to 5 * 1000
 * @return {Object}
 * @public
 */
NSE.quote = async function (symbol, timeout = TIMEOUT) {
  let res = await request(QUOTE_URL(symbol), { timeout: timeout })
  if (!res) throw new Error(ERROR_BLANK_RESPONSE)

  let body = res.replace(/(\r\n|\n|\r)/gm, '')
  let rp = new RegExp(/<div id="responseDiv" style="display:none">(.*?)<\/div>/)
  let matches = body.match(rp)
  if (!matches) return {}

  try {
    return JSON.parse(matches[1])
  } catch (error) {
    throw new Error(ERROR_INVALID_RESPONSE)
  }
}