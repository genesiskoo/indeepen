/**
 * Created by Moon Jung Hyun on 2015-11-08.
 */
var Blog = require('./../models/schemas/Blogs');

var userKey = '563ef1ca401ae00c19a15829'; // session에 있을 정보
var blogKey = '563ef1ca401ae00c19a15832'; // session에 있을 정보

/**
 * 개인 Blog 기본 정보 가져오기
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
module.exports.getArtistBlog = function(req, res, next){
    var blogId = req.params.blogId;
    if(!blogId){
        var error = new Error('URL 확인 부탁해요.');
        error.code = 400;
        return next(error);
    }

    Blog.findOneBlog(blogId, function(err, doc){
        if(err){
           console.error('ERROR GETTING BLOG INFO ', err);
           var error = new Error('블로그에 들어갈 수 없습니다.');
           error.code =400;
           return next(error);
        }
        var msg = {
            code : 200,
            msg : 'Success',
            result : doc
        };
        res.status(msg.code).json(msg);
    });
};

/**
 * 개인 블로그 프로필 사진 가져오기
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
module.exports.getArtistBlogProfilePhoto = function(req, res, next){
    var blogId = req.params.blogId;
    if(!blogId){
        var error = new Error('URL 확인 부탁해요.');
        error.code = 400;
        return next(error);
    }
    Blog.findProfilePhotoOfBlog(blogId, function(err, doc){
        if(err){
            var error = new Error('프로필 사진을 가져올 수 없습니다.');
            error.code = 400;
            return next(error);
        }
        var msg = {
            code : 200,
            msg : 'Success',
            result : doc
        };
        res.status(msg.code).json(msg);
    });
};

/**
 * 개인 블로그 배경 사진 가져오기
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
module.exports.getArtistBlogBgPhoto = function(req, res, next){
    var blogId = req.params.blogId;
    if(!blogId){
        var error = new Error('URL 확인 부탁해요.');
        error.code = 400;
        return next(err);
    }
    Blog.findBgPhotoOfBlog(blogId, function(err, doc){
        var msg = {
            code : 200,
            msg : 'Success',
            result : doc
        };
        res.status(msg.code).json(msg);
    });
};