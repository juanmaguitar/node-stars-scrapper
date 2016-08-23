function showTime(start) {

	let currentTime = (new Date()).getTime();
	let spentTime = currentTime-start;

	let totalSec = spentTime / 1000;
	let hours = parseInt( totalSec / 3600 ) % 24;
	let minutes = parseInt( totalSec / 60 ) % 60;
	let seconds = totalSec % 60;

	console.log ("🕐 parsing time = " + minutes + " min " + seconds + " sec")

}

module.exports = showTime;