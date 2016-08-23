let cheerio = require('cheerio');

function getAdditionalData( dataPromises ) {

	let additionalData = [];

	dataPromises.forEach( ( html, i) => {

		let $ = cheerio.load(html);
		let $paragraphsDesc = $(".newsbody p");
		let aDesc = [];

		$paragraphsDesc.each( (i, p) =>  aDesc.push( $(p).text() ) )
		additionalData.push ( { desc: aDesc.join('\n') });

	})

	return additionalData;

}

module.exports = getAdditionalData;