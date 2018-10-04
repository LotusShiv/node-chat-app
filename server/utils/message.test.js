const expect = require('expect');

var {generateMessage, generateLocationMessage} = require('./message');
//we need just plain synchronous tests
describe('generateMessage', () => {
    var from = '', text = '';
    var res = null;
    it('should generate correct message object', () =>{
        from = 'Admin';
        text = 'Welcome to chat app';
        res = generateMessage(from, text);

        var resObj = {from: res.from, text: res.text};

        expect(resObj).toMatchObject({
            from,
            text
        })
        expect(typeof res.createdAt).toBe('number');
        //expect(typeof res.createdAt).toBe('string');
    });
});

describe('generateLocationMessage', () => {
    it('should generate correct location message object', () => {
        from = 'Deb';
        var lat = 39.9367117;
        var lng = -75.1708349;
        var url = `https://www.google.com/maps?q=${lat},${lng}`
        res = generateLocationMessage(from, lat, lng);
        
        //expect(typeof res.createdAt).toBe('string');
        expect(typeof res.createdAt).toBe('number');
        var resObj = {from: res.from, url: res.url};
        expect(resObj).toMatchObject({
            from,
            url
        });

    });
});