//call from client to open up the websocket connection
var socket = io(); 

function scrollToBottom(){
    var messages = jQuery('#messages');
    var newMessage = messages.children('li');

    var clientHeight = messages.prop('clientHeight');
    var scrollTop = messages.prop('scrollTop');
    var scrollHeight = messages.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev()
                            .innerHeight();
    if (clientHeight + scrollTop 
        + newMessageHeight + lastMessageHeight >= scrollHeight){
         messages.scrollTop(scrollHeight);
    }
}

function getFormattedTimestamp(time, format){
    return moment(time).format(format);
}

//critical to communicating
//to listen to the server and pass data back and forth
socket.on('connect', function() {
    //console.log('Connected to server');
    var params = jQuery.deparam(window.location.search);
    //socket io has built-in support for 
    //the idea of rooms, and we define a 'join' custom event
    socket.emit('join', params, function(err){
        if(err){
            alert(err);
            //send the user back to the root page
            window.location.href = '/';
        }
        else{
            console.log('No error');
        }
    });
});

//listeners are always separately by themselves as
//below
socket.on('disconnect', function() {
    console.log('Disconnected from the server');
});

socket.on('updateUserList', function(users) {
    //console.log(users);
    var ol = jQuery('<ol></ol>');
    users.forEach(function(user){
        ol.append(jQuery('<li></li>').text(user));
    });
    jQuery('#userList').html(ol); //we want to up an not append
});

//event listener on client
socket.on('newMessage', function(message){
    //Instead we are going to use the mustache template
    //techniques - mustache rendering techniques
    var template = jQuery('#message-template').html();
    var view = {
        from: message.from,
        text: message.text,
        createdAt: getFormattedTimestamp(message.createdAt, 'h:mm a') //moment(message.createdAt).format('h:mm a')
    };
    var html = Mustache.render(template, view);

    jQuery('#messages').append(html);
    scrollToBottom();
});

socket.on('newLocationMessage', function(message){
    //var formattedTime = moment(message.createdAt).format('h:mm a');
    var template = jQuery('#location-message-template').html();
    var view = {
        from: message.from,
        url: message.url,
        createdAt:  getFormattedTimestamp(message.createdAt, 'h:mm a')  //moment(message.createdAt).format('h:mm a')
    };
    var html = Mustache.render(template, view);

    jQuery('#messages').append(html);
    scrollToBottom();
});

 //Dom manipulation events
 jQuery('#message-form').on('submit',
  function(e) {
    //we need to use this event to override the default behavior
    e.preventDefault();
    var messageTextbox = jQuery('[name=message]');

    socket.emit('createMessage', {
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