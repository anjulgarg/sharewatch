'use strict'

const fs = require('fs')
const { it } = require('mocha')
const { expect } = require('chai')
const NSE = require('../index').NSE

describe('NSE', function () {
  this.timeout(0)

  describe('#equityList()', function () {
    it('should return a valid Array', function () {
      return NSE.equityList()
        .then((result) => {
          expect(result).to.be.an('Array').with.lengthOf.above(100)
        })
    })
  })

  describe('#indices()', function () {
    it('should return a valid JSON Object', function () {
      return NSE.indices()
        .then((result) => {
          expect(result).to.be.a('Object')
          expect(result).to.contain.keys(['mktOpen', 'data'])
        })
    })
  })

  describe('#quote()', function () {
    it('should return a valid JSON Object', function () {
      return NSE.quote('INFY')
        .then((result) => {
          expect(result).to.be.a('Object')
          expect(result).to.contain.keys(['data'])
        })
    })
  })

  describe('#sectorDetails()', function () {
    it('should return a valid JSON Object', function () {
      return NSE.sectorDetails('INFY')
        .then((result) => {
          expect(result).to.be.a('Object')
          expect(result).to.contain.keys(['sector'])
        })
    })
  })

  describe('#bhavcopy()', function () {
    it('should return an Array of Equities', function () {
      return NSE.bhavcopy('2018-02-02')
        .then((result) => {
          expect(result).to.be.an('Array')
          expect(result[0]).to.be.an('Object')
          expect(result[0]).to.contain.keys(['symbol', 'open', 'close'])
        })
    })
  })
})