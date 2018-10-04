//Jan 1st 1970 00:00:00 am (UTC)
//0
//head into the past Dec 31st 1969 11:59:59 pm (UTC)
//-1000
//1000 is head into future - 1 sec into after
//Jan 1st 1970 00:00:01
const moment = require('moment');

// var date = moment();
// date.add(1, 'year').subtract(9, 'months');
// console.log(date.format('MMM Do YYYY'));

//Assignment current time 1:05 am
var date = moment();
date = moment(1234);
console.log(date.format('h:mm a'));

var someTimestamp = moment().valueOf();
console.log('Timestamp in milliseconds since the unix epic',someTimestamp);
