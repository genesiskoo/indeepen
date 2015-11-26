/**
 * Created by Moon Jung Hyun on 2015-11-16.
 */

module.exports.requiresLogin = function(req, res, next){
    if(req.isAuthenticated()) return next();
    var error = new Error('로그인 필요...');
    error.code = 401; // Unauthorized
    return next(error);
};
var Post = require('./../../models/Posts');
module.exports.post = {
    hasAuthorization : function(req, res, next){
        var postId = req.params.postId;
        console.log('post authorization postId ', postId);
        Post.findOne({_id : postId}).
            select('_writer').
            populate('_writer', '_user').
            exec(function(err, doc){
                if(err){
                    console.error('ERROR @ POST AUTH ', err);
                    var error = new Error('writer 정보 가져오기 실패');
                    error.code = 400;
                    return next(error);
                }
                if(!doc){
                    var error = new Error('post id 다시 확인하셈요');
                    error.code = 404;
                    return next(error);
                }
                console.log('doc ', doc);
                if(doc._writer._user == req.user.userKey){
                    console.log('ok');
                    next();
                }else{
                    var error = new Error('권한 없음요.');
                    error.code = 401;
                    return next(error);
                }
            });
    }
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
};



module.exports.artistBlog = {
    hasAuthorization : function(req, res, next){
        console.log('req.blogId')
    }
};
