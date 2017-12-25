var express = require('express');
var router = express.Router();

// Get Homepage
router.get('/', ensureAuthenticated, function(req, res){
	res.render('index');
});

function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		res.redirect('/index')
	} else {
		req.flash('error_msg','Ви не ввійшли');
		res.redirect('/index');
	}
}

module.exports = router;
