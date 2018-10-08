const path = require('path');
const http = require('http');
const express = require('express');
const port = process.env.PORT || 3000;
const socketIO = require('socket.io');

const {generateMessage,
    generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');
const {Users} = require('./utils/users');

const publicPath = path.join(__dirname, '/../public');
var app = express();
var server = http.createServer(app);
var io = socketIO(server); //set up the socketio with the webserver
var users = new Users(); //so we can call all of the Users methods
                         //to manipulate the data

//we configure express static middleware - with the
//serving path
app.use(express.static(publicPath));

//connection
io.on('connection', (socket) => {
    console.log('Server - New user connected');
    
    socket.on('join', (params, callback) => {
        if(!isRealString(params.name) 
        || !isRealString(params.room)){
            callback('Name and room name are required');
        }

        //using socketIO - join method to join a chat room
        socket.join(params.room);
        //Just to make sure that there is no user from any potential 
        //rooms with this socketId
        users.removeUser(socket.id);
        users.addUser(socket.id, params.name, params.room);
        //Now we can emit that event updateUserList
        io.to(params.room).emit('updateUserList', users.getUserList(params.room));

        //we are going to have two calls here
        socket.emit('newMessage', 
            generateMessage('Admin', 'Welcome to the chat app'));
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
   
    //createMessage listener - on the server
    // to send event acknowlegement to server
    // now in order to send acknowledgement back to client
    // we need a callback function here on the listener as well
    socket.on('createMessage', (message, callback) => {
        var user = users.getUser(socket.id);
        if (user && isRealString(message.text)){
            //io.emit('newMessage', generateMessage(user.from, message.text));
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
            io.to(user.room).emit('updateUserList', users.getUserList(user.room));
            io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left.`));
        }
        console.log('User disconnected - server');
    });
});

//instead we do
server.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});