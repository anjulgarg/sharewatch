const assert = require('chai').assert
const expect = require('chai').expect
const NSE = require('../index').NSE
const BSE = require('../index').BSE


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
      return NSE.quote(symbol = 'INFY')
        .then((result) => {
          expect(result).to.be.a('Object')
          expect(result).to.contain.keys(['data'])
        })
    })
  })
})

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
      return BSE.quote(scripCode = '500209')
        .then((result) => {
          expect(result).to.be.a('Object')
          expect(result).to.contain.keys(['PrevClose'])
        })
    })
  })

  describe('#quoteWithComparison()', function () {
    it('should return a valid JSON Object', function () {
      return BSE.quoteWithComparison(scripCode = '500209')
        .then((result) => {
          expect(result).to.be.an('Object')
          expect(result).to.contain.keys(['Table'])
        })
    })
  })
})