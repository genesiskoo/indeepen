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

    app.get('/logout', TheRest.logout);

    app.post('/auth/facebook/token', function(req, res, next){
        passport.authenticate('facebook-token', function(err, user, msg, status){
            console.log('user : ', user, ' msg : ', msg, ' status : ', status );
            req.logIn(user, function(err){
                if(err){
                    console.error('ERROR @ req.logIn ', err);
                    var error = new Error('로스인 실패');
                    error.code = 401;
                    return next(error);
                }
                var msg = {
                    code : 200,
                    msg : '로그인 성공',
                    result : user
                };
                res.status(msg.code).json(msg);
            });
        });
    });
};