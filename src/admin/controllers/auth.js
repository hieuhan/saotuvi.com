const { validationResult } = require('express-validator');
const userModel = require('../models/user.model');
const bcrypt = require('../utils/bcrypt');
const redis = require('../../database/init.redis');
const jwt = require('../utils/jwt');

module.exports.login = (request, response, next) => {
    try {
        response.render('admin/auth/login', { title: 'Đăng nhập hệ thống quản trị nội dung saotuvi.com', dataInput : {}, error: {}, layout: './admin/layouts/auth' });
    } catch (error) {
        next(error);
    }
}

module.exports.loginPost = async (request, response, next) => {
    try {
        const { email, password, comeback } = request.body;

        const errors = validationResult(request);

        if (!errors.isEmpty()) {
            //request.flash('fail', 'Please check your form')
            return response.render('admin/auth/login', {
                title: 'Login To Your Account',
                error: errors.mapped(),
                dataInput: { email, password },
                layout: './admin/layouts/auth'
                //flashMessage: Flash.getMessage(req)
            });
        }

        const userExists = await userModel.findOne({
            email
        });

        if(!userExists){

        }

        const passwordIsValid = await bcrypt.passwordCompare(password, userExists.password);

        if(!passwordIsValid)
        {

        }

        const accessToken = await jwt.signAccessToken(userExists._id);
        const refreshToken = await jwt.signRefreshToken(userExists._id);

        response.cookie('stv_token', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60
        });

        response.cookie('stv_rtoken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 365 * 24 * 60 * 60
        });
        
        return response.redirect('/stv');

        response.render('admin/auth/login', { title: 'Đăng nhập hệ thống quản trị nội dung saotuvi.com', dataInput : {}, error: {}, layout: './admin/layouts/auth' });
    } catch (error) {
        next(error);
    }
}

module.exports.refreshToken = (request, response, next) => {
    try {
        
    } catch (error) {
        next(error);
    }
}

module.exports.logout = async (request, response, next) => {
    try {
        const refreshToken = req.cookies.stv_token;

        if(refreshToken)
        {
            const { userId } = await jwt.verifyRefreshToken(refreshToken);

            if(userId)
            {
                redis.del(userId.toString(), (error, reply) => {
                    if(error)
                    {

                    }

                    response.redirect('/');
                })
            }
        }

    } catch (error) {
        next(error);
    }
}