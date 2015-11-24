/**
 * Created by Moon Jung Hyun on 2015-11-08.
 */

var formidable = require('formidable'),
    pathUtil = require('path');
var fs = require('fs');
var async = require('async');
var randomstring = require('randomstring');
var AWS = require('aws-sdk');

var awsS3 = require('./../config/s3');
AWS.config.region = awsS3.region;
AWS.config.accessKeyId = awsS3.accessKeyId;
AWS.config.secretAccessKey = awsS3.secretAccessKey;

// Listup All Files
var s3 = new AWS.S3();
var bucketName = awsS3.bucketName;
var uploadUrl = __dirname + '/../upload';
var defaultArtistProfileUrl = 'https://s3-ap-northeast-1.amazonaws.com/in-deepen/images/profile/icon-person.jpg';

var Blog = require('./../models/Blogs');
var User = require('./../models/Users');


/**
 * 개인 Blog 기본 정보 가져오기
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
module.exports.getArtistBlog = function(req, res, next){

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
 * 개인 블로그 프로필 가져오기
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
module.exports.getArtistBlogProfile = function(req, res, next){
    var blogId = req.params.blogId;
    if(!blogId){
        var error = new Error('URL 확인 부탁해요.');
        error.code = 400;
        return next(error);
    }
    Blog.findProfileOfArtistBlog(blogId, function(err, doc){
        if(err){
            console.error('ERROR GETTING PROFILE OF ARTISTBLOG ', err);
           var error = new Error('profile 을 가져올 수 없습니다.');
           error.code = 400;
           return next(error);
        }
        console.log('profile ', doc);
        var info = {
            _id : doc._id,
            _user : doc._user._id,
            email : doc._user.email,
            name : doc._user.name,
            nick : doc._user.nick,
            phone : doc.phone,
            intro : doc.intro,
            type : doc.type,
            isPublic : doc._user.isPublic
        };
        var msg = {
            code : 200,
            msg : 'Success',
            result : info
        };
        res.status(msg.code).json(msg);
    });
};

/**
 * 개인 블로그 프로필 수정하기
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
module.exports.modifyArtistBlogProfile = function(req, res, next){
    var blogId = req.params.blogId;
    if(!blogId){
        var error = new Error('URL 확인 부탁합니다.');
        error.code = 400;
        return next(error);
    }
    var newInfo = {
        nick : req.body.nick,
        intro : req.body.intro,
        name : req.body.name,
        phone : req.body.phone,
        isPublic : req.body.isPublic
    };
    console.log('newInfo ', newInfo);

    Blog.updateProfileOfBlog(blogId, newInfo, function(err, doc){
        if(err){
            console.error('ERROR UPDATING PROFILE AT ARTISTBLOG ', err);
            var error = new Error('Blogs 쪽 update 실패 ㅠㅜ');
            error.code = 400;
            return next(error);
        }
        User.updateProfileAtArtistBlog(doc._user, newInfo, function(err, doc){
            if(err){
                console.error('ERROR UPDATING PROFILE AT USER ', err);
                var error = new Error('Users 쪽 update 실패 ㅠㅜ');
                error.code = 400;
                return next(error);
            }
            var msg = {
                code : 200,
                msg : 'Success'
            };
            res.status(msg.code).json(msg);
        });
    });
};

/**
 * 개인 블로그 프로필 사진 수정하기
 * @param req
 * @param res
 * @param next
 */
module.exports.modifyArtistBlogProfilePhoto = function(req, res, next){
    var blogId = req.params.blogId;
    if(!blogId){
        var error = new Error('URL 확인 부탁해요.');
        error.code = 400;
        return next(errpr);
    }
    async.waterfall(
        [
            function(callback){
                var form = new formidable.IncomingForm();
                form.encoding ='utf-8';
                form.uploadDir = uploadUrl;
                form.keepExtensions = true;
                form.parse(req, function(err, fields, files){
                    if(err){
                        return callback(err, null);
                    }
                    var file = files.file;
                    callback(null, file);
                });
            },
            function(file, callback){
                if(file == null){
                    console.log('not file');
                    callback(null, defaultArtistProfileUrl);
                }else {
                    var randomStr = randomstring.generate(10);
                    var newFileName = 'profile_' + randomStr;
                    var extname = pathUtil.extname(file.name);
                    var contentType = file.type;
                    var fileStream = fs.createReadStream(file.path);
                    var itemKey = 'images/profile/' + newFileName + extname;
                    var params = {
                        Bucket: bucketName,
                        Key: itemKey,
                        ACL: 'public-read',
                        Body: fileStream,
                        ContentType: contentType
                    };
                    s3.putObject(params, function (err, data) {
                        if (err) {
                            console.error('S3 PutObject Error', err);
                            callback(err);
                        }
                        else {
                            var imageUrl = s3.endpoint.href + bucketName + '/' + itemKey;
                            fs.unlink(file.path, function (err) {
                                if (err) {
                                    var error = new Error('파일 삭제를 실패했습니다.');
                                    error.code = 500;
                                    return next(error);
                                } else {
                                    callback(null, imageUrl);
                                }
                            });
                        }
                    });
                }
            },
            function(url, callback){
                Blog.updateProfilePhotoOfBlog(blogId, url, function(err, doc){
                    if(err){
                        console.error('ERROR UPDATING PROFILE PHOTO AT ARTIST BLOG ', err);
                        var error = new Error('Blog Profile 사진을 변경하는데 실패했습니다.');
                        error.code = 500;
                        return next(error);
                    }
                    console.log('doc ', doc);
                    User.updateProfilePhoto(doc._user, url, function(err, doc){
                        if(err){
                            console.error('ERROR UPDATING PROFILE PHOTO OF USER ', err);
                            var error = new Error('User Profile 사진을 변경하는데 실패했습니다.');
                            error.code=  500;
                            return next(error);
                        }
                        callback();
                    });
                });
            }
        ],
        function(err){
            if(err){
                res.sendStatus(500);
            }else{
                var msg = {
                    code : 200,
                    msg : 'Success'
                };
                res.status(msg.code).json(msg);
            }
        }
    )
};