/**
 * Created by Moon Jung Hyun on 2015-11-17.
 */

module.exports.login = function(req, res, next){

};

module.exports.loginSuc = function(req, res, next){
    var user = req.user;
    console.log('loginSuc ', user);
    var msg = {
        code : 200,
        msg : 'Success',
        result : user
    };
    res.status(msg.code).json(msg);
};

module.exports.logFail = function(req, res, next){
    var error = new Error('로그인 실패..');
    error.code = 400;
    return next(error);
};

module.exports.logout = function(req, res){
    req.logout();   // passport session 지우기
    // session 지워줌...
    var msg = {
        code : 200,
        msg : 'Success'
    };
    res.status(msg.code).json(msg);
};
