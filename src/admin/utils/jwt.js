const jwt = require('jsonwebtoken');
const config = require('../../configs/auth');
const redis = require('../../database/init.redis');

module.exports.signAccessToken = async (userId) => {
    return new Promise((resolve, reject) => {
        const payload = {
            userId
        }

        const options = {
            expiresIn: '1h'
        }

        jwt.sign(payload, config.JWT_ACCESS_SECRET, options, (error, token) => {
            if(error) return reject(error);
            resolve(token);
        })
    })
}

module.exports.verifyAccessToken = async (token) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, config.JWT_ACCESS_SECRET, (error, payload) => {
            if(error) return reject(error);
            resolve(payload);
        });
    })
}

module.exports.signRefreshToken = async (userId) => {
    return new Promise((resolve, reject) => {
        const payload = {
            userId
        }

        const options = {
            expiresIn: '1y'
        }

        jwt.sign(payload, config.JWT_REFRESH_SECRET, options, (error, token) => {
            if(error) return reject(error);
            redis.set(userId.toString(), 365 * 24 * 60 * 60, (error, reply) => {
                if(error) return reject(error);
                resolve(token);
            });
        })
    })
}

module.exports.verifyRefreshToken = async (refreshToken) => {
    return new Promise((resolve, reject) => {
        jwt.verify(refreshToken, config.JWT_REFRESH_SECRET, (error, payload) => {
            if(error) return reject(error);

            redis.get(payload.userId, (error, reply) => {
                if(error) return reject(error);

                if(ref === reply)
                {
                    return resolve(payload);
                }

                return reject('Unauthorized');
            });
            
        });
    })
}