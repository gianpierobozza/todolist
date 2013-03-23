var application_root = __dirname,
    express = require('express'),
    path = require('path'),
    mongoose = require('mongoose'),
    cfg = require('./server-config')

var server = express();

// Database
mongoose.connect('mongodb://'+cfg.mongo.uri+':'+cfg.mongo.port+'/'+cfg.mongo.db, function(err) {
    if (err) throw err;
});

// Config
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
      res.send(200);
    }
    else {
      next();
    }
};
server.configure(function () {
	server.use(allowCrossDomain);
	server.use(express.bodyParser());
	server.use(express.methodOverride());
	server.use(server.router);
  	server.use('touch', express.static(path.join(application_root, 'touch')));
  	server.use('/', express.static(application_root));
  	server.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

var toDoSchema = new mongoose.Schema({
    u_id: String,   // user_id
    t: String,      // title
    d: String,      // description
    dd: Date,       // due_date
    st: String,     // start_date
    et: String,     // end_date
    ad: Boolean,    // all_day
    c: Boolean      // completed
});

var toDoModel = mongoose.model('todos', toDoSchema);

var userSchema = new mongoose.Schema({
    u_id: String,   // user_id
    n: String,      // name
    s: String,      // surname
    u: String,      // username
    p: String,      // password
    e: String       // email
});

var userModel = mongoose.model('users', userSchema);

// GET - get all todos
server.get('/api/todos', function (req, res, next){
    console.log("get - all");
    return toDoModel.find({'u_id': req.query.u_id}, function (err, todos) {
        if (!err) {
            return res.jsonp({'todos':todos});
        } else {
            return console.log(err);
        }
    });
});

// POST - create a single todo
server.post('/api/todos', function (req, res, next){
    console.log("post - create");
    console.log("POST: ");
    console.log(req.body);
    var todo;
    todo = new toDoModel({
        u_id: req.query.u_id,
        t: req.body.t,
        d: req.body.d,
        dd: new Date(req.body.dd*1000),
        st: req.body.st,
        et: req.body.et,
        ad: req.body.ad,
        c: false
    });
    todo.save(function (err) {
        if (!err) {
            return console.log("created");
        } else {
            return console.log(err);
        }
    });
    return res.send(todo);
});

// GET - get 1 todo by _id
server.get('/api/todos/:id', function (req, res, next){
    console.log("get - one");
    return toDoModel.findById(req.params.id, function (err, todo) {
        if (!err) {
            return res.jsonp({'todos':todo});
        } else {
            return console.log(err);
        }
    });
});

// PUT - update a todo by _id
server.put('/api/todos/:id', function (req, res, next){
    console.log("put - update id: " + req.params.id);
    return toDoModel.findById(req.params.id, function (err, todo) {
        todo.t = req.body.t;
        todo.d = req.body.d;
        todo.dd = new Date(req.body.dd*1000), // convert the date to ISO Date
        todo.st = req.body.st,
        todo.et = req.body.et,
        todo.ad =  req.body.ad,
        todo.c = req.body.c
        return todo.save(function (err, todo) {
            if (!err) {
                console.log("updated");
            } else {
                console.log(err);
            }
            return res.jsonp({'todos':todo});
        });
    });
});

// DELETE - delete a todo by _id
server.delete('/api/todos/:id', function (req, res, next){
    console.log('delete');
    return toDoModel.findById(req.params.id, function (err, todo) {
        return todo.remove(function (err) {
            if (!err) {
                console.log("removed");
                return res.send('');
            } else {
                console.log(err);
            }
        });
    });
});

// GET - get 1 user by n (username)
server.get('/api/users/:u', function (req, res, next){
    console.log("get - user");
    console.log(req.params);
    return userModel.find({'u': req.params.u}, function (err, user) {
        if (!err) {
            return res.jsonp({'users':user});
        } else {
            return console.log(err);
        }
    });
});

server.get('/api', function (req, res, next) {
    res.send('API is running');
});

server.get('/', function(req, res, next) {
    res.sendfile('index.html');
});

server.post('/login', function(req, res, next) {
    console.log("post - login");
    console.log("POST: ");
    console.log(req.body);
    return userModel.find({'u': req.body.user}, function (err, users) {
        if (!err) {
            if(users[0]) {
                if (users[0].p == req.body.pwd) {
                    return res.json({'success':true,'message':'login successful','user_id':users[0].u_id});
                }
                else {
                    return res.json({'success': false,'message':'wrong password'});
                }
            } else {
                return res.json({'success': false,'message':'user not found'});
            }
        } else {
            return res.json({'success': false,'message':'login error'});
        }
    });
    //res.json({'success':true,'message':'login successful','sessionToken':'aaa'});
    //res.json({'success': false,'message':'login unsuccessful'});
});

server.post('/logout', function(req, res, next) {
    res.json({'success':true,'message':'logoff successful'});
    //res.json({'success': false,'message':'logoff unsuccessful'});
});

// Launch server

server.listen(cfg.web.port);
console.log('Listening on port ' + cfg.web.port);
