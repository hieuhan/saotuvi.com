const jwt = require('../utils/jwt');
const authConfig = require('../../configs/auth');

module.exports = async (request, response, next) => {
    try {
        const accessTokenCookie = request.cookies[authConfig.COOKIE_JWT_ACCESS_SECRET_NAME];

        if (!accessTokenCookie) {
            return response.redirect(authConfig.LOGIN_PATH);
        }

        const payload = jwt.verifyAccessToken(accessTokenCookie);
        
        if (payload.userId) {
            request.user = payload;
        } else if (payload.name && payload.name == 'TokenExpiredError') {
            const refreshTokenCookie = request.cookies[authConfig.COOKIE_JWT_REFRESH_SECRET_NAME];

            if (!refreshTokenCookie) {
                return response.redirect(authConfig.LOGIN_PATH);
            }

            const { payload, reply } = await jwt.verifyRefreshToken(refreshTokenCookie)

            if (payload && reply) {
                const { accessToken, refreshToken } = await jwt.generateTokens(payload.userId);

                if (accessToken && refreshToken) {
                    response.cookie(authConfig.COOKIE_JWT_ACCESS_SECRET_NAME, accessToken, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === 'production',
                        maxAge: 30 * 24 * 60 * 60 * 100
                    });

                    response.cookie(authConfig.COOKIE_JWT_REFRESH_SECRET_NAME, refreshToken, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === 'production',
                        maxAge: 3.154e10 // 1 year
                    });
                } else {
                    return response.redirect(authConfig.LOGIN_PATH);
                }
            }
            else {
                return response.redirect(authConfig.LOGIN_PATH);
            }
        } else {
            return next(payload);
        }

        return next();

    } catch (error) {
        next(error);
    }
};