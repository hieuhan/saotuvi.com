const path = require('path');
const express = require('express');
const app = express();
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const ejsLayouts = require('express-ejs-layouts');
//const session = require('express-session');
const cookieParser = require('cookie-parser');
//const flash = require('connect-flash');
const adminRoutes = require('./admin/routes');
const routes = require('./routes');

//mongoose 
require('./database/init.mongodb');

//redis 
require('./database/init.redis');

// user middleware
app.use(helmet());
app.use(morgan('tiny'));
// compress responses
app.use(compression());

// add body-parser
//app.use(express.json())
app.use(express.urlencoded({
    extended: true
}));

// data sanitization against Nosql query injection
app.use(mongoSanitize());

// data sanitization against XSS(clean user input from malicious HTML code)
app.use(xss());

app.use(cookieParser());

// set public folder
//app.use(express.static('public'))
app.use(express.static(path.join(__dirname, 'public')));

// Example for other folders - not required
// app.use('/css', express.static(__dirname + 'public/css'))

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(ejsLayouts);

// routers
adminRoutes(app);
routes(app);

// setting 404 middleware
app.use((request, response, next) => {
    //response.locals.message = request.flash();
    const error = {};
    error.status = 404;
    next(error);
});

// we are passing error status via next method to the next middleware
// for internal server error above code won't execute

app.use((error, request, response, next) => {
    let path = 'error/404', pathServerIntenerError = 'error/500',
    layout = './layouts/error';
    console.log(error)
    if(request.originalUrl.startsWith('/stv/'))
    {
        path = 'admin/error/404';
        pathServerIntenerError = 'admin/error/500';
        layout = './admin/layouts/error';
    }

    if (error.status === 404) {
        return response.render(path, {flashMessage: {}, layout: layout });
    }
    
    response.render(pathServerIntenerError, {flashMessage: {}, layout: layout});
})


module.exports = app;