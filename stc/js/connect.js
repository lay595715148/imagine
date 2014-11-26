/**
 * socket cnnect file
 */
$(document).ready(function() {
    var checkReceiveData = function(data) {
        if('undefined' == typeof data.from) {
            return false;
        } else {
            
        }
        if('undefined' == typeof data.to) {
            return false;
        }
        if('undefined' == typeof data.content) {
            return false;
        }
        return true;
    };
    var chat = io.connect('http://localhost:8132/chat');
    
    chat.sendMessage = function(saying) {
        chat.emit('send', {from:'',to:'',content:saying});
        $.pnotify({
            title: "Send",
            text: saying,
            styling: 'jqueryui'
        });
    };
    chat.receiveMessage = function(saying) {
        $.pnotify({
            title: "Receive",
            text: saying,
            styling: 'jqueryui'
        });
    };
  
    chat.on('connect', function (data) {
        alert('connect');
        chat.emit('hi','man');
    }).on('receive', function(data) {
        if('undefined' != typeof console) 
            console.log(data);
        if(checkReceiveData(data)) {
            chat.receiveMessage(data.content);
        }
    }).on('list person', function(data) {
        console.log('list');
        console.log(data);
    }).on('update person', function(data) {
        console.log('update');
        console.log(data);
    }).on('error', function(error) {
        
    }).on('connect_failed', function() {
        console.log('connect_failed');
        console.log(arguments);
    }).on('disconnect', function() {
        console.log('disconnect');
        console.log(arguments);
    }).on('reconnecting', function() {
        console.log('reconnecting');
        console.log(arguments);
    });
    
    $.chat = chat;
});
