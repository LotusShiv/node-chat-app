const expect = require('expect');

const {isRealString} = require('./validation');

describe('isRealString', () => {
    var testString = '';

    it('should reject non-string values', () => {
        expect(isRealString(124)).toBe(false);
    });

    it('should reject string with only spaces', () => {
        testString = '    ';
        expect(isRealString(testString)).toBeFalsy();
    });

    it ('should allow string with non-space characters', () => {
        testString = ' kin# 4ow(';
        expect(isRealString(testString)).toBeTruthy();
    });
});