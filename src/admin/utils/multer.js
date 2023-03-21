const multer = require('multer');
const { getDirPath } = require('../utils/path');
const { getDatePath } = require('../utils/date');

module.exports = multer({
    storage: multer.diskStorage({
        destination: function (request, file, callback) { 
            callback(null, getDirPath('./src/public/uploads/' + getDatePath(new Date()))); 
        },
        filename: function (request, file, callback) {
            callback(null, `${ Date.now() }-${ file.originalname }`);
            //callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));

        }
    }),
    fileFilter: function (request, file, callback) {
        if (!file.mimetype.startsWith('image')) {
            return callback( /*res.end('Only images are allowed')*/ null, false)
        }

        callback(null, true)
    }
});