function Encryption() {
}

// module exports
module.exports = exports = Encryption;

Encryption.classname = 'util.Encryption';
/**
 * 加密
 * @param input
 * @returns {String}
 */
Encryption.encrypt = function encrypt(input) {
    var key = $.get('cipher_key', false) || "k,e-123";// 加密的秘钥
    var cipher = $.crypto.createCipher('aes-256-cbc', key);//'aes192', 'aes-256-cbc'
    var crypted = cipher.update(input, 'utf8', 'hex');
    crypted += cipher.final('hex');
    return crypted;
};
/**
 * 解密
 * @param input
 * @returns {String}
 */
Encryption.decrypt = function decrypt(input) {
    var key = $.get('cipher_key', false) || "k,e-123";// 加密的秘钥
    var decipher = $.crypto.createDecipher('aes-256-cbc', key);//'aes192', 'aes-256-cbc'
    var dec;
    try {
        dec = decipher.update(input, 'hex', 'utf8');
        dec += decipher.final('utf8');
    } catch (e) {
        dec = '';
    }
    return dec;
};
/**
 * 随机生成固定长度的混淆码
 * @param len
 * @returns {String}
 */
Encryption.confusion = function confusion(len) {
    var _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    var output = "";
    len = len > 0 ? len : 4;
    for(var l = 0; l < len; l++) {
        output += _keyStr.charAt(Math.floor(Math.random() * _keyStr.length));
    }
    return output;
};
