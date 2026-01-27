'use strict';

const Crypto = require('crypto');

/**
 * Encode une chaîne en SHA1
 * @param {string} password
 * @returns {string}
 */
exports.sha1 = (password) => {
    return Crypto.createHash('sha1').update(password).digest('hex');
};

/**
 * Compare un texte clair avec un hash SHA1
 * @param {string} plainText
 * @param {string} hash
 * @returns {boolean}
 */
exports.compareSha1 = (plainText, hash) => {
    return exports.sha1(plainText) === hash;
};