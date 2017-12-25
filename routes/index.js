var express = require('express');
var router = express.Router();

// Get Homepage
router.get('/', ensureAuthenticated, function(req, res){
	res.render('index');
});


router.get('/basket', function(req, res){
    if (req.isAuthenticated()) {
  		res.render('basket', {title:'Мій кошик'});
    } else {
        req.flash('error_msg', 'Вхід не виконано');
        res.redirect('/users/login');
    }
});

router.post('/basket', function(req, res){
	console.log(req.body.id, req.body.owner);
});


function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		res.redirect('/')
	} else {
		req.flash('error_msg','Ви не ввійшли');
		res.redirect('/users/login');
	}
}

module.exports = router;
