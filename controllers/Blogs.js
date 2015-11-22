/**
 * Created by Moon Jung Hyun on 2015-11-09.
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

var Blog = require('./../models/Blogs');
var Post = require('./../models/Posts');
var User = require('./../models/Users');

var defaultBgPhotoUrl = 'https://s3-ap-northeast-1.amazonaws.com/in-deepen/images/bg/default_bg.png';
var userKey = '563ef1ca401ae00c19a15828'; // session에 있을 정보
var blogKey = '563ef1cb401ae00c19a15838'; // session에 있을 정보

var perPage = 30;

/**
 * 공간/개인 블로그 기본 정보 가져오기
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
module.exports.getBlogInfo = function(req, res, next){
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
 * 공간/개인 블로그 배경 사진 수정하기
 * @param req
 * @param res
 * @param next
 */
module.exports.modifyBgOfBlog = function(req, res, next){
    var blogId = req.params.blogId;
    if(!blogId){
        var error = new Error('URL 확인 부탁해요.');
        error.code = 400;
        return next(error);
    }
    async.waterfall(
        [
            function(callback){
                var form = new formidable.IncomingForm();
                form.encoding = 'utf-8'
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
                    callback(null, defaultBgPhotoUrl);
                }else{
                    var randomStr = randomstring.generate(10);
                    var newFileName = 'bg_'+randomStr;
                    var extname = pathUtil.extname(file.name);
                    var contentType = file.type;
                    var fileStream = fs.createReadStream(file.path);
                    var itemKey = 'images/bg/'+newFileName+extname;
                    var params = {
                        Bucket : bucketName,
                        Key : itemKey,
                        ACL : 'public-read',
                        Body : fileStream,
                        ContentType : contentType
                    };
                    s3.putObject(params, function(err, data){
                        if(err){
                            console.error('S3 PutObject Error ', err);
                            callback(err);
                        }
                        else{
                            var imageUrl = s3.endpoint.href+bucketName+'/'+itemKey;
                            fs.unlink(file.path, function(err){
                                if(err){
                                    console.log('ERROR UNLINK FILE AT BLOG BG ', err);
                                    callback(err);
                                }else{
                                    callback(null, imageUrl);
                                }
                            });
                        }
                    });
                }
            },
            function(url, callback){
                Blog.updateBgPhotoOfBlog(blogId, url, function(err, doc){
                    if(err){
                        var error = new Error('배경사진을 변경하는데 실패했습니다.');
                        error.code = 500;
                        return next(error);
                    }
                    callback();
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
                res.status(msg).json(msg);
            }
        }
    )
};

/**
 * 공간/개인 블로그의 팬 목록 가져오기
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
module.exports.getFansOfBlog = function(req, res, next){
    var blogId = req.params.blogId;
    if(!blogId){
        var error = new Error('URL 확인 부탁해요.');
        error.code = 400;
        return next(error);
    }
    var isStart = req.query.isStart;
    var nextPage = 1;
    var tmp = 'fans_'+blogId;
    if(!isStart){
        console.log('defore ', req.session[tmp]);
        nextPage = req.session[tmp];
        if(!nextPage){
            nextPage = 1;
        }
    }
    var page = {
        from : perPage * (nextPage-1),
        to : perPage
    };
    Blog.findFansOfBlog(blogId, page, function(err, doc){
        if(err){
            console.error('ERROR GETTING FANS OF BLOG ', err);
            var error = new Error('Fans 을 가져올 수 없습니다.');
            error.code = 400;
            return next(error);
        }
        console.log('doc ', doc);
        req.session[tmp] = (++nextPage);
        console.log('after ',req.session[tmp]);
        if(doc.length != 0){
            var msg = {
                code : 200,
                msg : 'Success',
                result : doc
            };
            res.status(msg.code).json(msg);
        }else{
            var error = new Error('더 이상 없음.');
            error.code = 404;
            return next(error);
        }
    });
};

/**
 * 공간/개인 블로그의 예술가 목록 가져오기
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
module.exports.getArtistsOfBlog = function(req, res, next){
    var blogId = req.params.blogId;
    if(!blogId){
        var error = new Error('URL 확인 부탁해요.');
        error.code = 400;
        return next(error);
    }
    var isStart = req.query.isStart;
    var nextPage = 1;
    var tmp = 'artists_'+blogId;
    if(!isStart){
        console.log('defore ', req.session[tmp]);
        nextPage = req.session[tmp];
        if(!nextPage){
            nextPage = 1;
        }
    }
    var page = {
        from : perPage * (nextPage-1),
        to : perPage
    };
    Blog.findUserIdOfBlog(blogId, function(err, id){
        if(err){
            console.error('ERROR FIND ARTIST BLOG ID OF USER ', err);
            var error = new Error('artist blog id 가져오기 실패.. ㅠㅜ');
            error.code = 400;
            return next(error);
        }
        console.log('user id ', id);
        User.findMyArtists(id._user, page, function(err, docs){
            if(err){
                console.error('ERROR FIND MY ARTISTS ', err);
                var error = new Error('my artists 가져오기 실패');
                error.code = 400;
                return next(error);
            }
            console.log('my artist ', docs);

            if(docs.length != 0){
                req.session[tmp] = (++nextPage);
                var msg = {
                    code : 200,
                    msg : 'Success',
                    result : docs
                };
                res.status(msg.code).json(msg);
            }else{
                var error = new Error('더 이상 없음');
                error.code = 404;
                return next(error);
            }
        });
    });
};

/**
 * 공간/개인 블로그 팬 신청/취소하기
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
module.exports.changeFanOfBlog = function(req, res, next){
    var blogId = req.params.blogId;
    var fanStatus = req.params.fanStatus;
    var blogKey = req.body.blogKey;
    var userKey = req.body.userKey;
    if(!blogId || !fanStatus){
        var error = new Error('URL 확인 부탁해요.');
        error.code = 400;
        return next(error);
    }
    if(fanStatus == 'fan'){
        Blog.pushFanToBlog(blogId, blogKey, function(err, doc){
            if(err){
                console.error('ERROR PUSHING FAN TO BLOG', err);
                var error = new Error('fan을 할 수가 없습니다.');
                error.code = 400;
                return next(error);
            }
            User.pushMyArtists(userKey, blogId, function(err, doc){
                if(err){
                    console.error('ERROR PUSHING MY ARTISTS TO USER',err);
                    var error = new Error('My Artist 추가 오류... ㅠㅡㅠ');
                    error.code = 400;
                    return next(error);
                }
                console.log('user doc ', doc);
                var msg = {
                    code : 200,
                    msg : 'Success'
                };
                res.status(msg.code).json(msg);
            });
        });
    }else if(fanStatus == 'unfan'){
        Blog.pullFanFromBlog(blogId, blogKey, function(err, doc){
            if(err){
                console.error('ERROR PULLING FAN TO BLOG ', err);
                var error = new Error('fan 취소를 할 수가 없습니다.');
                error.code = 400;
                return next(error);
            }
            User.pullMyArtists(userKey, blogId, function(err, doc){
                if(err){
                   console.error('ERROR PULLING MY ARTISTS FROM USER ', err);
                   var error = new Error('My Artist 제거 오류... ㅠㅜㅠ');
                   error.code = 400;
                   return next(error);
                }
                console.log('user doc ', doc);
                var msg = {
                    code : 200,
                    msg : 'Success'
                };
                res.status(msg.code).json(msg);
            });
        });
    }else{
        var error = new Error('fanStatus is only "fan" or "unfan"');
        error.code =400;
        return next(error);
    }
};

/**
 * 공간/개인 블로그 i miss you 를 한 회원 목록 가져오기
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
module.exports.getiMissYous = function(req, res, next){
    var blogId = req.params.blogId;
    if(!blogId){
        var error = new Error('URL 확인 부탁해요.');
        error.code = 400;
        return next(error);
    }
    var isStart = req.query.isStart;
    var nextPage = 0;
    var tmp = 'imy_'+blogId;
    if(!isStart){
        console.log('before ', req.session[tmp]);
        nextPage = req.session[tmp];
        if(!nextPage){
            nextPage = 0;
        }
    }
    var page = {
        from : perPage * nextPage,
        to : perPage
    };
    Blog.findIMissYousOfBlog(blogId, page, function(err, docs){
        if(err){
           var error = new Error('iMissYous 를 가져올 수 없습니다.');
           error.code = 400;
           return next(error);
        }
        console.log('doc ', docs);
        if(docs.length != 0){
            req.session[tmp] = (++nextPage);
            var msg = {
                code : 200,
                msg : 'Success',
                result : docs
            }
            res.status(msg.code).json(msg);
        }else{
            var error = new Error('더 이상 없음.');
            error.code = 404;
            return next(error);
        }
    });
};

/**
 * 공간/개인 블로그 i miss you 저장하기
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
module.exports.addiMissYou = function(req, res, next){
    var blogId = req.params.blogId;
    if(!blogId){
        var error = new Error('URL 확인 부탁해요.');
        error.code = 400;
        return next(error);
    }
    Blog.pushIMissYouToBlog(blogId, blogKey, function(err, doc){
        if(err){
            console.error('ERROR PUSHING IMISSYOUS ', err);
            var error = new Error('iMissYou를 할 수 없습니다.');
            error.code = 400;
            return next(error);
        }
        console.log(doc);
        var msg = {
            code : 200,
            msg : 'Success'
        };
        res.status(msg.code).json(msg);
    });
};

/**
 * 해당 블로거가 등록한 Work Post 목록 가져오기
 * @param req
 * @param res
 * @param next
 */
module.exports.getWorkPostsOfBlogger = function(req, res, next){
    var blogId = req.params.blogId;
    var isStart = req.query.isStart;
    if(!blogId){
        var error = new Error('URL 확인 부탁해요.');
        error.code = 400;
        return next(error);
    }
    var lastSeenOfMyWork = null;
    var tmpKey = 'mw'+blogId;
    if(!isStart){
        lastSeenOfMyWork = req.session[tmpKey];
    }

    Post.findWorkPostsAtBlog(blogId, lastSeenOfMyWork, function(err, docs){
        if(err){
            console.error('ERROR GETTING WORK PORST AT BLOG ', err);
            var error = new Error('work post를 가져올 수 없습니다.');
            error.code = 400;
            return next(error);
        }
        if(docs.length != 0){
            async.each(docs, function(doc, callback){
                doc.resources = doc.resources[0];
                callback();
            }, function(err){
                if(err){
                    console.error('ERROR AFTER GETTING WORK PORST AT BLOG ', err);
                    var error = new Error('work post each 하는데 실패...');
                    error.code = 400;
                    return next(error);
                }
                req.session[tmpKey] = docs.slice(-1)[0]._id;
                var msg = {
                    code : 200,
                    msg : 'Success',
                    result : docs
                };
                res.status(msg.code).json(msg);
            });
        }else{
            var error = new Error('더 이상 없음.');
            error.code = 404;
            return next(error);
        }
    });
};

/**
 * 해당 블로거가 좋아요 한 예술콘텐츠 목록 가져오기
 * @param req
 * @param res
 * @param next
 */
module.exports.getLikePostsOfBlogger = function(req, res, next){
    var blogId = req.params.blogId;
    var isStart = req.query.isStart;
    if(!blogId){
        var error =new Error('URL 확인 부탁해요.');
        error.code = 400;
        return next(error);
    }
    var lastSeenOfLikes = null;
    var tmpKey = 'ml'+blogId;
    if(!isStart){
        lastSeenOfLikes = req.session[tmpKey];
    }
    Post.findLikePostsAtBlog(blogId, lastSeenOfLikes, function(err, docs){
        if(err){
            console.error('ERROR GETTING LIKE POSTS AT BLOG ', err);
            var error = new Error('like posts를 가져올 수 없습니다.');
            error.code = 400;
            return next(error);
        }
        if(docs.length != 0){
            req.session[tmpKey] = docs.slice(-1)[0]._id;
            async.each(docs, function(doc, callback){
                doc.resources = doc.resources[0];
                callback();
            }, function(err){
                var msg = {
                    code : 200,
                    msg : 'Success',
                    result : docs
                };
                res.status(msg.code).json(msg);
            });
        }else{
            var error =new Error('더 이상 없음');
            error.code = 404;
            return next(error);
        }
    });
};