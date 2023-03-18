module.exports.index = (request, response, next) => {
    response.render('admin', { title: 'Hệ thống quản trị nội dung saotuvi.com', layout: './admin/layouts/default' });
}