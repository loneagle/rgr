const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
const mongo = require('mongodb');
var mongoose = require('mongoose');
var User = require('./models/user');

mongoose.connect('mongodb://localhost/forpoliv');
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var postTime = require('./models/time');
var routes = require('./routes/index');
var users = require('./routes/users');
var work = require('./routes/work');

// Init App
let app = express();

// View Engine
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({defaultLayout:'layout'}));
app.set('view engine', 'handlebars');

// BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// Express Session
app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
}));

// Passport init
app.use(passport.initialize());
app.use(passport.session());

// Express Validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

// Connect Flash
app.use(flash());

// Global Vars
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});

app.get('/index', function (req, res) {
  User.find({}, function(err, users) {
    var userMap = {};
    let i = 0;
    users.forEach(function(user) {
      userMap[i] = user;
      i++;
    }); 
    res.render('index', {title:'Головна',users:userMap});
  });
});

app.post('/index', function (req, res) {
  User.find({}, function(err, users) {
    var userMap = {};
    let i = 0;
    users.forEach(function(user) {
      userMap[i] = user;
      i++;
    }); 
    res.render('index', {title:'Головна',users:userMap});
  });
});

app.use('/', routes);
app.use('/users', users);
app.use('/work', work);

app.use(function (req, res, next) {
  res.status(404);
  res.render('404',{
    title: '404',
    show:false});
});

// Set Port
app.set('port', (process.env.PORT || 8888));

app.listen(app.get('port'), function(){
  console.log('Server started on port '+app.get('port'));
});
