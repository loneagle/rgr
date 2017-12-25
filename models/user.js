var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

// User Schema
var UserSchema = mongoose.Schema({
	username: {
		type: String,
		index:true
	},
	password: {
		type: String
	},
	email: {
		type: String
	},
	usercoms: [],
	coms: []
});

var User = module.exports = mongoose.model('User', UserSchema);

module.exports.createUser = function(newUser, callback){
	bcrypt.genSalt(10, function(err, salt) {
	    bcrypt.hash(newUser.password, salt, function(err, hash) {
	        newUser.password = hash;
	        newUser.save(callback);
	    });
	});
}

module.exports.getUserByUsername = function(username, callback){
	var query = {username: username};
	User.findOne(query, callback);
}

module.exports.getUserByEmail = function(email, callback){
	var query = {email: email};
	User.findOne(query, callback);
}

module.exports.getUserById = function(id, callback){
	User.findById(id, callback);
}

module.exports.comparePassword = function(candidatePassword, hash, callback){
	bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
    	if(err) throw err;
    	callback(null, isMatch);
	});
}

module.exports.editUserName = function (oldUsername,newUsername, callback) {
	var findUser = {username:oldUsername};
	var setnewUsername = {$set:newUsername};
	User.update(findUser, setnewUsername, callback);
}

module.exports.addCom = function(boss, com, callback) {
	var Boss = {username:boss};
	var setCom = {$push:{'usercoms':com}};
	User.update(Boss, setCom, callback);
}

module.exports.editCom = function(iduser, idcom, editComInfo, callback) {
	var findUserCom = {_id:iduser, 'usercoms.id':idcom};
	var editInfo = {};
	
	for (var field in editComInfo){
			editInfo['usercoms.$.'+field] = editComInfo[field];
	}
	var setEditInfo = {
		$set:editInfo
	};
	
	User.update(findUserCom, setEditInfo, callback);
}

module.exports.findPlaceByName = function(boss,placename,callback) {
	var findplacename = {username:boss, 'places.placename':placename};
	User.findOne(findplacename);
}

module.exports.deleteCom = function(boss, idcom, callback ) {
	var Boss = {username:boss};
	var deleteCom = {$pull:{'usercoms':{'id':idcom}}};
	User.update(Boss, deleteCom, callback);
}

//наркоанскй метод
module.exports.findAll = function () {
	User.findOne({}, function(err, result) {
    if (err) throw err;
	});
}