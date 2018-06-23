$( document ).ready(function() {
  var app = { 
    server: 'http://parse.sfm6.hackreactor.com/chatterbox/classes/messages',

    init: function() {
      $('.username').on('click', function(event) {
        app.handleUsernameClick();
      });
    
      //$('#send .submit').submit()
      $('#send .submit').on('submit', app.handleSubmit());
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
      
      var textBox = $('<p>');
      textBox.addClass('text');
      
      userBox.text(message.username.replace(/[\W_]+/g, ' '));
      textBox.text(message.text.replace(/[\W_]+/g, ' '));
      messageBox.append(userBox);
      messageBox.append(textBox);
      
      $('#chats').append(messageBox);
    },
  
    renderRoom: function(room) {
      var div = $('<div>');
      var divClass = room;
      div.addClass(divClass);
      $('#roomSelect').append(div);
    },
    
    handleUsernameClick: function() {
      
    },
    
    handleSubmit: function() {
      console.log('inside the handleSubmit method!!!');
    },

    
  };


  var refresh = function() {
    setInterval(function() {
      app.fetch();
    }, 2000);
  };
  app.fetch();
  refresh();

});

























