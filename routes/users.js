var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var User = require('../models/user');

// Register
router.get('/register', function(req, res){
	res.render('register');
});

// Login
router.get('/login', function(req, res){
	res.render('login');
});

router.get('/profile', function(req, res){
	res.render('profile');
});

// Register User
router.post('/register', function(req, res){
	var email = req.body.email;
	var username = req.body.username;
	var password = req.body.password;
	var password2 = req.body.password2;

	// Validation
	req.checkBody('email', 'Введення Email обовяз\'кове').notEmpty();
	req.checkBody('email', 'Адреса Email некоректна').isEmail();
	req.checkBody('username', 'Введення імені').notEmpty();
	req.checkBody('password', 'Введення паролю обовяз\'кове').notEmpty();
	req.checkBody('password2', 'Перевірте правильність введення паролю').equals(req.body.password);

	var errors = req.validationErrors();

	if(errors){
		res.render('register',{
			errors:errors
		});
	} else {
		var newUser = new User({
			email:email,
			username: username,
			password: password
		});

		User.createUser(newUser, function(err, user){
			if(err) throw err;
			console.log(user);
		});

		req.flash('success_msg', 'Ви зареєструвалися');

		res.redirect('/users/login');
	}
});

passport.use(new LocalStrategy(
  function(username, password, done) {
   User.getUserByUsername(username, function(err, user){
   	if(err) throw err;
   	if(!user){
   		return done(null, false, {message: 'Невідомий користувач'});
   	}

   	User.comparePassword(password, user.password, function(err, isMatch){
   		if(err) throw err;
   		if(isMatch){
   			return done(null, user);
   		} else {
   			return done(null, false, {message: 'Неправильний пароль'});
   		}
   	});
   });
  }));

// router.post('/profile', function(req, res){
// 	var username = req.body.username;
// 	var password = req.body.password;
// 	var password2 = req.body.password2;
//
// 	// Validation
// 	if (password !== null && password !== ''){
// 		req.checkBody('password2', 'Перевірте правильність введення нового паролю').equals(req.body.password);
// 	}
// 	var errors = req.validationErrors();
//
// 	if(errors){
// 		res.render('profile',{
// 			errors:errors
// 		});
// 	} else {
//
// 		var edUser = new User({
// 			email:email,
// 			username: username,
// 			password: password
// 		});
//
// 		User.editUser(edUser, function(err, user){
// 			if(err) throw err;
// 		});
//
// 		req.flash('success_msg', 'Зміна даних профілю пройшла успішно');
//
// 		res.redirect('/work/main');
// 	}
// });

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});

router.post('/login',
  passport.authenticate('local', {successRedirect:'/index', failureRedirect:'/users/login',failureFlash: true}),
  function(req, res) {
    res.redirect('/');
  });

router.get('/logout', function(req, res){
	req.logout();
	res.redirect('/index');
});

module.exports = router;
