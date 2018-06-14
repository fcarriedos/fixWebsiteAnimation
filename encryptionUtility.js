var exports = module.exports = {};

const CONSTANTS = require('./CONSTANTS.js');
const aesjs = require('aes-js');

// An example 128-bit key (16 bytes * 8 bits/byte = 128 bits)
var key = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16 ];

var cipher = exports.cypher = function cypher(text) {
    if ((!text) || (text == null)) {
        console.log('encryptionUtility.cypher(): nothing to cypher.');
        return null;
    }
    // Convert text to bytes
    var textBytes = aesjs.utils.utf8.toBytes(text);
     
    // The counter is optional, and if omitted will begin at 1
    var aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(5));
    var encryptedBytes = aesCtr.encrypt(textBytes);
     
    // To print or store the binary data, you may convert it to hex
    var encryptedHex = aesjs.utils.hex.fromBytes(encryptedBytes);
    console.log('encryptionUtility.cipher(): ' + encryptedHex);
    // "a338eda3874ed884b6199150d36f49988c90f5c47fe7792b0cf8c7f77eeffd87
    //  ea145b73e82aefcf2076f881c88879e4e25b1d7b24ba2788"
    return encryptedHex;
}


var decipher = exports.decypher = function decypher(encryptedHex) {
    if ((!encryptedHex) || (encryptedHex == null)) {
        console.log('encryptionUtility.decypher(): nothing to decypher.');
        return null;
    }
    // When ready to decrypt the hex string, convert it back to bytes
    var encryptedBytes = aesjs.utils.hex.toBytes(encryptedHex);
     
    // The counter mode of operation maintains internal state, so to
    // decrypt a new instance must be instantiated.
    var aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(5));
    var decryptedBytes = aesCtr.decrypt(encryptedBytes);
     
    // Convert our bytes back into text
    var decryptedText = aesjs.utils.utf8.fromBytes(decryptedBytes);
    console.log('encryptionUtility.decypher(): ' + decryptedText);
    // "Text may be any length you wish, no padding is required."
    return decryptedText;
}


return module.exports;