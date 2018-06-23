$( document ).ready(function() {
  var app = { 
    server: 'http://parse.sfm6.hackreactor.com/chatterbox/classes/messages',
    uniqRoom: new Set(),
    
    
    init: function() {

      $('.username').on('click', function(event) {
        app.handleUsernameClick();
      });
    
      //$('#send .submit').submit()
      $('#button').click(function() {
        console.log('clicked');
        app.handleSubmit();
      });

      $('#roomButton').click(function() {
        console.log('making a room');
        var roomText = $('#createRoom').val();
        // JSON.stringify(roomText)
        // roomText = roomText.replace(/[\W_]+/g, ' ');
        // var option = $('<option>');
        // option.text(roomText);
        // option.val(roomText);
        app.uniqRoom.add(roomText);
        app.renderRoom();
        // get the text value
        // create some kind of element
        // set its text as the input from the form.
        // use append  to add it as a child of the roomselect id.
      });

    },
  
    send: function(message) {
      $.ajax({
        // This is the url you should use to communicate with the parse API server.
        url: 'http://parse.sfm6.hackreactor.com/chatterbox/classes/messages',
        type: 'POST',
        data: JSON.stringify(message),
        contentType: 'application/json',
        success: function (data) {
          console.log('chatterbox: Message sent');
        },
        error: function (data) {
          // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
          console.error('chatterbox: Failed to send message', data);
        }
      });
    },
  
    fetch: function() {
      $.ajax({
        // This is the url you should use to communicate with the parse API server.
        url: 'http://parse.sfm6.hackreactor.com/chatterbox/classes/messages',

        type: 'GET',
        data: {order: '-createdAt'},
        contentType: 'application/json',
        success: function (data) {
          app.clearMessages();
          console.log(data);
          for (var result = 0; result < data.results.length; result++) {
            app.renderMessage(data.results[result]);
          }
        },
        error: function (data) {
          // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
          console.error('chatterbox: Failed to send message', data);
        }
      });
    },
   
    clearMessages: function() {
      $('#chats').children().remove();
    },
  
    renderMessage: function(message) {
      message.text = message.text || '';
      message.username = message.username || 'Anonymous';
      var messageBox = $('<div></div>');
      messageBox.addClass('message');
      
      var userBox = $('<a>');
      userBox.addClass('username');
      
      var roomBox = $('<a>');
      roomBox.addClass('roomName');
      
      var span = $('<span>');
      
      var textBox = $('<p>');
      textBox.addClass('text');
      
      userBox.text(message.username.replace(/[\W_]+/g, ' '));
      textBox.text(message.text.replace(/[\W_]+/g, ' '));
      
      
      span.append(userBox);
      
      if (message.roomname !== undefined) {
        roomBox.text('Room name: ' + message.roomname.replace(/[\W_]+/g, ' '));
        span.append(roomBox);
        app.uniqRoom.add(message.roomname);
      }
      
      messageBox.append(span);
      messageBox.append(textBox);
      
      $('#chats').append(messageBox);
      
      
      
    },
  
    renderRoom: function() {
      $('#roomSelect').empty();
      
      app.uniqRoom.forEach(function(room) {
        var option = $('<option>');
        option.text(room.replace(/[\W_]+/g, ' '));
        $('#roomSelect').append(option);
      });
      
      //$('#roomSelect').append(option);
    },
    
    handleUsernameClick: function() {
      
    },
    
    handleSubmit: function() {
      var text = $('#textMessage').val();
      // var name = $('#nameInput').val();
      var message = {};
      message.text = text;
      message.username = window.location.search;
      
      var room = $('#roomSelect').val();
      if (room !== 'Default' && room !== undefined) {
        message.roomname = room;
      }
        
      // message.username = "<script>app.send({text: \"Check yo' console, sucka!\"}); console.log(\"You sent this\")</script>";
      app.send(message);
      console.log('inside the handleSubmit method!!!');
    },

    
  };


  var refresh = function() {
    setInterval(function() {
      app.fetch();
    }, 2000);
    // setInterval(function() {
    //   app.init();
    // }, 2000);
  };
  app.init();
  app.fetch();
  refresh();

});

























