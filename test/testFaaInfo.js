'use strict'

var chai = require('chai');

var CAP = require('chai-as-promised');

chai.use(CAP);

var expect = chai.expect;

var FAADataHelper = require('../FAADataHelper.js');

chai.config.includeStack = true;

describe('FAADataHelper', function() {
	var subject = new FAADataHelper();
	var airportCode;
	describe('#getAirportStatus', function() {
		context('with a valid airport code', function() {
			it('returns matching airport code', function() {
				airportCode = 'SFO';
				var value = subject.requestAirportStatus(airportCode).then(function(obj) {
					return obj.IATA;
				});
				return expect(value).to.eventually.eq(airportCode);
			});
		});
		context('with an invalid airport code', function() {
			it('returns invalid airport code', function() {
				airportCode = 'PUNKYBREWSTER';
				return expect(subject.requestAirportStatus(airportCode)).to.be.rejectedWith(Error);
			})
		})
	});
});