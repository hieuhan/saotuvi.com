const bcrypt = require('bcrypt');

module.exports.passwordCompare = async (passwordInput, userPassword) => {
    return await bcrypt.compare(passwordInput, userPassword);
}