module.exports = (app) => {
    app.locals.stringHelpers = require('./string.util');
    app.locals.constants = require('../configs/constants');
};