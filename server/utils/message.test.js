const expect = require('expect');

var {generateMessage} = require('./message');

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
    });
});