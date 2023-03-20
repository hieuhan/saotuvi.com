module.exports.notFound = (request, response, next) => {
    response.render('admin/error/404', { layout: './admin/layouts/error' });
}