'use strict'

var _ = require('lodash');

var rp = require('request-promise');

var ENDPOINT = 'https://services.faa.gov/airport/status/';

function FAADataHelper() {};

FAADataHelper.prototype.requestAirportStatus = function(airportCode) {
	return this.getAirportStatus(airportCode).then(
		  function(response) {
		  	console.log('success - recieved airport info for ' + airportCode);
		    return response.body;
		  }
		)
};

FAADataHelper.prototype.getAirportStatus = function(airportCode) {
	var options = {
		method: 'GET',
		uri: ENDPOINT + airportCode,
		resolveWithFullResponse: true,
		json: true
	}
	return rp(options);
};

FAADataHelper.prototype.formatAirportStatus = function(airportStatus) {
	var weather = _.template('The current weather conditions are ${weather}, ${temp} and wind ${wind}.')({
		weather: airportStatus.weather.weather,
		temp: airportStatus.weather.temp,
		wind: airportStatus.weather.wind
	});
	if(airportStatus.delay === 'true') {
		var template = _.template('There is currently a delay for ${airport}. ' + 'The average delay time is ${delayTime}. ' + 'Delay is because of the following: ${delayReason}. ${weather}')
		return template({
			airport: airportStatus.name,
			delayTime: airportStatus.status.avgDelay,
			delayReason: airportStatus.status.reason,
			weather: weather
		});
	} else {
		// no delay
		return _.template('There is currently no delay at ${airport}. ${weather}')({
			airport: airportStatus.name,
			weather: weather
		});
	}
};

module.exports = FAADataHelper;
