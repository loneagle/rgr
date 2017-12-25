const express = require('express');
const router = express.Router();
const Sync = require('sync');
var postTime = require('../models/time');
var User = require('../models/user');
var shortid = require('shortid');

const fs = require('fs');
const jsonfile = require('jsonfile');

const data = JSON.parse(fs.readFileSync('./public/json/list.json'));

router.get('/main', function(req, res){
	if(req.isAuthenticated()){
		res.render('main',{title:'Робочий кабінет'});
	}else{
		req.flash('error_msg', 'Вхід не виконано');
		res.redirect('/users/login');
	}
});

router.get('/settings', function(req, res){
	if(req.isAuthenticated()){
		res.render('settings',{title:'Налаштування'});
	}else{
		req.flash('error_msg', 'Вхід не виконано');
		res.redirect('/users/login');
	}
});

router.get('/commons', function(req, res,next){
	if(req.isAuthenticated()){
		let commons = req.user.usercoms;
		res.render('commons',{title:'Мої товари/послуги',commons: commons});
	}else{
		req.flash('error_msg', 'Ви не ввійшли');
		res.redirect('/users/login');
	}
});

router.post('/commons', function(req, res){
	let commons = req.user.usercoms;
	res.render('commons',{title:'Мої товари/послуги',commons: commons});
});

router.get('/addcom', function(req, res){
	if(req.isAuthenticated()){
		res.render('addcom',{title:'Додати товар'});
	}else{
		req.flash('error_msg', 'Вхід не виконано');
		res.redirect('/users/login');
	}
});

router.post('/places', function(req, res){
	let places = req.user.places;
	let username = req.user.username;

	req.flash('success_msg', 'Обчислення проведено');
	res.redirect('/work/places');
});

router.post('/delcom', function(req, res){
	if(req.isAuthenticated()){
		let username = req.user.username;
		let idcom = req.body.button;
		User.deleteCom(username, idcom, function(err, info){
			if(err) throw err;
		});
		res.redirect('commons');
	}else{
		req.flash('error_msg', 'Вхід не виконано');
		res.redirect('/users/login');
	}
});

router.get('/basket', function(req, res){
	if(req.isAuthenticated()){
		let idcom = req.body.button;
		res.redirect('basket');
	}else{
		req.flash('error_msg', 'Вхід не виконано');
		res.redirect('/users/login');
	}
});

router.post('/basket', function(req, res){
	if(req.isAuthenticated()){
		let idcom = req.body.button;
		res.redirect('basket');
	}else{
		req.flash('error_msg', 'Вхід не виконано');
		res.redirect('/users/login');
	}
});

router.post('/edcom', function(req, res){
if(req.isAuthenticated()){
		res.render('edcom',{title:'Редагувати дані про товар',
		idcom:req.body.button});
	}else{
		req.flash('error_msg', 'Вхід не виконано');
		res.redirect('/users/login');
	}
});

router.post('/edcom1', function(req, res){
	let iduser = req.user.id;
	let idcom = req.body.button;

	let comname = req.body.comname;
	let categ = req.body.categ;
	let price = req.body.price;
	let aboutcom = req.body.aboutcom;

	let procomname;
	let procateg;
	let proprice;
	let proaboutcom;

	if (!(categ)){
		function containscateg(elem) {
			for(let el of data) if(el.name == elem) return true;
			return false;
		}

		if (!(containscateg(categ))){
			req.assert('product.categ', 'Категорія має бути вибраною зі списку').equals(null);
		}
	}	

	if (!comname){
		procomname = req.body.comname;
	}

	if (!price){
		proprice = req.body.comprice;
	}

	if (!aboutcom){
		proaboutcom = req.body.aboutcom;
	}

	if (!categ){
		procateg = req.body.categ;
	}

	if(req.validationErrors()){
		res.render('addcom',{
			errors: req.validationErrors()
		});

	} else {

		let edCom = {
			comname : procomname,
			categ : procateg,
			price : proprice,
			aboutcom : proaboutcom,
		}

		let setEditInfo = {};

		for(var field in edCom){
			if(edCom[field]){
				setEditInfo[field] = edCom[field];
			}
		}

		User.editCom(iduser,idcom,setEditInfo, function(err, info){
			if(err) throw err;
		});

		req.flash('success_msg', 'Ви відредагували місце');

		res.redirect('/work/commons');
	}
});


router.post('/addcom', function(req, res){
	let username = req.user.username;
	let product = {
		id:shortid.generate(),
		comname :req.body.comname,
		categ : req.body.categ,
		price : req.body.price,
		aboutcom : req.body.aboutcom,
		usid : req.user._id,
		username : username
	}

	function containscateg(elem) {
		for(let el of data) if(el.name == elem) return true;
		return false;
	}

	if (!(containscateg(product.categ))){
		req.assert('product.categ', 'Категорія має бути вибраною зі списку').equals(null);
	}

	if(req.validationErrors()){
		res.render('addcom',{
			errors: req.validationErrors()
		});
	} else {

		User.addCom(username, product, function(err, info){
			if(err) throw err;
		});

		req.flash('success_msg', 'Ви додали новий товар');

		res.redirect('commons');
	}
});

module.exports = router;
