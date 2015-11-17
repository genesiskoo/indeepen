/**
 * Created by Moon Jung Hyun on 2015-11-16.
 */

var mongoose = require('mongoose');
var LocalStrategy = require('passport-local').Strategy;

var User = require('./../../models/Users');

module.exports = new LocalStrategy({
    usernameField : 'email',
    passwordField : 'password'
},
function(email, password, done){
    var options = {
        criteria : {email : email},
        select : '_id name nick email hashed_password salt'
    };
    User.findUser(options, function(err, doc){
        if(err) done(err);
        if(!doc){
            return done(null, false, {message : '일치하는 정보가 없습니다.'});
        }
        if(!doc.authenticate(password)){
            return done(null, false, {message : '일치하는 정보가 없습니다.'});
        }
        return done(null, user);
    });
});