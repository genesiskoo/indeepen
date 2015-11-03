var Counters = require('./Counters.js');
var User = require('./schemas/Users.js');

module.exports.saveUser = function (userInfo, callback) {
	Counters.getNextSeq('users', function (err, seq) {
		if (err) {
			console.error("ERROR OF GETTING AUTO_INCREMENT :", err);
			return;
		}
		console.log('next sq', seq);
		userInfo._id = seq.seq;
		User.create(userInfo, callback);
	});
}

module.exports.findOne = function(key, callback){
	User.findOne(key, '_id email nick profile_photo is_valid.is_valid',callback);
}





