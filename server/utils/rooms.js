class Rooms{
    constructor(){
        this.rooms = [];
    }

    addChatRoom(id, name){
        var chatRoom = {
            id,
            name
        };
        var room = this.getChatRoom(name);
        if (!room)
            this.rooms.push(chatRoom);
        return chatRoom;
    }

    removeChatRoom(name){
        var chatRoom = this.getChatRoom(name);
        if (!chatRoom)
            return undefined;
        this.rooms = this.rooms.filter((chatRoom) => chatRoom.name.toLowerCase() !== name.toLowerCase());
        return chatRoom;
    }

    getChatRoom(name){
        var rooms = this.rooms.filter((chatRoom) => chatRoom.name.toLowerCase() === name.toLowerCase());
        return rooms[0];
    }

    getChatRooms(){
        var roomsArray = [];
        roomsArray = this.rooms;
        //roomsArray = this.rooms.map(room => room.name);
        return roomsArray;
    }
}

module.exports = {
    Rooms
}