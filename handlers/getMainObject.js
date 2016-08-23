let cheerio = require('cheerio');

function getMainObject( limit, html ){

	let $ = cheerio.load(html);
	let $linksEvents = $(".stripy td a");
	let eventsStars = [];

	$linksEvents.each( (index, elem) => {

			let $linkEvent = $(elem);

			let title = $(elem).text();
			let link = $(elem).attr("href");
			let id = link.split("?id=").pop();

			eventsStars.push({ id, title, link})

	})

	return  limit ? eventsStars.slice(0,limit) : eventsStars;

}

module.exports = getMainObject;