/**
 * Created by Moon Jung Hyun on 2015-11-16.
 */
var express = require('express');
var router = express.Router();

var TheRest = require('./../controllers/TheRest');
//var auth = require('./../config/middlewares/authorization');

module.exports = function(passport){
    router.post('/login',
        passport.autheniticate('local',{
            successRedirect : '/loginSuc',
            failureRedirect : '/loginFail'
        }));

    router.get('/loginSuc', TheRest.loginSuc);
    router.get('/loginFail', TheRest.logFail);
};