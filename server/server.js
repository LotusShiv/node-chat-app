const path = require('path');
const http = require('http');
const express = require('express');
const port = process.env.PORT || 3000;
const socketIO = require('socket.io');

const {generateMessage,
    generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');
const {Users} = require('./utils/users');
const {Rooms} = require('./utils/rooms');

const publicPath = path.join(__dirname, '/../public');
var app = express();
var server = http.createServer(app);
var io = socketIO(server); //set up the socketio with the webserver
var users = new Users(); //so we can call all of the Users methods
                         //to manipulate the data
var rooms = new Rooms();

//we configure express static middleware - with the
//serving path
app.use(express.static(publicPath));

//connection
io.on('connection', (socket) => {
    socket.on('join', (params, callback) => {
        console.log('Server - New user connected');

        if(!isRealString(params.name) 
        || !isRealString(params.room)){
            callback('Name and room name are required');
        }
        if(users.getUserList(params.room).includes(params.name)){
            //var err = 'User name exists. Enter a different one.';
            console.log('join check 2');
            //callback('User name exists. Enter a different one.');
        }

        //using socketIO - join method to join a chat room
        socket.join(params.room);
        //Just to make sure that there is no user from any potential 
        //rooms with this socketId
        
        users.addUser(socket.id, params.name, params.room);

        //Now we can emit that event updateUserList
        io.to(params.room).emit('updateUserList', users.getUserList(params.room));

        //also add a room if applicable
        //update room list
        rooms.addChatRoom(socket.id, params.room);
        io.emit('updateChatRoomList', rooms.getChatRooms());

        //we are going to have two calls here
        socket.emit('newMessage', 
            generateMessage('Admin', `Welcome to "${params.room}" chat room!`));
        //instead of broadcasting to every user 
        // a new user has joined
        //socket.broadcast.emit('newMessage', 
        //  generateMessage('Admin','New user joined'));
        //we are broadcasting only to those users that 
        //joined this chat room
        socket.broadcast.to(params.room).emit('newMessage', 
            generateMessage('Admin',`${params.name} has joined`));

        callback();
    });
   
    socket.on('getChatRooms', () => {
        var chatRooms = rooms.getChatRooms();
        //console.log('Chatrooms ', chatRooms);
        io.emit('updateChatRoomList', chatRooms);
    });

    socket.on('checkPersonNameInRoom', (nameParams, callback) => {
        const name = nameParams.name;
        const room = nameParams.room;
        const nameTextbox = nameParams.nameTextbox;
        //console.log('(server) room, name', room, name);
        var message = 'NA';
        if(users.getUserList(room).includes(name)){
            message = 'User name exists. Enter a different one.';
            //callback(err);
            console.log('(server) users.getUserList - ', room, name, message);
            //io.to(socket.id).emit('chatPersonCheckMessage', message);
            //io.emit('chatPersonCheckMessage', message);

            socket.removeAllListeners('join');
            socket.removeAllListeners('disconnect');
        }
        callback(message);
    });

    //createMessage listener - on the server
    // to send event acknowlegement to server
    // now in order to send acknowledgement back to client
    // we need a callback function here on the listener as well
    socket.on('createMessage', (message, callback) => {
        var user = users.getUser(socket.id);
        if (user && isRealString(message.text)){
            io.to(user.room).emit('newMessage', 
                generateMessage(user.name, message.text));
        }    
        //We can pass as an object callback({..})
        // that way we can send any number of properties to be
        // in the object, or just a string or nothing at all..
        callback();
    });

    socket.on('createLocationMessage', (coords) => {
        var user = users.getUser(socket.id);
        if (user) {
            io.to(user.room).emit('newLocationMessage',
              generateLocationMessage(user.name, 
              coords.latitude,coords.longitude));
        }
    });

    //Disconnect built-in event
    socket.on('disconnect', () =>{
        var user = users.removeUser(socket.id);

        if (user){
            var currRoomUsers = users.getUserList(user.room);

            io.to(user.room).emit('updateUserList', users.getUserList(user.room));
            io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left.`));
            if (currRoomUsers.length === 0){
                //then remove that room
                var chatRoom = rooms.removeChatRoom(user.room);
                console.log('Chatroom removed ', chatRoom);
                if (chatRoom){
                    var chatRooms = rooms.getChatRooms();
                    io.emit('updateChatRoomList', chatRooms);
                }
            }
        }
        
        console.log('User disconnected - server');
    });
});

//instead we do
server.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});