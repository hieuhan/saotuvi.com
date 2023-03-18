const mongoose = require('mongoose');
const config = require('../configs/database');

mongoose.set('strictQuery', false);

mongoose.connect(config.MONGO_URI.replace('<username>', config.MONGO_USER).replace('<password>', config.MONGO_PASSWORD)).then(() => {
    console.log('Connected to the database');
}).catch( error => console.error(`Cannot connect to the database => `, error));

// all executed methods log output to console
mongoose.set('debug', true);
    
// disable colors in debug mode
mongoose.set('debug', { color: false });

// get mongodb-shell friendly output (ISODate)
mongoose.set('debug', { shell: true });

module.exports = mongoose;