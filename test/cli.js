'use strict'

const { it } = require('mocha')
const { expect } = require('chai')
const exec = require('child_process').exec


const cliPath = './bin/sharewatch.js'
const options = { maxBuffer: 1024 * 500 }


describe('Sharewatch CLI', function () {
  this.timeout(0)

  describe('#equity-list', function () {
    it('should return a valid Array', function (done) {
      exec(`${cliPath} -p nse equity-list`, options, (err, stdout, stderr) => {
        let result = JSON.parse(stdout)
        expect(result).to.be.an('Array').with.lengthOf.above(100)
        done()
      })
    })
  })

  describe('#indices', function () {
    it('should return valid indice data', function (done) {
      exec(`${cliPath} -p nse indices`, options, (err, stdout, stderr) => {
        let result = JSON.parse(stdout)
        expect(result).to.be.a('Object')
        done()
      })
    })
  })

  describe('#quote', function () {
    it('should return valid indice data', function (done) {
      exec(`${cliPath} -p nse -c 'infy, bhel' quote`, options, (err, stdout, stderr) => {
        let result = JSON.parse(stdout)
        expect(result).to.be.an('Array').with.lengthOf(2)
        done()
      })
    })
  })

  describe('#bhavcopy', function () {
    it('should return valid indice data', function (done) {
      exec(`${cliPath} -p nse -d 2019-01-01 bhavcopy`, options, (err, stdout, stderr) => {
        let result = JSON.parse(stdout)
        expect(result).to.be.an('Array').with.lengthOf.above(100)
        done()
      })
    })
  })
})

