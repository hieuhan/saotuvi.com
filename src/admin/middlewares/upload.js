const multer = require('multer');
const sharp = require('sharp');
const config = require('../../configs/constants');
const { getDirPath } = require('../utils/path');
const { getDatePath } = require('../utils/date');

const multerStorage = multer.diskStorage({
    destination: function (request, file, callback) { callback(null, getDirPath('./src/public/uploads/images/' + getDatePath(new Date()) + '/original')); },
    filename: function (request, file, callback) {
        callback(null, `${Date.now()}-${file.originalname}`);
    }
});

const multerFilter = (request, file, callback) => {
    const fileSize = parseInt(request.headers['content-length']);
    if (fileSize > 2097152) { //20MB
        callback(new Error('File ảnh hợp lệ có dung lượng không vượt quá 20MB.'));
    } else if (file.mimetype.startsWith('image')) {
        callback(null, true);
    } else {
        callback(null, false);
    }
};

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter
});

const uploadFiles = upload.array('files', config.FILE_UPLOAD_LIMIT);

const uploadImages = (request, response, next) => {
    uploadFiles(request, response, error => {
        if (error instanceof multer.MulterError) {
            if (error.code === 'LIMIT_UNEXPECTED_FILE') {
                return response.json({ success: false, message: `Vui lòng chọn tối đa ${config.FILE_UPLOAD_LIMIT} file ảnh.` });
            } else {
                return response.json({ success: false, message: error.message });
            }
        } else if (error) {
            return next(error);
        }

        next();
    });
};

const resizeImages = async (request, response, next) => {
    if (!request.files) return next();

    request.body.images = [];

    await Promise.all(
        request.files.map(file => {

            sharp(file.path)
                .resize(93, 60)
                .toFile(`${ getDirPath(`./src/public/uploads/images/${getDatePath(new Date())}/thumb/`) }${ file.filename }`);

            sharp(file.path)
                .resize(362, 235)
                .toFile(`${ getDirPath(`./src/public/uploads/images/${getDatePath(new Date())}/mobile/`) }${ file.filename }`);

            sharp(file.path)
                .resize(465, 325)
                .toFile(`${ getDirPath(`./src/public/uploads/images/${getDatePath(new Date())}/standard/`) }${ file.filename }`);
        })
    );

    next();
};

module.exports = {
    uploadImages: uploadImages,
    resizeImages: resizeImages
};