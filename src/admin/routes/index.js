module.exports = app => {
    app.use('/stv', require('./dashboard.route'));
    app.use('/stv', require('./auth.route'));
}