$(document).ready(function() {
    var blankh = $(window).height() - $('header').height() - $('.main').height() - $('footer').height();
    $(window).resize(function() {
        blankh = $(window).height() - $('header').height() - $('.main').height() - $('footer').height();
        if(blankh > 0) {
            $('body').css('padding-top', Math.floor(blankh / 2));
        } else {
            $('body').css('padding-top', 0);
        }
    });
    if(blankh > 0) {
        $('body').css('padding-top', Math.floor(blankh / 2));
    } else {
        $('body').css('padding-top', 0);
    }
    /*$('.main').css({
        'background-color' : 'rgb(249, 221, 200)',
        'background-image' : 'url(http://mimg.127.net/index/163/themes/140127_yixin2_bg2.jpg)',
        'background-position' : '0% 0%',
        'background-repeat' : 'repeat no-repeat'
    });
    $('.main-inner').css({
        'background-image' : 'url(http://mimg.127.net/index/163/themes/140127_yixin2_cnt2.jpg)',
        'background-position' : '50% 0%',
        'background-repeat' : 'no-repeat no-repeat'
    });*/
    
    $('.login-button').button();
});

$(document).ready(function() {
    /**
     * 用户名和密码输入框获得和失去焦点逻辑
     */
    var uinput = $('.login-form input[name="username"]');
    var pinput = $('.login-form input[name="password"]');
    var rawlabelu = uinput.parent().children('label').html();
    var rawlabelp = pinput.parent().children('label').html();
    uinput.on('focus', function(el) {
        if(uinput.val()) {
            uinput.parent().children('label').html('');
        }
    }).on('blur', function() {
        if(!uinput.val()) {
            uinput.parent().children('label').html(rawlabelu);
        }
    }).on('input', function() {
        if(uinput.val()) {
            uinput.parent().children('label').html('');
        } else {
            uinput.parent().children('label').html(rawlabelu);
        }
    });
    pinput.on('focus', function(el) {
        if(pinput.val()) {
            pinput.parent().children('label').html('');
        }
    }).on('blur', function() {
        if(!pinput.val()) {
            pinput.parent().children('label').html(rawlabelp);
        }
    }).on('input', function() {
        if(pinput.val()) {
            pinput.parent().children('label').html('');
        } else {
            pinput.parent().children('label').html(rawlabelp);
        }
    });
    if(pinput.val()) {
        pinput.parent().children('label').html('');
    }
    if(uinput.val()) {
        uinput.parent().children('label').html('');
        pinput.focus();
    } else {
        uinput.focus();
    }
});
