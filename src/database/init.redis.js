const redis = require('redis');
const config = require('../configs/redis');

const client = redis.createClient({
    port: config.REDIS_HOST,
    host: config.REDIS_HOST
});

client
  .connect()
  .then( (res) => {
    console.log('Connected to redis');
  })
  .catch(error => {
    console.log(`Connect redis error: ${error}`);
  });

module.exports = client;