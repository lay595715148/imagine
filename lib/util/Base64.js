/* jshint eqeqeq: false */
/* global $ */
"use strict";

/**
 * 
 * Base64 encode / decode
 * 
 * @author haitao.tu modified by Lay Li(lay595715148@126.com)
 * @date 2010-04-26
 * @email tuhaitao@foxmail.com
 * 
 */

function Base64() {
}

module.exports = exports = Base64;

(function() {
    Base64.classname = 'util.Base64';
    //private static property
    //var _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    /**
     * base64 encode
     * @param input
     * @returns {String}
     */
    Base64.encode = function encode(input) {
        var _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
        var output = "";
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;
        input = $.util.Charset.utf8_encode(input);
        while(i < input.length) {
            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);
            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;
            if(isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if(isNaN(chr3)) {
                enc4 = 64;
            }
            output = output + _keyStr.charAt(enc1) + _keyStr.charAt(enc2)
                    + _keyStr.charAt(enc3) + _keyStr.charAt(enc4);
        }
        return output;
    };
    /**
     * base64 decode
     * @param input
     * @returns {String}
     */
    Base64.decode = function(input) {
        var _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
        var output = "";
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;
        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
        while(i < input.length) {
            enc1 = _keyStr.indexOf(input.charAt(i++));
            enc2 = _keyStr.indexOf(input.charAt(i++));
            enc3 = _keyStr.indexOf(input.charAt(i++));
            enc4 = _keyStr.indexOf(input.charAt(i++));
            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;
            output = output + String.fromCharCode(chr1);
            if(enc3 != 64) {
                output = output + String.fromCharCode(chr2);
            }
            if(enc4 != 64) {
                output = output + String.fromCharCode(chr3);
            }
        }
        output = $.util.Charset.utf8_decode(output);
        return output;
    };
})();
