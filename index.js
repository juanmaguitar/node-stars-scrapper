let rp = require('request-promise');
let fs = require('fs');
const util = require('util')

let getMainObject = require('./handlers/getMainObject')
let getDetailsPages = require('./handlers/getDetailsPages')

let start = (new Date()).getTime();
let urlBase = "https://in-the-sky.org/newscalyear.php?year=2016&maxdiff=1"
let limitDetailPages = process.env.LIMIT || 0;
var outputFile = 'data.json';

rp(urlBase)
	.then ( getMainObject.bind(null, limitDetailPages) )
	.then ( getDetailsPages )
	.then ( (data) => {
		require('./helpers/showTime')(start);
		console.dir( data, {depth: null, colors: true})

		fs.writeFile(outputFile, JSON.stringify(data, null, 4), function(err) {
		    if (err) throw (err);
		    console.log("💾 data saved in " + outputFile);
		});

	})
	.catch( (error) =>  console.log ("⚡️ Ups!!", error) )
