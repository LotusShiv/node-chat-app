const path = require('path');
const http = require('http');
const express = require('express');
const port = process.env.PORT || 3000;
const socketIO = require('socket.io');

const {generateMessage,
    generateLocationMessage} = require('./utils/message');

const publicPath = path.join(__dirname, '/../public');
var app = express();
var server = http.createServer(app);
var io = socketIO(server); //set up the socketio with the webserver

//we configure express static middleware - with the
//serving path
app.use(express.static(publicPath));

//connection
io.on('connection', (socket) => {
    console.log('Server - New user connected');
    
    //everytime a user connects to the app this message
    //will get printed
    socket.broadcast.emit('newMessage', 
        generateMessage('Admin','New user joined'));
    
    //from Admin to the new user joined
    socket.emit('newMessage', 
      generateMessage('Admin', 'Welcome to the chat app'));
    
    //createMessage listener - on the server
    // to send event acknowlegement to server
    // now in order to send acknowledgement back to client
    // we need a callback function here on the listener as well
    socket.on('createMessage', (message, callback) => {
        console.log('createMessage', message);
        
        io.emit('newMessage', 
            generateMessage(message.from, message.text));
        
        //We can pass as an object callback({..})
        // that way we can send any number of properties to be
        // in the object, or just a string or nothing at all..
        callback();
    });

    socket.on('createLocationMessage', (coords) => {
        //io.emit('newMessage', 
        io.emit('newLocationMessage',
        generateLocationMessage('Admin', 
        coords.latitude,coords.longitude));
    });
    //Disconnect built-in event
    socket.on('disconnect', () =>{
        console.log('User disconnected - server');
    });
});

//instead we do
server.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});