(function($) {
    $.fn.layconn = function(options) {
        var defaults = {
            id : 'sendbtn',
            input : 'sendmsg',
            output : 'content'
        };

        var option = $.extend(defaults, options);

        $(this).click(function(e) {
            var saying = $("#" + option.input).val();
            if(saying) {
                $.connect.sendMessage(saying);
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
    $.to = 0;
    $.user = {};
    $.users = {};
    $('#sendbtn').button();
    $('#sendbtn').layconn();
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
    var connect = function() {
        var sessid = $.cookie('sessid');
        var conn = io.connect('http://localhost:8133/user');
        conn.on('connect', function() {
            alert('user connect');
            $util.isDefined(console) && console.log('user connect');
            conn.request('login', {});
        }).on('response', function(data) {
            if(checkResponse(data)) {
                switch(data.action) {
                    case 'login':
                        conn.loginUser(data);
                        break;
                    case 'send':
                        conn.receiveMessage(data.content);
                        break;
                    case 'friends':
                        conn.listFriends(data.content);
                        break;
                    case 'update':
                        conn.updateUser(data.content);
                        break;
                }
                $util.isDefined(console) && console.log(data);
            }
        }).on('disconnect', function() {
            $util.isDefined(console) && console.log('user disconnect');
        }).on('reconnecting', function() {
            $util.isDefined(console) && console.log('user reconnecting');
            conn.request('login', {});
        });
        
        conn.request = function(action, content) {
            conn.emit('request', {'sessid':sessid, 'action':action, 'content':content});
            $.pnotify({
                title: action,
                text: $util.toString(content),
                styling: 'jqueryui'
            });
        };
        conn.loginUser = function(data) {
            if(data.success) {
                $.user = data.content;
            }
        };
        conn.sendMessage = function(saying) {
            var from = $.user.id;
            var to = $.to?parseInt($.to):undefined;
            conn.request('send', {headers:{from:from, to:to}, content:saying});
            $('#content').append('<p style="color:green">' + $.user.nick + ': <br>' + saying + '</p>');
        };
        conn.receiveMessage = function(data) {
            var from = data.headers.from;
            var saying = data.content;
            $.pnotify({
                title: "receive",
                text: saying,
                styling: 'jqueryui'
            });
            $('#content').append('<p style="color:blue">' + $.users[from].nick + ': <br>' + saying + '</p>');
        };
        conn.listFriends = function(list) {
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
            $( "#userlist" ).selectable('refresh');
        };
        conn.updateUser = function(user) {
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

        return conn;
    };
    $.connect = connect();
});
