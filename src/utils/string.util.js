const config = require('../configs');

module.exports.getSlug = (slug) => {
    try {
        let result = slug;
        while(result.startsWith('/')){
            result = result.substring(1);
        }

        return `${ config.DOMAIN }${result}`;
    } catch (error) {
        console.log(error);
        return Promise.reject(error);
    }
}