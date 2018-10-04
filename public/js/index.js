//call from client to open up the websocket connection
var socket = io(); 
//critical to communicating
//to listen to the server and pass data back and forth
socket.on('connect', function() {
    console.log('Connected to server - client');
});

//listeners are always separately by themselves as
//below
socket.on('disconnect', function() {
    console.log('Disconnected from the server');
});

//event listener on client
socket.on('newMessage', function(message){
    var li = jQuery('<li></li>');
    li.text(`${message.from}: ${message.text}`);
    jQuery('#messages').append(li);
});

socket.on('newLocationMessage', function(message){
    var li = jQuery('<li></li>');
    li.text(`${message.from}: `);
    
    var anchor = jQuery('<a target="_blank">My current location</a>');
    anchor.attr('href', message.url);
    li.append(anchor);
    jQuery('#messages').append(li);
});

 //Dom manipulation events
 jQuery('#message-form').on('submit',
  function(e) {
    //we need to use this event to override the default behavior
    e.preventDefault();
    socket.emit('createMessage', {
        from: 'User',
        text: jQuery('[name=message]').val()
    }, function(){
        //clear input after emiting
        jQuery('[name=message]').val('');
    });
 });

 var locationButton = jQuery('#send-location');
 locationButton.on('click', function(){
    if (!navigator.geolocation){
        alert('Geolocation not supported by your browser.');
    }
    else{
        navigator.geolocation.getCurrentPosition(function(position){
            socket.emit('createLocationMessage', {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            });
        }, function(){
            alert('Unable to fetch location.');
        });
    }
 });