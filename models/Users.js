
var User = require('./schemas/Users.js');

module.exports.saveUser = function (userInfo, callback) {
    User.create(userInfo, callback);
}

module.exports.findOne = function(key, callback){
    User.findOne(key, '_id email nick profile_photo is_valid.is_valid',callback);
}










