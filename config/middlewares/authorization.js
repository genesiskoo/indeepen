/**
 * Created by Moon Jung Hyun on 2015-11-16.
 */

module.exports.requiresLogin = function(req, res, next){
    if(req.isAuthenticated()) return next();
    var error = new Error('로그인 필요...');
    error.code = 401; // Unauthorized
    return next(error);
};

module.exports.user = {
    hasAuthorization : function(req, res, next){
        if(req.profile.id != req.user.id){
            //req.flash('info', 'You are not authorized');
            console.log('authorization의 user hasAuthorization.');
            var error = new Error('You are not authorized');
            error.code = 401;
            return next(error);
        }
        next();
    }
}
