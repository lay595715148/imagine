var permanotice, tooltip, _alert;
$(function() {
    // This is how to change the default settings for the entire page.
    // $.pnotify.defaults.width = "400px";
    // If you don't want new lines ("\n") automatically converted to breaks
    // ("<br />")
    // $.pnotify.defaults.insert_brs = false;

    /*
     * $.pnotify({ title: "Pines Notify", text: "Welcome. Try hovering over me.
     * You can click things behind me, because I'm non-blocking.", nonblock:
     * true, styling: 'jqueryui', before_close: function(pnotify){ // You can
     * access the notice's options with this. It is read only.
     * //pnotify.opts.text; // You can change the notice's options after the
     * timer like this: pnotify.pnotify({ title: pnotify.opts.title+" - Enjoy
     * your Stay", before_close: null }); pnotify.pnotify_queue_remove(); return
     * false; } });
     */
});

function show_rich() {
    $.pnotify({
        styling : 'jqueryui',
        title : '<span style="color: green;">Rich Content Notice</span>',
        text : '<span style="color: blue;">Look at my beautiful <strong>strong</strong>, <em>emphasized</em>, and <span style="font-size: 1.5em;">large</span> text.</span>'
    });
}

function consume_alert() {
    if(_alert)
        return;
    _alert = window.alert;
    window.alert = function(message) {
        $.pnotify({
            title : 'Alert',
            styling : 'jqueryui',
            text : message
        });
    };
}

function release_alert() {
    if(!_alert)
        return;
    window.alert = _alert;
    _alert = null;
}

function fake_load() {
    var cur_value = 1, progress;

    // Make a loader.
    var loader = $.pnotify({
        title : "Fake Load",
        text : "<div class=\"progress_bar\" />",
        icon : 'picon picon-throbber',
        styling : 'jqueryui',
        hide : false,
        closer : false,
        sticker : false,
        history : false,
        before_open : function(pnotify) {
            progress = pnotify.find("div.progress_bar");
            progress.progressbar({
                value : cur_value
            });
            // Pretend to do something.
            var timer = setInterval(function() {
                if(cur_value >= 100) {
                    // Remove the interval.
                    window.clearInterval(timer);
                    loader.pnotify_remove();
                    return;
                }
                // cur_value += Math.ceil(3 * ((100 - cur_value) / 100));
                cur_value += .3;
                progress.progressbar('option', 'value', cur_value);
            }, 200);
        }
    });
}

function dyn_notice() {
    var percent = 0;
    var notice = $.pnotify({
        title : "Please Wait",
        type : 'info',
        icon : 'picon picon-throbber',
        styling : 'jqueryui',
        hide : false,
        closer : false,
        sticker : false,
        opacity : .75,
        shadow : false,
        width : "150px"
    });

    setTimeout(function() {
        notice.pnotify({
            title : false
        });
        var interval = setInterval(function() {
            percent += 2;
            var options = {
                text : percent + "% complete."
            };
            if(percent == 80)
                options.title = "Almost There";
            if(percent >= 100) {
                window.clearInterval(interval);
                options.title = "Done!";
                options.type = "success";
                options.hide = true;
                options.closer = true;
                options.sticker = true;
                options.icon = 'picon picon-task-complete';
                options.opacity = 1;
                options.shadow = true;
                options.width = $.pnotify.defaults.width;
                // options.min_height = "300px";
            }
            notice.pnotify(options);
        }, 120);
    }, 2000);
}

function timed_notices(n) {
    var start_time = new Date().getTime(), end_time;
    var options = {
        title : "Notice Benchmark",
        text : "Testing notice speed.",
        styling : 'jqueryui',
        animation : 'none',
        delay : 0,
        history : false
    };
    for(var i = 0; i < n; i++) {
        if(i + 1 == n) {
            options.after_close = function(pnotify) {
                // Remove this callback.
                pnotify.pnotify({
                    after_close : null
                });
                end_time = new Date().getTime();
                alert("Testing complete:\n\nTotal Notices: " + n + "\nTotal Time: " + (end_time - start_time) + "ms ("
                        + ((end_time - start_time) / 1000) + "s)" + "\nAverage Time: " + ((end_time - start_time) / n)
                        + "ms (" + ((end_time - start_time) / n / 1000) + "s)")
            };
        }
        $.pnotify(options);
    }
}

