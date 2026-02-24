'use strict';

const Crypto = require('crypto');

/**
 * Encrypte une chaîne de caractères en SHA256
 * @param {string} password
 * @returns {string} le hash hexadécimal
 */
exports.sha256 = (password) => {
    return Crypto.createHash('sha256').update(password).digest('hex');
};