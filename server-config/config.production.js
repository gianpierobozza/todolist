var config = require('./config.global');
 
config.env = 'production';
config.mongo.uri = 'nodejitsu';
config.web.port = 8080;
 
module.exports = config;