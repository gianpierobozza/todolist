var config = require('./config.global');
 
config.env = 'office';
config.mongo.uri = 'localhost';
config.web.port = 4242;
 
module.exports = config;