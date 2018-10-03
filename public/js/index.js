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
socket.on('newMessage', function(message){
    //console.log('newMessage', message);
    var li = jQuery('<li></li>');
    li.text(`${message.from}: ${message.text}`);
    jQuery('#messages').append(li);
});

//event emitter on client 
// - to send acknowledgement to server
// - to receive acknowledgement from server
// socket.emit('createMessage', {
//     from: 'Frank',
//     text: 'Hi'
//   }, 
//   //add callback function to receive data if any
//   function(data){
//      console.log('Got it', data);
//  });

 //Dom manipulation events
 jQuery('#message-form').on('submit',
  function(e) {
    //we need to use this event to override the default behavior
    e.preventDefault();
    socket.emit('createMessage', {
        from: 'User',
        text: jQuery('[name=message]').val()
    }, function(){

    });
 });