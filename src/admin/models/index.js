const mongoose = require('mongoose');

module.exports = {
    User : require('./user.model')(mongoose)
}