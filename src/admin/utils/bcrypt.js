const bcrypt = require('bcrypt');
const authConfig = require('../../configs/auth');

module.exports.hashPassword = async (passwordInput) => {
    return new Promise((resolve, reject) => {
        bcrypt.genSalt(authConfig.SALT_FACTOR, function (error, salt) {
            if (error) return reject(error);
            bcrypt.hash(passwordInput, salt, function (error, hash) {
                return (!error) ? resolve(hash) : reject(error);
            });
        });
    });
}

module.exports.passwordCompare = async (passwordInput, userPassword) => {
    return new Promise((resolve, reject) => {
        bcrypt.compare(passwordInput, userPassword, function (error, compare) {
            return (!error) ? resolve(compare) : reject(error);
        });
    });
}