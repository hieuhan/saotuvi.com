require('dotenv').config();

module.exports = {
    MONGO_USER: process.env.MONGO_USER,
    MONGO_PASSWORD: process.env.MONGO_PASSWORD,
    MONGO_TABLENAME: process.env.MONGO_TABLENAME,
    MONGO_URI: process.env.MONGO_URI
}