#!/usr/bin/env node

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
const program = require('commander')
const packageFile = require('../package.json')
const NSE = require('../lib/services/nse')
const BSE = require('../lib/services/bse')

program
  .version(packageFile['version'])

program
  .command('equity-list')
  .description('Returns an Array containing all the listed Equities for a platform')
  .option('-p, --platform [platform]', 'Valid values are `nse` or `bse`', /^(nse|bse)$/i, null)
  .action(function (options) {
    let service
    switch (options.platform) {
      case 'nse':
        service = NSE.equityList()
        break
      case 'bse':
        service = BSE.equityList()
        break
      default:
        console.error('Invalid options. \nSee --help for a list of available options.')
        process.exit(1)
        break
    }

    service
      .then((result) => { console.log(JSON.stringify(result)) })
      .catch((err) => {
        console.error(err)
        process.exit(1)
      })
  })


program
  .command('indices')
  .description('Returns indice data for a platform')
  .option('-p, --platform [platform]', 'Valid values are `nse` or `bse`', /^(nse|bse)$/i, null)
  .action(function (options) {
    let service
    switch (options.platform) {
      case 'nse':
        service = NSE.indices()
        break
      case 'bse':
        service = BSE.indices()
        break
      default:
        console.error('Invalid options. \nSee --help for a list of available options.')
        process.exit(1)
        break
    }

    service
      .then((result) => { console.log(JSON.stringify(result)) })
      .catch((err) => {
        console.error(err)
        process.exit(1)
      })
  })


program
  .command('quote')
  .description('Returns the Quote for an Equity for a platform')
  .option('-p, --platform [platform]', 'Valid values are `nse` or `bse`', /^(nse|bse)$/i, 'nse')
  .option('-c, --codes [codes]', 'Space separated scrip codes for a BSE stock OR ISIN codes for an NSE stock.')
  .action(function (options) {
    if (!options.codes) {
      console.error('Invalid options. \nSee --help for a list of available options.')
      process.exit(1)
    }

    let codes = options.codes.replace(/\s+/, '').split(',')

    let service
    switch (options.platform) {
      case 'nse':
        service = NSE.quote
        break
      case 'bse':
        service = BSE.quote
        break
      default:
        console.error('Invalid options. \nSee --help for a list of available options.')
        process.exit(1)
    }

    let promises = []
    codes.forEach((code) => {
      promises.push(service(code))
    })

    Promise.all(promises)
      .then((result) => { console.log(JSON.stringify(result)) })
      .catch((err) => {
        console.error(err)
        process.exit(1)
      })
  })


program
  .command('bhavcopy')
  .description('Returns the bhavcopy for a platform and date')
  .option('-p, --platform [platform]', 'Valid values are `nse` or `bse`', /^(nse|bse)$/i, null)
  .option('-d, --date [date]', 'Date in YYYY-MM-DD format')
  .action(function (options) {

    if (!options.date) {
      console.error('Invalid options. \nSee --help for a list of available options.')
      process.exit(1)
    }

    let service
    switch (options.platform) {
      case 'nse':
        service = NSE.bhavcopy
        break
      case 'bse':
        service = BSE.bhavcopy
        break
      default:
        console.error('Invalid options. \nSee --help for a list of available options.')
        process.exit(1)
        break
    }

    service(options.date)
      .then((result) => { console.log(JSON.stringify(result)) })
      .catch((err) => {
        console.error(err)
        process.exit(1)
      })
  })


program
  .parse(process.argv)