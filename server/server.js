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
    //Disconnect built-in event
    socket.on('disconnect', () =>{
        console.log('User disconnected - server')
    });
});

//on disconnect - like connection getting dropped
// io.on('disconnect', (socket) => {
//     console.log('Server- New user disconnected');
// });
//app.listen behind the scene is actually calling a
//createServer
// app.listen(port, () => {
//     console.log(`Server is up on port ${port}`);
// });

//instead we do
server.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});