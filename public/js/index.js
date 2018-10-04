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
    var formattedTime = moment(message.createdAt).format('h:mm a');
    var li = jQuery('<li></li>');
    li.text(`${message.from} ${formattedTime}: ${message.text}`);
    jQuery('#messages').append(li);
});

socket.on('newLocationMessage', function(message){
    var formattedTime = moment(message.createdAt).format('h:mm a');
    var li = jQuery('<li></li>');
    li.text(`${message.from} ${formattedTime}: `);
    
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
    var messageTextbox = jQuery('[name=message]');

    socket.emit('createMessage', {
        from: 'User',
        text: messageTextbox.val()
    }, function(){
        //clear input after emiting
        messageTextbox.val('');
    });
 });

 var locationButton = jQuery('#send-location');
 locationButton.on('click', function(){
    if (!navigator.geolocation){
        return alert('Geolocation not supported by your browser.');
    }
    locationButton.attr('disabled', 'disabled')
    .text('Sending location');
    
    navigator.geolocation.getCurrentPosition(function(position){
        locationButton.removeAttr('disabled')
        .text('Send location');

        socket.emit('createLocationMessage', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        });
    }, function(){
        locationButton.removeAttr('disabled')
        .text('Send location');
        alert('Unable to fetch location.');
    });
 });