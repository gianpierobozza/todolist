/* git commit test */

var application_root = __dirname,
    express = require("express"),
    path = require("path"),
    mongoose = require('mongoose');

var app = express();

// Database

mongoose.connect('mongodb://192.168.1.111:27017/todolistdb', function(err) {
//mongoose.connect('mongodb://localhost:27017/todolistdb', function(err) {
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
app.configure(function () {
	app.use(allowCrossDomain);
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(app.router);
  	app.use('touch', express.static(path.join(application_root, 'touch')));
  	app.use('/', express.static(application_root));
  	app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

var toDoSchema = new mongoose.Schema({
    u_id: String,
    t: String,
    d: String,
    dd: Date,
    st: String,
    et: String,
    ad: Boolean,
    c: Boolean
}, {
    collection: 'todo'
});

var toDoModel = mongoose.model('todo', toDoSchema);

// GET - get all todos
app.get('/api/todos', function (req, res, next){
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
app.post('/api/todos', function (req, res, next){
	console.log("post - create");
    var todo;
    console.log("POST: ");
    console.log(req.body);
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
app.get('/api/todos/:id', function (req, res, next){
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
app.put('/api/todos/:id', function (req, res, next){
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
app.delete('/api/todos/:id', function (req, res, next){
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

app.get('/api', function (req, res, next) {
  res.send('API is running');
});

app.get('/', function(req,res) {
    res.sendfile('index.html');
});

// Launch server

app.listen(4242);
console.log('Listening on port 4242');
