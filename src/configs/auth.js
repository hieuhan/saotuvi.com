require('dotenv').config();

module.exports = {
    SALT_FACTOR: parseInt(process.env.SALT_FACTOR),
    JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
    JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET
}