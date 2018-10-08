//addUser(id, name, room)
//removeUser(id)
//getUser(id)
//getUserList(room)
//We are going to define a Users class and we will use 
//an instance of the class to define all 
//our methods listed above
class Users{
    constructor(){
        this.users = [];
    }

    addUser(id, name, room){
        var user = {
            id,
            name,
            room
        };
        this.users.push(user);
        return user;
    }

    removeUser(id){
        var user = this.getUser(id);
        if (!user)
            return undefined;
        this.users = this.users.filter((user) => user.id !== id);
        return user;
    }

    getUser(id){
        var users = this.users.filter((user) => user.id === id);
        return users[0];
    }

    getUserList(room){
        // var users = this.users.filter((user) => {
        //     return user.room === room;
        // });
        var users = this.users.filter((user) => user.room === room);
        var namesArray = users.map(user => user.name);
        return namesArray;
    }
}

module.exports = {
    Users
};
