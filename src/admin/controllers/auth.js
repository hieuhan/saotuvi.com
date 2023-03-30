const { validationResult } = require('express-validator');
const { User } = require('../models');
const bcrypt = require('../utils/bcrypt');
const redis = require('../utils/redis');
const jwt = require('../utils/jwt');
const authConfig = require('../../configs/auth');

module.exports.login = async (request, response, next) => {
    try {

        const accessTokenCookie = request.cookies[authConfig.COOKIE_JWT_ACCESS_SECRET_NAME];

        if (accessTokenCookie) {
            const payload = jwt.verifyAccessToken(accessTokenCookie);

            if (payload.userId){
                return response.redirect('/stv');
            }
        }

        // const hash = await bcrypt.hashPassword('Hthmanutd1011$');
        //await User.deleteMany();
        //seed
        // User.create({
        //     username: 'hieuht',
        //     email: 'hantrunghieu@gmail.com',
        //     password: 'Hthmanutd1011$',
        //     buildIn: true
        // }).then((data) => {
        //     console.log(data)
        // }).catch((error) => {
        //     console.error(error)
        // })
        response.render('admin/auth/login', { dataInput: {}, error: {}, message: '', layout: './admin/layouts/auth' });
    } catch (error) {
        next(error);
    }
}

module.exports.loginPost = async (request, response, next) => {
    try {

        if(request.user){
            return response.redirect('/stv');
        }

        const dataInput = { username, password, returnUrl } = request.body;

        const errors = validationResult(request);

        if (!errors.isEmpty()) {
            return response.render('admin/auth/login', {
                error: errors.mapped(),
                message: '',
                dataInput: dataInput,
                layout: './admin/layouts/auth'
            });
        }

        const userExist = await User.findOne({
            username
        });

        if (!userExist) {
            return response.render('admin/auth/login', {
                error: {},
                message: 'Thông tin đăng nhập không chính xác.',
                dataInput: dataInput,
                layout: './admin/layouts/auth'
            });
        }

        const passwordIsValid = await bcrypt.passwordCompare(password, userExist.password);

        if (!passwordIsValid) {
            return response.render('admin/auth/login', {
                error: {},
                message: 'Thông tin đăng nhập không chính xác.',
                dataInput: dataInput,
                layout: './admin/layouts/auth'
            });
        }

        const { accessToken, refreshToken } = await jwt.generateTokens(userExist._id, userExist.username);

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

            return response.redirect('/stv');
        }

        return response.render('admin/auth/login', {
            error: {},
            message: 'Vui lòng thử lại sau.',
            dataInput: dataInput,
            layout: './admin/layouts/auth'
        });
    } catch (error) {
        next(error);
    }

    response.render('admin/auth/login', { dataInput: {}, error: {}, layout: './admin/layouts/auth' });
}

module.exports.logout = async (request, response, next) => {
    try {
        const refreshToken = request.cookies[authConfig.COOKIE_JWT_REFRESH_SECRET_NAME];

        if (refreshToken) {
            const { payload, reply } = await jwt.verifyRefreshToken(refreshToken);

            if (payload && reply) {

                response.cookie(authConfig.COOKIE_JWT_ACCESS_SECRET_NAME, '', {
                    maxAge: 0,
                    httpOnly: true
                });

                response.cookie(authConfig.COOKIE_JWT_REFRESH_SECRET_NAME, '', {
                    maxAge: 0,
                    httpOnly: true
                });

                await redis.del(payload.userId.toString());
            }
        }

    } catch (error) {
        next(error);
    }

    response.redirect('/');
}