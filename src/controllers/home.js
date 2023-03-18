module.exports.index = (request, response, next) => {
    response.render('index', { title: 'Đăng nhập hệ thống quản trị nội dung saotuvi.com', layout: './layouts/default' });
}