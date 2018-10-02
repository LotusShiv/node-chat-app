//call from client to open up the websocket connection
var socket = io(); 
//critical to communicating
//to listen to the server and pass data back and forth
socket.on('connect', function() {
    console.log('Connected to server - client');
    //only way the listener events are going to emit is
    //We commented out socket.emit because we used the
    //io.emit on server.js within the createMessage
    //createMessage - emitted on client
    // socket.emit('createMessage', {
    //     from: 'joe@example.com',
    //     text:'NodeJS users meeting Oct. 20, 2018 at Middlesex Country College',
    // });
});

//listeners are always separately by themselves as
//below
socket.on('disconnect', function() {
    console.log('Disconnected from the server');
});

//event listener on client
socket.on('newMessage', function(user){
    console.log('newMessage');
    console.log(user);
});
