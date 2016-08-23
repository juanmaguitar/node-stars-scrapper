var _ = require('underscore');

function mergeAdditionalData( aStarEvents, additionalData ) {

	additionalData.forEach( (oData,i) => _.extend( aStarEvents[i], oData) )
	return aStarEvents;

}

module.exports = mergeAdditionalData;