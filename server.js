const config = require('./src/configs');
const app = require('./src/app');

const server = app.listen( config.PORT, () => {
    console.log(`Server start with port ${ config.PORT }.`);
});