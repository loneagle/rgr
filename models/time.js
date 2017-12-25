var weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
var dateObj = new Date();
var month = dateObj.getUTCMonth() + 1; //months from 1-12
var day = dateObj.getUTCDate();
var year = dateObj.getUTCFullYear();

module.exports.dateNow = function () {
	return year + "/" + month + "/" + day; //+ '('+weekday[dateObj.getDay()]+')';
}

module.exports.timeNow = function () {
	var d = new Date();
	if (d.getMinutes()<10){
		return d.getHours() +":0"+d.getMinutes();
	}else {
		return d.getHours() +":"+d.getMinutes();
	}
}
