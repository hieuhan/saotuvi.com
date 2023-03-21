const fs = require('fs');

module.exports.getDirPath = (dirPath) => {
    try {
        if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });
        return dirPath;
    } catch (error) {
        console.error(error);
        return Promise.reject(error);
    }
}