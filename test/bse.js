'use strict'

const { it } = require('mocha')
const { expect } = require('chai')
const BSE = require('../index').BSE

describe('BSE', function () {
    this.timeout(0)
  
    describe('#equityList()', function () {
      it('should return a valid Array', function () {
        return BSE.equityList()
          .then((result) => {
            expect(result).to.be.an('Array').with.lengthOf.above(100)
          })
      })
    })
  
    describe('#indices()', function () {
      it('should return a valid JSON Object', function () {
        return BSE.indices()
          .then((result) => {
            expect(result).to.be.a('Object')
            expect(result).to.contain.keys(['ltp', 'chg'])
          })
      })
    })
  
    describe('#quote()', function () {
      it('should return a valid JSON Object', function () {
        return BSE.quote('500209')
          .then((result) => {
            expect(result).to.be.a('Object')
            expect(result).to.contain.keys(['PrevClose'])
          })
      })
    })
  
    describe('#quoteWithComparison()', function () {
      it('should return a valid JSON Object', function () {
        return BSE.quoteWithComparison('500209')
          .then((result) => {
            expect(result).to.be.an('Object')
            expect(result).to.contain.keys(['Table'])
          })
      })
    })

    describe('#bhavcopy()', function () {
      it('should return an Array of Equities', function () {
        return BSE.bhavcopy('2018-02-02')
          .then((result) => {
            expect(result).to.be.an('Array')
            expect(result[0]).to.be.an('Object')
            expect(result[0]).to.contain.keys(['sc_code', 'isin_code'])
          })
      })
    })
  })