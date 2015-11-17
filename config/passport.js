/**
 * Created by Moon Jung Hyun on 2015-11-16.
 */

var mongoose = require('mongoose');
var LocalStrategy = require('passport-local').Strategy;
var User = require('./../models/Users');

var local = require('./passport/local');
//var facebook = require('./passport/facebook');

module.exports = function(passport){
    // session 저장
    passport.serializeUser(function(user, done){
        done(null, user._id);
    });

    passport.deserializeUser(function(id, done){
        User.findUser({criteria : {_id : id}}, function(err, user){
            done(err, user);
        });
    });

    // 사용하는 strategy...
    passport.use(local);
};