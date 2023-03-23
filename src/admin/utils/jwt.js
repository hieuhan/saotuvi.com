const jwt = require('jsonwebtoken');
const config = require('../../configs/auth');
const redis = require('../utils/redis');

module.exports.generateTokens = async (userId, username) => {
    try {
        const payload = { userId, username };

        const accessToken = jwt.sign(
            payload,
            config.JWT_ACCESS_SECRET,
            { expiresIn: '5m' }
        );

        const refreshToken = jwt.sign(
            payload,
            process.env.JWT_REFRESH_SECRET,
            { expiresIn: '1y' }
        );

        const redisSet = await redis.setEx(payload.userId.toString(), refreshToken, 365 * 24 * 60 * 60);

        if (redisSet != null) {
            return Promise.resolve({ accessToken, refreshToken });
        }

        return Promise.reject(false);
    } catch (error) {
        console.error(error);
        return Promise.reject(error);
    }
}

module.exports.authencation = async (request, response, next) => {
    try {

        const accessToken = request.cookies.stvt;

        if (!accessToken) {
            return response.redirect('/stv/login');
        }

        const payload = this.verifyAccessToken(accessToken);

        if (payload.userId) {
            request.user = payload;
        } else if (payload instanceof jwt.TokenExpiredError) {
            console.log('token hết hạn')
            const refreshToken = request.cookies.stvrt;

            if (!refreshToken) {
                return response.redirect('/stv/login');
            }

            const { userId, reply } = await this.verifyRefreshToken(refreshToken)

            if(userId && reply)
            {

            }

        } else {

        }

        //access token hết hạn => check refresh token để tạo access token mới
        if (payload instanceof jwt.TokenExpiredError) {
            const refreshToken = request.cookies.stvrt;
        }
        else if (payload instanceof Error) {
            return next(payload);
        } else {

        }
        //console.log(payload instanceof jwt.TokenExpiredError);
        //console.log(payload.message)
        // const payload = await this.verifyAccessToken(accessToken).then((payload) => {
        //     return payload;
        // }).catch((error) => {
        //     return error;
        // })
        // console.log(payload.name)
        // if(payload.name == 'TokenExpiredError'){

        // }else{

        // }

    } catch (error) {
        //console.error(error);

        return Promise.reject(error);
    }
}

module.exports.signAccessToken = async (userId) => {
    return new Promise((resolve, reject) => {
        const payload = {
            userId
        }

        const options = {
            expiresIn: '5m'
        }

        jwt.sign(payload, config.JWT_ACCESS_SECRET, options, (error, token) => {
            return !error ? resolve(token) : reject(error);
        });
    });
}

module.exports.verifyAccessToken = (token) => {
    return jwt.verify(token, config.JWT_ACCESS_SECRET, (error, payload) => {
        return !error ? payload : error;
    });
}

module.exports.signRefreshToken = async (userId) => {
    const payload = {
        userId
    }

    const options = {
        expiresIn: '1y'
    }

    return new Promise((resolve, reject) => {
        jwt.sign(payload, config.JWT_REFRESH_SECRET, options, (error, token) => {
            return !error ? resolve(token) : reject(error);
        })
    })
}

module.exports.verifyRefreshToken = async (refreshToken) => {
    let payload, reply;
    try {
        payload = jwt.verify(refreshToken, config.JWT_REFRESH_SECRET, (error, payload) => {
            return !error ? payload : error;
        });

        if (payload.userId) {
            reply = await redis.get(payload.userId);

            if (refreshToken === reply) {
                return { payload, reply };
            }
        }
    } catch (error) {
        console.error(error);
        return Promise.reject(error);
    }

    return { payload, reply };
}