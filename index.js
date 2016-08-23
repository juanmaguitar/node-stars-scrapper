let express = require('express');
let rp = require('request-promise');

let getMainObject = require('./handlers/getMainObject')
let getDetailsPages = require('./handlers/getDetailsPages')

let app = express();
let PORT = process.env.PORT || '8081';

app.get('/stars/visible-naked-eye', ( req, res ) => {

	let start = (new Date()).getTime();
	let urlBase = "https://in-the-sky.org/newscalyear.php?year=2016&maxdiff=1"
	let limitDetailPages = (req.query && req.query.limit) ? req.query.limit : 0;

	rp(urlBase)
		.then ( getMainObject.bind(null, limitDetailPages) )
		.then ( getDetailsPages )
		.then ( (data) => {
			require('./helpers/showTime')(start);
			res.json(data);
		})
		.catch( (error) =>  console.log ("⚡️ Ups!!", error) )

})

app.listen(PORT, () => console.log('Magic happens on port ' + PORT) );