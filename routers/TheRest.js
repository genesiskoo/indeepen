/**
 * Created by Moon Jung Hyun on 2015-11-16.
 */
var express = require('express');
var TheRest = require('./../controllers/TheRest');
//var auth = require('./../config/middlewares/authorization');

module.exports = function(app, passport){
    app.post('/login',
        passport.authenticate('local',{
            successRedirect : '/loginSuc',
            failureRedirect : '/loginFail'
        }));

    app.get('/loginSuc', TheRest.loginSuc);
    app.get('/loginFail', TheRest.logFail);
};