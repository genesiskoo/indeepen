/**
 * Created by Moon Jung Hyun on 2015-11-17.
 */

var User = require('./../models/Users');

module.exports.loginSuc = function(req, res, next){
    var user = req.user;
    console.log('loginSuc ', user);
    User.findMyArtistIds(user.userKey, function(err, doc){
        if(err){
            console.error('ERROR FIND MY ARTIST IDS ', err);
            var error = new Error('artists 를 가져올 수 없음');
            error.code = 400;
            return next(error);
        }
        console.log('artists... ', doc);
        user['artists'] = doc.myArtists;
        var msg = {
            code : 200,
            msg : 'Success',
            result : user
        };
        console.log('msg ', msg);
        res.status(msg.code).json(msg);
    });
};

module.exports.logFail = function(req, res, next){
    var error = new Error('로그인 실패..');
    error.code = 401;
    return next(error);
};

module.exports.logout = function(req, res){
    req.logout();   // passport session 지우기
    // session 지워줌...
    req.session.destroy(function(err){
        if(err){
            console.error('ERROR DESTROY SESSION ', err);
            var error = new Error('세션 제거를 할 수 가 없.... ㅠㅜㅠㅜ');
            error.code = 400;
            return next(error);
        }
        console.log('session 제거 완료');
    });
    var msg = {
        code : 200,
        msg : 'Success'
    };
    res.status(msg.code).json(msg);
};
