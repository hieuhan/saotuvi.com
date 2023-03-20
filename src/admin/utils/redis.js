const redis = require('../../database/init.redis');

module.exports.get = async (key) => {
    let result = null;
    try {
        result = await redis.get(key);
    }
    catch (error) {
        console.log(error);
    }
    return result;
}

module.exports.setEx = async (key, value, seconds) => {
    let result = null;
    try {
        result = await redis.setEx(key, seconds, value);
    } catch (error) {
        console.log(error);
    }

    return result;
}

module.exports.del = async (key) => {
    let result = null;
    try {
        result = await redis.del(key)
    } catch (error) {
        console.log(error);
    }

    return result;
}