/*******************************************************************************
 * Custom Stacks ********* A stack is an object which Pines Notify uses to
 * determine where to position notices. A stack has two mandatory variables,
 * dir1 and dir2. dir1 is the first direction in which the notices are stacked.
 * When the notices run out of room in the window, they will move over in the
 * direction specified by dir2. The directions can be "up", "down", "right", or
 * "left". Stacks are independent of each other, so a stack doesn't know and
 * doesn't care if it overlaps (and blocks) another stack. The default stack,
 * which can be changed like any other default, goes down, then left. Stack
 * objects are used and manipulated by Pines Notify, and therefore, should be a
 * variable when passed. So, calling something like
 * 
 * $.pnotify({stack: {"dir1": "down", "dir2": "left"}});
 * 
 * will NOT work. It will create a notice, but that notice will be in its own
 * stack and may overlap other notices.
 */
var stack_topleft = {
    "dir1" : "down",
    "dir2" : "right",
    "push" : "top"
};
var stack_bottomleft = {
    "dir1" : "right",
    "dir2" : "up",
    "push" : "top"
};
var stack_custom = {
    "dir1" : "right",
    "dir2" : "down"
};
var stack_custom2 = {
    "dir1" : "left",
    "dir2" : "up",
    "push" : "top"
};
var stack_bar_top = {
    "dir1" : "down",
    "dir2" : "right",
    "push" : "top",
    "spacing1" : 0,
    "spacing2" : 0
};
var stack_bar_bottom = {
    "dir1" : "up",
    "dir2" : "right",
    "spacing1" : 0,
    "spacing2" : 0
};
/*******************************************************************************
 * Positioned Stack ********* This stack is initially positioned through code
 * instead of CSS. This is done through two extra variables. firstpos1 and
 * firstpos2 are pixel values, relative to a viewport edge. dir1 and dir2,
 * respectively, determine which edge. It is calculated as follows: - dir = "up" -
 * firstpos is relative to the bottom of viewport. - dir = "down" - firstpos is
 * relative to the top of viewport. - dir = "right" - firstpos is relative to
 * the left of viewport. - dir = "left" - firstpos is relative to the right of
 * viewport.
 */
var stack_bottomright = {
    "dir1" : "up",
    "dir2" : "left",
    "firstpos1" : 25,
    "firstpos2" : 25
};

