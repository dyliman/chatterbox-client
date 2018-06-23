$( document ).ready(function() {
  var app = { 
    server: 'http://parse.sfm6.hackreactor.com/chatterbox/classes/messages',
    uniqRoom: new Set(['Default']),
    friendlist: {},
    currentRoom: 'Default',
    
    init: function() {

      $('.username').click(function(event) {
        //app.handleUsernameClick(this);
        app.friendlist[$(this).text()] = 1;
        event.stopImmediatePropagation();
      });
    
      $('#button').click(function(event) {
        console.log('clicked');
        app.handleSubmit();
        event.stopImmediatePropagation();
      });

      $('#roomButton').click(function(event) {
        console.log('making a room');
        var roomText = $('#createRoom').val();
        app.uniqRoom.add(roomText);
        app.renderRoom();
        event.stopImmediatePropagation();
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
          app.init();
          
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
      //userBox.addAction('#');
      userBox.addClass('username');
      userBox.val('username');
        
      
      var roomBox = $('<a>');
      roomBox.addClass('roomName');
      
      var span = $('<span>');
      
      var textBox = $('<p>');
      textBox.addClass('text');
      
      if(app.friendlist.hasOwnProperty(message.username)){
        userBox.addClass('friend');
        textBox.addClass('friend');
      }
      
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
      if (app.currentRoom === message.roomname) {
        $('#chats').append(messageBox);
        
      } else if (app.currentRoom === 'Default') {
        $('#chats').append(messageBox);
      } 

    },
  
    renderRoom: function() {
      $('#roomSelect').empty();
      
      app.uniqRoom.forEach(function(room) {
        var option = $('<option>');
        option.text(room.replace(/[\W_]+/g, ' '));
        $('#roomSelect').append(option);
      });
    
    },
    
    handleUsernameClick: function(username) {
      // Get the text from the username
      // stick that into friendlist as key
      $(username).addClass('friend');
      console.log(username);
      
      
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
        app.currentRoom = room;
      }else if(room === 'Default'){
        app.currentRoom = 'Default';
      }
      // message.username = "<script>app.send({text: \"Check yo' console, sucka!\"}); console.log(\"You sent this\")</script>";
      app.send(message);
      console.log('inside the handleSubmit method!!!');
      
    },

    
  };


  var refresh = function() {
    setInterval(function() {
      app.fetch();
      //console.log(app.uniqRoom);
    }, 2000);
  };
  app.init();
  app.fetch();
  app.renderRoom();
  refresh();
  

});

























