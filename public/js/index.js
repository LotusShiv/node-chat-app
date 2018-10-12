var socket = io(); 
var rooms;

function anyError(message){
    // var params = jQuery.deparam(window.location.search);
    // console.log('anyError params', params);
    // if (!params){
    //     message = params.err;
    // }
    // if (message !== 'NA'){
    //     console.log('anyError - errMessage ', errMessage);
    //     $(function() {
    //         var template = $('#errName').html();
    //         var view = {
    //             error: message
    //         }
    //         var html = Mustache.render(template, view);
    //         jQuery('#nameError').append(html);
    //     });
    // }
    var template = jQuery('#errName').html();
    if (message !== 'NA'){
        alert("chatPersonCheckMessage -- " + message + ',' + template);
        var view = {
            error: message
        }
        var html = Mustache.render(template, view);

        jQuery('#nameError').append(html);
    }
}

//Dom manipulation events
jQuery('#index-join').on('submit',
    function(e) {
        //we need to use this event to override the default behavior
        var nameTextbox = jQuery('#name');
        var room = jQuery('#room').val();
        const name = jQuery('#name').val();
        var nameParams = {
            name: name,
            room: room,
            nameTextbox: nameTextbox
        };
        socket.emit('checkPersonNameInRoom', nameParams, function(errMessage){
            //clear input after emiting nameTextbox
            if (errMessage !== 'NA'){
                //alert('checkPersonNameInRoom ' + errMessage);
                console.log('checkPersonNameInRoom ', errMessage);
                window.location.search = '';
                window.location.href = '/';
                e.preventDefault(); //this line is immaterial
                setTimeout(anyError(errMessage), 8000);
                nameTextbox.val('');
            }
            else{
                window.location.href = '/chat.html?name=' + name + '&room=' + room;
            }
    });
});

socket.on('connect', function() {
    socket.emit('getChatRooms', function(error){
        if(err){
            this.error = error.err;
        }
        else{
            console.log('No error');
        }
    });
});

socket.on('updateChatRoomList', function(rooms) {
    console.log('Available chatrooms', rooms);
    this.rooms = rooms;
    var ddlRooms = $("#ddlRooms");
    ddlRooms.html('');
    console.log('ddlRooms, rooms length', $('#room'), ddlRooms, rooms.length);
    if (rooms.length === 0){
        $("#ddlRooms").append("<option selected='selected' value='0'>No Chat rooms</option>");
    }
    else{
        $("#ddlRooms").append("<option selected='selected' value='0'> Select </option>");
        rooms.forEach(function(room){
            $("#ddlRooms").append(`<option value='${room.id}'>${room.name}</option>`);
        });
    }
});

//Select from drop-down and use it for room name
jQuery('#ddlRooms').on('change',
  function(e) {
    e.preventDefault();
    var roomTextbox = jQuery('#room');
    console.log('room', roomTextbox);
    var selRoom = $('#ddlRooms option:selected').text();
    roomTextbox.val(selRoom);
});

//This is ehn you dont call callback but emit the event 
//'chatPersonCheckMessage' from server.js
socket.on('chatPersonCheckMessage', function(message){
    var template = jQuery('#errName').html();
    console.log('message', message);
    if (message.length > 0){
        alert("chatPersonCheckMessage -- " + message);
        var view = {
            error: message
        }
        var html = Mustache.render(template, view);

        jQuery('#nameError').append(html);
        //alert(jQuery('#nameError').html());
        // $(function() {
        //     var view = {
        //         error: message
        //     }
        //     //var info = Mustache.to_html(template, {error: error});
        //     //$('#nameError').html(info);
        //     var html = Mustache.render(template, view);
        //     jQuery('#nameError').append(html);
        // });
    }
});