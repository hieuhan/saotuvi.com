const authorization = require('../middlewares/auth');

module.exports = app => {
    app.use('/stv/auth', require('./auth.route'));
    app.use('/stv/user', authorization, require('./user.route'));
    app.use('/stv/media', authorization, require('./media.route'));
    app.use('/stv/category', authorization, require('./category.route'));
    app.use('/stv', authorization, require('./error.route'));
    app.use('/stv', authorization, require('./dashboard.route'));
}