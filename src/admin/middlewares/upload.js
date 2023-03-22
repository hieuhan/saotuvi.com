const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const { getDirPath } = require('../utils/path');
const { getDatePath } = require('../utils/date');
const MediaService = require('../services/media');

const multerStorage = multer.diskStorage({
    destination: function (request, file, callback) { callback(null, getDirPath('./src/public/uploads/' + getDatePath(new Date()))); },
    filename: function (request, file, callback) {
        callback(null, `${Date.now()}-${file.originalname}`);
    }
});

const multerFilter = (request, file, callback) => {
    if (file.mimetype.startsWith('image')) {
        callback(null, true);
    } else {
        callback(null, false);
    }
};

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter
});

const uploadFiles = upload.any();//.array('files', 5);

const uploadImages = (request, response, next) => {
    uploadFiles(request, response, error => {
        if (error instanceof multer.MulterError) {
            if (error.code === 'LIMIT_UNEXPECTED_FILE') {
                return response.json({ success: false, message: 'Vui lòng chọn tối đa 5 file tải lên.' });
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
    const promises = [];

    promises.push(
        sharp(file.path)
            .resize(93, 60)
            .toFile(getDirPath('./src/public/uploads/' + getDatePath(new Date()) + '/93x60/') + file.filename),

        sharp(file.path)
            .resize(362, 235)
            .toFile(getDirPath('./src/public/uploads/' + getDatePath(new Date()) + '/362x235/') + file.filename),

        sharp(file.path)
            .resize(465, 325)
            .toFile(getDirPath('./src/public/uploads/' + getDatePath(new Date()) + '/465x325/') + file.filename),
    );
    // await Promise.all(
    //     request.files.map(file => {

    //          sharp(file.path)
    //             .resize(93, 60)
    //             .toFile(getDirPath('./src/public/uploads/' + getDatePath(new Date()) + '/93x60/') + file.filename);

    //          sharp(file.path)
    //             .resize(362, 235)
    //             .toFile(getDirPath('./src/public/uploads/' + getDatePath(new Date()) + '/362x235/') + file.filename);

    //          sharp(file.path)
    //             .resize(465, 325)
    //             .toFile(getDirPath('./src/public/uploads/' + getDatePath(new Date()) + '/465x325/') + file.filename);
    //     })
    // );

    if (!promises.length) {
        return next();
    }

    await Promise.all(promises)


    next();
};

const getResult = async (request, response) => {
    if (request.files.length <= 0) {
        return response.json({ success: false, message: 'Vui lòng chọn file cần tải lên.' });
    }

    const media = await MediaService.putMedia({
        name: request.files[0].filename,
        path: request.files[0].path.replace('src\\public\\', '').replaceAll('\\', '/'),
        contentType: request.files[0].mimetype,
        size: request.files[0].size
    });

    return response.json({ success: true, data: media.path });
};

module.exports = {
    uploadImages: uploadImages,
    resizeImages: resizeImages,
    getResult: getResult
};