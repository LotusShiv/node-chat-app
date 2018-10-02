const path = require('path');
const http = require('http');
const express = require('express');
const port = process.env.PORT || 3000;
const socketIO = require('socket.io');

const publicPath = path.join(__dirname, '/../public');
var app = express();
var server = http.createServer(app);
var io = socketIO(server); //set up the socketio with the webserver

//we configure express static middleware - with the
//serving path
app.use(express.static(publicPath));

//built in events
//connection
io.on('connection', (socket) => {
    console.log('Server - New user connected');
    
    //everytime a user connects to the app this message
    //will get printed
    socket.broadcast.emit('newMessage', 
    {
        text: 'New user joined',
        from: 'Admin',
        createdAt: new Date().getTime()
    });

    //NOTE: all the events have to written within 
    //      the io.on('connection', ...) block
    
    //Custom events
    //messages
    //newMessage - emitted on server
    // socket.emit('newMessage',{
    //     from: 'joe@example.com',
    //     to:'pankaja@example.com;andy@example.com',
    //     text:'NodeJS users meeting Oct. 20, 2018 at Middlesex Country College',
    //     createdAt: 887129
    // });
    //socket.emit emits to a single connection
    //io.emit emits to every single connection to the server
    //hence we comment out the socket.emit event above

    //from Admin to the new user joined
    socket.emit('newMessage', {
        text:'Welcome to the chat app',
        from: 'Admin',
        createdAt: new Date().getTime()
    });

    //createMessage listener - on the server
    socket.on('createMessage', (message) => {
        console.log('createMessage', message);
        
        io.emit('newMessage', {
            from: message.from,
            text: message.text,
            createdAt: new Date().getTime()
        });
        // //This sends to everybody but this socket
        // //i.e. the current user connection
        // socket.broadcast.emit('newMessage', {
        //     from: message.from,
        //     text: message.text,
        //     createdAt: new Date().getTime()
        // });
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