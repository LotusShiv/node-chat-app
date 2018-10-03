const path = require('path');
const http = require('http');
const express = require('express');
const port = process.env.PORT || 3000;
const socketIO = require('socket.io');

const {generateMessage} = require('./utils/message');

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
    socket.on('createMessage', (message) => {
        console.log('createMessage', message);
        
        io.emit('newMessage', 
            generateMessage(message.from, message.text));
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