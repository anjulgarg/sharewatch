const assert = require('chai').assert
const expect = require('chai').expect
const NSE = require('../index').NSE
const BSE = require('../index').BSE


describe('NSE', function () {
  this.timeout(0)

  describe('#equityList()', function () {
    it('should return a valid Array', async function () {
      let result = await NSE.equityList()
      expect(result).to.be.an('Array').with.lengthOf.above(100)
    })
  })

  describe('#indices()', function () {
    it('should return a valid JSON Object', async function () {
      let result = await NSE.indices()
      expect(result).to.be.a('Object')
      expect(result).to.contain.keys(['mktOpen', 'data'])
    })
  })

  describe('#quote()', function () {
    it('should return a valid JSON Object', async function () {
      let result = await NSE.quote(symbol='INFY')
      expect(result).to.be.a('Object')
      expect(result).to.contain.keys(['data'])
    })
  })
})

describe('BSE', function () {
  this.timeout(0)

  describe('#equityList()', function () {
    it('should return a valid Array', async function () {
      let result = await BSE.equityList()
      expect(result).to.be.an('Array').with.lengthOf.above(100)
    })
  })

  describe('#indices()', function () {
    it('should return a valid JSON Object', async function () {
      let result = await BSE.indices()
      expect(result).to.be.a('Object')
      expect(result).to.contain.keys(['ltp', 'chg'])
    })
  })

  describe('#quote()', function () {
    it('should return a valid JSON Object', async function () {
      let result = await BSE.quote(scripCode='500209')
      expect(result).to.be.a('Object')
      expect(result).to.contain.keys(['PrevClose'])
    })
  })

  describe('#quoteWithComparison()', function () {
    it('should return a valid JSON Object', async function () {
      let result = await BSE.quoteWithComparison(scripCode='500209')
      expect(result).to.be.an('Object')
      expect(result).to.contain.keys(['Table'])
    })
  })
})