var express = require('express');
var request = require('request');
var cheerio = require('cheerio');
var path = require('path');
var rp = require('request-promise');
var Promise = require('promise');
var url = require('url');
var _ = require('underscore');
var start, finish;

var app = express();

var publicFolder = path.join(__dirname, 'public');

app.get('/stars/visible-naked-eye', function( req, res ) {

	start = (new Date()).getTime();
	var urlBase = "https://in-the-sky.org/newscalyear.php?year=2016&maxdiff=1"

	function getMainObject( html ){

		var $ = cheerio.load(html);
		var $linksEvents = $(".stripy td a");
		var eventsStars = [];

		console.log ("🌟 " + $linksEvents.length + " star events parsing in progress...");

		$linksEvents.each(function(index, elem) {

				var $linkEvent = $(elem);

				var title = $(elem).text();
				var linkDetails = $(elem).attr("href");
				var id = linkDetails.split("?id=").pop();
				eventsStars.push({
					id: id,
					title : title,
					link : linkDetails
				})


		})

		return eventsStars;
	}

	function getDetails( aStarEvents ){

		var links = aStarEvents.reduce(function(acc, item, i){
			acc.push(item.link);
			return acc;
		},[]);

		var promises = links.map(function(urlLink, i) {
			var oUrl = url.parse(urlLink);
			var options = {
			    url: urlLink,
			    simple: false,
			    headers: {
			       'Host': oUrl.host
			    }
			}

			return rp(options);
		})
		return Promise.all(promises)
						.then(function (dataPromises) {

							var additionalData = [];

							dataPromises.forEach( function( html, i) {
								var $ = cheerio.load(html);
								var $paragraphsDesc = $(".newsbody p");
								var aDesc = [];
								$paragraphsDesc.each(function(i, p){
									aDesc.push( $(p).text() )
								})

								additionalData.push ( {
									desc: aDesc.join('\n')
								});
							})
							return additionalData;
						})
						.then(function( additionalData ) {

							additionalData.forEach(function(oData,i) {
								_.extend( aStarEvents[i], oData)
							})
							return aStarEvents;
						})

	}

	function returnJson( data ) {

		var currentTime = (new Date()).getTime();
		var spentTime = currentTime-start;

		var totalSec = spentTime / 1000;
		var hours = parseInt( totalSec / 3600 ) % 24;
		var minutes = parseInt( totalSec / 60 ) % 60;
		var seconds = totalSec % 60;

		console.log ("🕐 parsing time = " + minutes + ":" + seconds)


		res.json(data);
	}

	rp(urlBase)
		.then ( getMainObject )
		.then ( getDetails )
		.then ( returnJson )
		.catch( function(error) {
			console.log ("⚡️ Ups!!")
			console.log (error)
		})


})

app.use( express.static(publicFolder) );

app.listen(process.env.PORT || '8081');

console.log('Magic happens on port 8081');

exports = module.exports = app;