function show_stack_topleft(type) {
    var opts = {
        title : "Over Here",
        text : "Check me out. I'm in a different stack.",
        addclass : "stack-topleft",
        styling : 'jqueryui',
        stack : stack_topleft
    };
    switch(type) {
        case 'error':
            opts.title = "Oh No";
            opts.text = "Watch out for that water tower!";
            opts.type = "error";
            break;
        case 'info':
            opts.title = "Breaking News";
            opts.text = "Have you met Ted?";
            opts.type = "info";
            break;
        case 'success':
            opts.title = "Good News Everyone";
            opts.text = "I've invented a device that bites shiny metal asses.";
            opts.type = "success";
            break;
    }
    $.pnotify(opts);
};
function show_stack_bottomleft(type) {
    var opts = {
        title : "Over Here",
        text : "Check me out. I'm in a different stack.",
        addclass : "stack-bottomleft",
        styling : 'jqueryui',
        stack : stack_bottomleft
    };
    switch(type) {
        case 'error':
            opts.title = "Oh No";
            opts.text = "Watch out for that water tower!";
            opts.type = "error";
            break;
        case 'info':
            opts.title = "Breaking News";
            opts.text = "Have you met Ted?";
            opts.type = "info";
            break;
        case 'success':
            opts.title = "Good News Everyone";
            opts.text = "I've invented a device that bites shiny metal asses.";
            opts.type = "success";
            break;
    }
    $.pnotify(opts);
};
function show_stack_bottomright(type) {
    var opts = {
        title : "Over Here",
        text : "Check me out. I'm in a different stack.",
        addclass : "stack-bottomright",
        styling : 'jqueryui',
        stack : stack_bottomright
    };
    switch(type) {
        case 'error':
            opts.title = "Oh No";
            opts.text = "Watch out for that water tower!";
            opts.type = "error";
            break;
        case 'info':
            opts.title = "Breaking News";
            opts.text = "Have you met Ted?";
            opts.type = "info";
            break;
        case 'success':
            opts.title = "Good News Everyone";
            opts.text = "I've invented a device that bites shiny metal asses.";
            opts.type = "success";
            break;
    }
    $.pnotify(opts);
};
function show_stack_custom(type) {
    var opts = {
        title : "Over Here",
        text : "Check me out. I'm in a different stack.",
        addclass : "stack-custom",
        styling : 'jqueryui',
        stack : stack_custom
    };
    switch(type) {
        case 'error':
            opts.title = "Oh No";
            opts.text = "Watch out for that water tower!";
            opts.type = "error";
            break;
        case 'info':
            opts.title = "Breaking News";
            opts.text = "Have you met Ted?";
            opts.type = "info";
            break;
        case 'success':
            opts.title = "Good News Everyone";
            opts.text = "I've invented a device that bites shiny metal asses.";
            opts.type = "success";
            break;
    }
    $.pnotify(opts);
};
function show_stack_custom2(type) {
    var opts = {
        title : "Over Here",
        text : "Check me out. I'm in a different stack.",
        addclass : "stack-custom2",
        styling : 'jqueryui',
        stack : stack_custom2
    };
    switch(type) {
        case 'error':
            opts.title = "Oh No";
            opts.text = "Watch out for that water tower!";
            opts.type = "error";
            break;
        case 'info':
            opts.title = "Breaking News";
            opts.text = "Have you met Ted?";
            opts.type = "info";
            break;
        case 'success':
            opts.title = "Good News Everyone";
            opts.text = "I've invented a device that bites shiny metal asses.";
            opts.type = "success";
            break;
    }
    $.pnotify(opts);
};
function show_stack_bar_top(type) {
    var opts = {
        title : "Over Here",
        text : "Check me out. I'm in a different stack.",
        addclass : "stack-bar-top",
        styling : 'jqueryui',
        cornerclass : "",
        width : "100%",
        stack : stack_bar_top
    };
    switch(type) {
        case 'error':
            opts.title = "Oh No";
            opts.text = "Watch out for that water tower!";
            opts.type = "error";
            break;
        case 'info':
            opts.title = "Breaking News";
            opts.text = "Have you met Ted?";
            opts.type = "info";
            break;
        case 'success':
            opts.title = "Good News Everyone";
            opts.text = "I've invented a device that bites shiny metal asses.";
            opts.type = "success";
            break;
    }
    $.pnotify(opts);
};
function show_stack_bar_bottom(type) {
    var opts = {
        title : "Over Here",
        text : "Check me out. I'm in a different stack.",
        addclass : "stack-bar-bottom",
        styling : 'jqueryui',
        cornerclass : "",
        width : "70%",
        stack : stack_bar_bottom
    };
    switch(type) {
        case 'error':
            opts.title = "Oh No";
            opts.text = "Watch out for that water tower!";
            opts.type = "error";
            break;
        case 'info':
            opts.title = "Breaking News";
            opts.text = "Have you met Ted?";
            opts.type = "info";
            break;
        case 'success':
            opts.title = "Good News Everyone";
            opts.text = "I've invented a device that bites shiny metal asses.";
            opts.type = "success";
            break;
    }
    $.pnotify(opts);
};
function show_stack_info() {
    var modal_overlay;
    if(typeof info_box != "undefined") {
        info_box.pnotify_display();
        return;
    }
    info_box = $.pnotify({
        title : "Pines Notify Stacks",
        text : "Stacks are used to position notices and determine where new notices will go when they're created. Each notice that's placed into a stack will be positioned related to the other notices in that stack. There is no limit to the number of stacks, and no limit to the number of notices in each stack.",
        type : "info",
        styling : 'jqueryui',
        icon : "picon picon-object-order-raise",
        delay : 20000,
        history : false,
        stack : false,
        before_open : function(pnotify) {
            // Position this notice in the center of the screen.
            pnotify.css({
                "top" : ($(window).height() / 2) - (pnotify.height() / 2),
                "left" : ($(window).width() / 2) - (pnotify.width() / 2)
            });
            // Make a modal screen overlay.
            if(modal_overlay)
                modal_overlay.fadeIn("fast");
            else
                modal_overlay = $("<div />", {
                    "class" : "ui-widget-overlay",
                    "css" : {
                        "display" : "none",
                        "position" : "fixed",
                        "top" : "0",
                        "bottom" : "0",
                        "right" : "0",
                        "left" : "0"
                    }
                }).appendTo("body").fadeIn("fast");
        },
        before_close : function() {
            modal_overlay.fadeOut("fast");
        }
    });
};