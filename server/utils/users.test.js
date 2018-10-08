const expect = require('expect');

const {Users} = require('./users');

describe('Users', () => {
    var userObj = new Users();
    beforeEach(() => {

        userObj.users = [{
            id:'1',
            name: 'Mike',
            room: 'Node Course'
         },
         {
            id: '2',
            name:'Caleb',
            room: 'ReactJS Course'
         },
         {
             id:'3',
             name:'Jen',
             room: 'Node Course'
         }
        ];
    });

    it('should add new user', () => {
        var user = {
            id:'123',
            name: 'Andrew',
            room: 'The Office Fans'
        };
        var resUser = userObj.addUser(user.id,
            user.name, user.room);
        expect(userObj.users).toContain(resUser);
    });

    it ('should return names for node course', () => {
        var results = userObj.getUserList(userObj.users[0].room);
        expect(results).toEqual(['Mike', 'Jen']);
    });

    it ('should return names for react course', () => {
        var results = userObj.getUserList(userObj.users[1].room);
        expect(results).toEqual(['Caleb']);
    });

    it ('should get user by id', () => {
        var user = userObj.getUser('1');
        //expect(user.id).toBe('1);
        //Or
        expect(user).toMatchObject(userObj.users[0]);
    });

    it ('should not find user by id', () => {
        var user = userObj.getUser('11');
        //expect(user).toBe(undefined);
        //Or
        expect(user).toBeFalsy();
    });

    it ('should remove user by id', () => {
        var user = userObj.removeUser('2');
        expect(userObj.users).not.toContain(user);
        expect(userObj.users.length).toBe(2);
    });

    it ('should not remove user', () => {
        var user = userObj.removeUser('22');
        //expect(user).toBe(undefined);
        expect(user).toBeFalsy();
    });
});