//call from client to open up the websocket connection
var socket = io(); 
//critical to communicating
//to listen to the server and pass data back and forth
socket.on('connect', function() {
    console.log('Connected to server - client');
    //only way the listener events are going to emit is
    //by calling socket.emit for those listeners
    // socket.emit('createEmail', {
    //     to: 'jen@example.com',
    //     text: 'Hey Jen this is Andrew.'
    // });

    //createMessage - emitted on client
    socket.emit('createMessage', {
        from: 'joe@example.com',
        text:'NodeJS users meeting Oct. 20, 2018 at Middlesex Country College',
    });
});

//listeners are always separately by themselves as
//below
socket.on('disconnect', function() {
    console.log('Disconnected from the server');
});

// //listen to custom event (from server emitted in server.js)
// socket.on('newEmail', function(email){
//     console.log('New Email', email);
// });

//event listener on client
socket.on('newMessage', function(message){
    console.log('New message from server to client', message);
});