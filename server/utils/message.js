const moment = require('moment');

var generateMessage = (from, text) =>{
    return{
        from,
        text,
        createdAt: moment().valueOf()
        //createdAt: moment().format('h:mm a') //new Date().getTime()
    };
};

var generateLocationMessage = (from, latitude, longitude) => {
    return {
        from: from,
        url:`https://www.google.com/maps?q=${latitude},${longitude}`,
        //createdAt: moment().format('h:mm a')
        createdAt: moment().valueOf()
    };
};

module.exports = {
    generateMessage,
    generateLocationMessage
};
