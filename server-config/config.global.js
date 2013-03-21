var config = module.exports = {};
 
config.env = 'development';

//web server
config.web = {};
config.web.port = 4242;
 
//mongo database
config.mongo = {};
config.mongo.uri = '192.168.1.111';
config.mongo.port = '27017';
config.mongo.db = 'todolistdb';