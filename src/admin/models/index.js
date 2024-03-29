const mongoose = require('mongoose');

module.exports = {
    User : require('./user.model')(mongoose),
    Menu : require('./menu.model')(mongoose),
    Media: require('./media.model')(mongoose),
    Category : require('./category.model')(mongoose),
    Article : require('./article.model')(mongoose)
}