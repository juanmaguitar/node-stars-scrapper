let rp = require('request-promise');
let Promise = require('promise');

let getAdditionalData = require("./getAdditionalData.js");
let mergeAdditionalData = require("./mergeAdditionalData.js");

function getDetailsPages( aStarEvents ){

	let links = aStarEvents.reduce( (acc, item, i) => {
		acc.push(item.link);
		return acc;
	},[]);

	let promisesLinks = links.map( (urlLink, i) => rp(urlLink) )

	console.log ("🌟 parsing " + promisesLinks.length + " star events...")

	return Promise.all(promisesLinks)
						.then(getAdditionalData)
						.then( mergeAdditionalData.bind(null, aStarEvents) )

}

module.exports = getDetailsPages;