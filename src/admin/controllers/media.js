const { model } = require('mongoose');
const multer = require('multer');
const sharp = require('sharp');
const MediaService = require('../services/media');

var upload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, callback) { callback(null, './public/uploads'); },
        filename: function (req, file, callback) {

            callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));

        }
    }),
    fileFilter: function (req, file, callback) {
        var ext = path.extname(file.originalname)
        if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
            return callback( /*res.end('Only images are allowed')*/ null, false)
        }

        callback(null, true)
    }
})

module.exports.index = async (request, response, next) => {
    try {
        const { keywords, page, limit } = request.params;

        var data = await MediaService.getList({});

        response.render('admin/media', { data: data, layout: './admin/layouts/modal' });
    } catch (error) {
        next(error);
    }
}

module.exports.indexPost = async (request, response, next) => {
    try {
        const { keywords, page, limit } = request.params;

        var data = await MediaService.getList({});

        response.render('admin/media', { data: data, layout: './admin/layouts/modal' });
    } catch (error) {
        next(error);
    }
}