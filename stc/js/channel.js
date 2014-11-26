(function($) {
    $.fn.laychat = function(options) {
        var defaults = {
            id : 'sendbtn',
            input : 'sendmsg',
            output : 'content'
        };

        var option = $.extend(defaults, options);

        $(this).click(function(e) {
            var saying = $("#" + option.input).val();
            if(saying) {
                $.chat.sendMessage(saying);
            } else {
                $.pnotify({
                    title : "Warning",
                    text : "发送内容不可为空",
                    type : "notice",
                    styling : 'jqueryui'
                });
            }
        });
    };
})(jQuery);

$(document).ready(function() {
    $.to = {};
    $.user = {};
    $.users = {};
    $('#sendbtn').button();
    $('#sendbtn').laychat();
    $('#chatlist').menu();
    $('#userlist').selectable({
        create : function(event, ui) {
            $('#userlist.ui-selectable').addClass('ui-widget-content');
            $('#userlist.ui-selectable').addClass('ui-corner-all');
            $('#userlist.ui-selectable .ui-selectee a').addClass('ui-corner-all');
        }
    });
    $('#userlist').on('selectableselecting', function(event, ui) {
        var a = $('a', $(ui.selecting));
        a.addClass('ui-corner-all ui-state-focus');
    });
    $('#userlist').on('selectableunselecting', function(event, ui) {
        var a = $('a', $(ui.unselecting));
        a.removeClass('ui-corner-all ui-state-focus');
    });
    $('#userlist').on('selectableselected', function(event, ui) {
        var a = $('a', $(ui.selected));
        if(a.length > 0) {
            a.addClass('ui-corner-all ui-state-focus');
            $.to[a.attr('userid')] = a.attr('socket');
            alert(a.attr('userid') + ':' + a.attr('socket'));
        }
    });
    $('#userlist').on('selectableunselected', function(event, ui) {
        var a = $('a', $(ui.unselected));
        a.removeClass('ui-corner-all ui-state-focus');
        delete $.to[a.attr('userid')];
        alert(a.attr('userid'));
    });

    Pnotify.consume_alert();
    $(window).resize(function() {
        $('.left_column .content').height($(window).height() - 141 > 200 ? $(window).height() - 141 : 200);
    });
    $('.left_column .content').height($(window).height() - 141 > 200 ? $(window).height() - 141 : 200);
});

/**
 * socket cnnect file
 */
$(document).ready(function() {
    var sessid = $.cookie('sessid');
    var checkResponse = function(data) {
        if('object' !== typeof data) {
            return false;
        }
        if('undefined' == typeof data.success) {
            return false;
        }
        if('undefined' == typeof data.action) {
            return false;
        }
        if('undefined' == typeof data.content) {
            return false;
        }
        return true;
    };
    var connectChannel = function(channelid) {
        if($.chat) { $.chat = null; }
        var chat = io.connect('http://localhost:8133/' + channelid);
        chat.on('connect', function() {
            alert('connect channel connect');
            if(typeof console !== 'undefined') console.log('connect channel connect');
            //chat.emit('login', {'token':'2014'});
            chat.emit('request', {'sessid':sessid,'action':'login','content':{}});
        }).on('response', function(data) {
            if(checkResponse(data)) {
                switch(data.action) {
                    case 'login':
                        //if(typeof console !== 'undefined') console.log(data);
                        if(data.success) {
                            $.user = data.content;
                        }
                        break;
                    case 'send':
                        chat.receiveMessage(data.content);
                        break;
                    case 'list':
                        chat.listUser(data.content);
                        break;
                    case 'update':
                        chat.updateUser(data.content);
                        break;
                }
                if(typeof console !== 'undefined') console.log(data);
            }
        }).on('disconnect', function() {
            if(typeof console !== 'undefined') console.log('connectChannel disconnect');
        }).on('reconnecting', function() {
            if(typeof console !== 'undefined') console.log('connectChannel reconnecting');
            chat.emit('request', {'sessid':sessid,'action':'login','content':{}});
            //chat.disconnect();
        });
        
        chat.request = function(action, content) {
            chat.emit('request', {'sessid':sessid, 'action':action, 'content':content});
            $.pnotify({
                title: action,
                text: content,
                styling: 'jqueryui'
            });
        };
        chat.sendMessage = function(saying) {
            var tos = [];
            Object.keys($.to).map(function(to) {
                tos.push(parseInt(to));
            });
            //$('#userlist').
            chat.emit('request', {'sessid':sessid, action:'send', 'content':{headers:{from:$.user.id, to:tos}, content:saying}});
            $.pnotify({
                title: "Send",
                text: saying,
                styling: 'jqueryui'
            });
            $('#content').append('<p style="color:green">' + $.user.nick + ': <br>' + saying + '</p>');
        };
        chat.receiveMessage = function(data) {
            var from = data.headers.from;
            var saying = data.content;
            $.pnotify({
                title: "Receive",
                text: saying,
                styling: 'jqueryui'
            });
            $('#content').append('<p style="color:blue">' + $.users[from].nick + ': <br>' + saying + '</p>');
        };
        chat.listUser = function(list) {
            var users = list.list;
            var usershtml = '';
            var user;
            for(var i = 0; i< users.length; i++) {
                user = users[i];
                usershtml += '<li userid="' + user.id + '">' + 
                '<a userid="' + user.id + '" socket="' + user.socket + '">' + user.name + '(' + user.nick + ')</a>' + 
                '</li>';
                $.users[user.id] = $.users[user.socket] = user;
            }
            $( "#userlist" ).html(usershtml);
            //$( "#userlist" ).menu();
            $( "#userlist" ).selectable('refresh');
        };
        chat.updateUser = function(user) {
            var exists = $( "#userlist li[userid=" + user.id + "]" );
            if(exists.length > 0) {
                if(user.status == 'leave' || user.status == 'disconnect') {
                    $( "#userlist li[userid=" + user.id + "]" ).remove();
                    //$( "#userlist" ).menu('refresh');
                    $( "#userlist" ).selectable('refresh');
                    delete $.users[user.id],delete $.users[user.socket];
                    delete $.to[user.id];
                }
            } else {
                if(user.status == 'join') {
                    var userhtml = '<li userid="' + user.id + '">' + 
                            '<a userid="' + user.id + '" socket="' + user.socket + '">' + user.name + '('+user.nick+')</a>' + 
                            '</li>';
                    $( "#userlist" ).append(userhtml);
                    //$( "#userlist" ).menu('refresh');
                    $( "#userlist" ).selectable('refresh');
                    $.users[user.id] = $.users[user.socket] = user;
                }
            }
        };
        
        $.chat = chat;
    };
    $.connectChannel = connectChannel;
    $.connectChannel(10000);
});
