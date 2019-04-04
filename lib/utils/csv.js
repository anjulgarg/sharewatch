/*!
 * sharewatch
 * Copyright(c) 2019 Anjul Garg <anjulgarg@live.com>
 * MIT Licensed
 */

'use strict'

/**
 * Service object
 * @public
 */
const CSV = Object.create(null)

/**
 * Module exports
 * @public
 */
module.exports = CSV


CSV.parse_columns = function (data, delimeter=',') {
  let lines = data.split(/[\r\n]+/)
  let columns = lines[0].split(delimeter).map((el) => {
    return el.trim().toLowerCase().replace(/ /g, '_')
  })
  return columns
}


CSV.parse_data = function (data, delimeter=',') {
  let results = []
  let columns = CSV.parse_columns(data, delimeter)
  let lines = data.split(/[\r\n]+/)
  lines.forEach((line, index) => {
    if (index == 0) return
    let data = {}
    let values = line.split(delimeter)
    columns.forEach((el, idx) => {
      if (el && el != '') data[el] = values[idx]
    })
    results.push(data)
  })
  return results
}