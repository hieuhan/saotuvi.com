const config = require('../configs');

module.exports.NOIMAGE_PATH = config.NOIMAGE_PATH;

module.exports.getSlug = (slug) => {
    try {

        if (slug && slug.trim().length > 0) {
            let result = slug;

            while (result.startsWith('/')) {
                result = result.substring(1);
            }

            return `${config.ROOT_PATH}${result}`;
        }

        return '';
    } catch (error) {
        console.log(error);
        return Promise.reject(error);
    }
}

module.exports.getImagePath = (image) => {
    try {

        if (image && image.trim().length > 0) {
            let result = image;

            while (result.startsWith('/')) {
                result = result.substring(1);
            }

            return `${config.ROOT_PATH}${result}`;
        }

        return config.NOIMAGE_PATH;
    } catch (error) {
        console.log(error);
        return Promise.reject(error);
    }
}

module.exports.getFullSlug = (slug) => {
    try {

        if (slug && slug.trim().length > 0) {
            let result = slug;

            while (result.startsWith('/')) {
                result = result.substring(1);
            }

            return `${config.DOMAIN}${result}`;
        }

        return '';
    } catch (error) {
        console.log(error);
        return Promise.reject(error);
    }
}

module.exports.getFileSize = (size) => {
    try {
        var fSExt = new Array('Bytes', 'KB', 'MB', 'GB'),
            i = 0; while (size > 900) { size /= 1024; i++; }
        return (Math.round(size * 100) / 100) + ' ' + fSExt[i];
    } catch (error) {
        console.log(error);
        return Promise.reject(error);
    }
}

module.exports.updatePageUrl = (originalUrl, currentPage) => {
    let newUrl = '';
    try {
        if (originalUrl.indexOf('page=') !== -1) {
            newUrl = originalUrl.replace(/page=[^&]+/, 'page=' + currentPage);
        } else if (originalUrl.indexOf("?") === -1) {
            newUrl = originalUrl + '?page=' + currentPage;
        } else {
            newUrl = originalUrl + '&page=' + currentPage;
        }

        return newUrl;
    } catch (error) {
        console.log(error);
        return Promise.reject(error);
    }
}