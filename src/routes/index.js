module.exports = app => {
    app.use(require('./home.route'));
    app.use(require('./error.route'));
}