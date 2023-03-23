module.exports.notFound = (request, response, next) => {
    response.render('admin/error/404', { layout: './admin/layouts/error' });
}

module.exports.internalServerError = (request, response, next) => {
    response.render('admin/error/500', { layout: './admin/layouts/error' });
}