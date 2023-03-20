module.exports.index = async (request, response, next) => {
    try {
        response.render('admin/category', { layout: './admin/layouts/default' });
    } catch (error) {
        next(error);
    }
}