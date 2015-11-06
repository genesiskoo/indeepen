/**
 * Created by Moon Jung Hyun on 2015-11-06.
 */
var formidable = require('formidable'),
    pathUtil = require('path');
var fs = require('fs');

var async = require('async');
var userId = 1;
var AWS = require('aws-sdk');
var randomstring = require('randomstring');

var awsS3 = require('./../config/s3');

AWS.config.region = awsS3.region;
AWS.config.accessKeyId = awsS3.accessKeyId;
AWS.config.secretAccessKey = awsS3.secretAccessKey;

// Listup All Files
var s3 = new AWS.S3();
var bucketName = awsS3.bucketName;

var userKey = 1; // session에 있을 정보
var blogKey = 1; // session에 있을 정보
var uploadUrl = __dirname + './../upload';
//////////////////////// web 용
module.exports.showAddWorkPostPage = function(req, res){
    fs.createReadStream(__dirname + './../views/workPost.html').pipe(res);
};
var Post = require('../models/Posts');
var Reply = require('../models/Replies');
var Blog = require('./../models/schemas/Blogs');

var Comment = require('./../models/schemas/Comments');
var PostSchema = require('./../models/schemas/Posts');
/*
    예술 콘텐츠 저장
 */
module.exports.addWorkPost = function(req, res, next){
    async.waterfall(
        [
            function (callback) {
            var uploadInfo = {
                files: []
            };
            var form = new formidable.IncomingForm();
                // aws 에 저장되는 경로....
            form.uploadDir = uploadUrl;

            form
                .on('field', function (field, value) {
                    console.log('file 아님 ', field);
                    uploadInfo[field] = value;
                })
                .on('file', function (field, file) {
                    if (field == 'file') {
                        uploadInfo.files.push(file);
                    } else {
                        console.log('file 임 ', field);
                        uploadInfo[field] = file;
                    }
                })
                .on('end', function () {
                    console.log('-> upload done');
                    callback(null, uploadInfo);
                });
            form.parse(req);
        },
            function (uploadInfo, callback) {
                console.log('uploadInfo', uploadInfo);
                var files = uploadInfo.files;
                var imageUrls = [];
                var order = 0;
                var randomStr = randomstring.generate(10); // 10자리 랜덤
                async.each(uploadInfo.files, function(file, callback){
                    var newFileName = 'content_'+ randomStr+'_' + (order++) ;
                    var extname = pathUtil.extname(file.name);
                    var contentType = file.type;

                    var readStream = fs.createReadStream(file.path);
                    // s3에 저장될 파일 이름 지정
                    var itemKey = 'contents/images/' + newFileName + extname;

                    var params = {
                        Bucket: bucketName,     // 필수
                        Key: itemKey,				// 필수
                        ACL: 'public-read',
                        Body: readStream,
                        ContentType: contentType
                    };
                    s3.putObject(params, function (err, data) {
                        if (err) {
                            console.error('S3 PubObject Error', err);
                            callback(err);
                        } else {
                            var imageUrl = s3.endpoint.href + bucketName + '/' + itemKey;
                            console.log('imageUrl ', imageUrl);
                            // aws의 upload에 생긴 파일 명시적으로 지워줘야 함
                            console.log('filePath',file.path);
                            fs.unlink(file.path, function(err){
                               if(err){
                                   var error = new Error('파일 삭제를 실패했습니다.');
                                   error.code = 400;
                                   return next(error);
                               }else{
                                   imageUrls.push({contentType : contentType, url :imageUrl});
                                   callback();
                               }
                            });
                        }
                    });

                }, function(err){
                    if(err){
                        callback(err);
                    }else{
                        callback(null, uploadInfo.workType, uploadInfo.emotion, uploadInfo.blogId, uploadInfo.content, imageUrls);
                    }
                });

            },
            function (workType, emotion, blogId, content, urls, callback) {
                // hash_tag 추출
                var tmpStr = content.split('#');
                var hashTag = [];
                for(var i=1; i<tmpStr.length; i++){
                    var tmp = tmpStr[i].split(' ')[0];
                    if(tmp != '')
                        hashTag.push(tmp);
                }

                // db 저장
                var postInfo = {
                    postType : 0,
                    _writer : blogId,
                    content : content,
                    hashTags : hashTag,
                    likes : [],
                    work : {
                        type : workType,
                        emotion : emotion
                    },
                    resources : []
                };
                async.each(urls, function(url, callback){
                    console.log('url', url);
                    // s3 경로 저장
                    postInfo.resources.push({type : url.contentType, originalPath : url.url});
                    callback();
                }, function(err){
                    if(err){
                        var error = new Error('file url 관리에서 실패.....');
                        error.code = 400;
                        return next(error);
                    }else{
                        console.log("postInfo", postInfo);
                        PostSchema.savePost(postInfo, function(err, doc){
                            if(err){
                                console.error('Error', err);
                                var error = new Error('포스팅 실패');
                                error.code = 400;
                                next(error);
                            }else{
                                console.log('Done');
                                // replies 초기화....
                                //Reply.initReply(doc._id, function(err, doc){
                                //    if(err){
                                //        console.error('INIT REPLIES COLLECTION ERROR ', err);
                                //        var error = new Error('댓글 초기화를 실패했습니다.');
                                //        error.code = 500;
                                //        return next(error);
                                //    }else{
                                //        callback();
                                //    }
                                //});
                                callback();
                            }
                        });
                    }
                });
            }
        ],
        function (err) {
            if (err) {
                res.sendStatus(500);
            }
            else {
                res.redirect('/posts/work');
            }
        });
};

/*
    예술 콘텐츠 리스트 가져오기
 */

module.exports.getWorkPosts = function(req, res, next){
    var workPost = new PostSchema({postType : 0});
    workPost.findByPostType(function(err, workPosts){
        if(err) {
            console.error(err);
            var error = new Error('Work Post를 가져올 수 없습니다.');
            error.code = 400;
            return next(error);
        }
        console.log(workPosts);
        async.each(workPosts, function(workPost, callback){
            Comment.countCommentsOfPost(workPost._id, function(err, count){
                if(err){
                    console.error('ERROR COUNT COMMENTS ', err);
                    var error = new Error('댓글 개수를 셀 수 없습니다.');
                    error.code = 400;
                    return next(error);
                }
                console.log('count ', count);
                workPost['commentCnt'] = count;
                Comment.findLast2Comments(workPost._id, function(err, docs){
                    if(err){
                        console.error('ERROR FIND LAST 2 COMMENTS ', err);
                        var error = new Error('최신 댓글 2개를 가져오는데 실패했습니다.');
                        error.code = 400;
                        return next(error);
                    }
                    console.log('comment docs ', docs);
                    workPost['comments'] = docs.reverse(); // 댓글 순서 때문에 reverse...
                    console.log('final workPost ', workPost);
                    callback();
                });
            });
        }, function(err){
            if(err){
                console.error('ERROR AFTER async each ', err);
                var error = new error('댓글 정보를 가져오는데 실패했습니다.');
                error.code = 400;
                return next(error);
            }
            res.render('post', {works : workPosts});
        });

    });
};

//module.exports.getWorkPostDetailInfo = function(req, res, next){
//
//}

module.exports.getShowAddForm = function(req,res,next){
    fs.createReadStream(__dirname + './../views/showAddForm.html').pipe(res);
}

module.exports.getShowPosts = function(req,res,next){
    Post.findShowPosts(function(err,docs){
        if(err){
            res.sendStatus(400);
        }
        res.render('shows',{ shows : docs });
    });

};

//문화컨텐츠 추가 POST
module.exports.addShowPost = function(req, res, next){
    async.waterfall(
        [
            function (callback) {
                var uploadInfo = {
                    files: []
                };
                var form = new formidable.IncomingForm();
                // aws 에 저장되는 경로....
                form.uploadDir = uploadUrl;

                form
                    .on('field', function (field, value) {
                        console.log('file 아님 ', field);
                        uploadInfo[field] = value;
                    })
                    .on('file', function (field, file) {
                        if (field == 'file') {
                            uploadInfo.files.push(file);
                        } else {
                            console.log('file 임 ', field);
                            uploadInfo[field] = file;
                        }
                    })
                    .on('end', function () {
                        console.log('-> upload done');
                        callback(null, uploadInfo);
                    });
                form.parse(req);
            },
            function (uploadInfo, callback) {
                console.log('uploadInfo', uploadInfo);
                var files = uploadInfo.files;
                var imageUrls = [];
                var order = 0;
                var randomStr = randomstring.generate(10); // 10자리 랜덤
                async.each(uploadInfo.files, function(file, callback){
                    var newFileName = 'content_'+ randomStr+'_' + (order++) ;
                    var extname = pathUtil.extname(file.name);
                    var contentType = file.type;

                    var readStream = fs.createReadStream(file.path);
                    // s3에 저장될 파일 이름 지정
                    var itemKey = 'contents/images/' + newFileName + extname;

                    var params = {
                        Bucket: bucketName,     // 필수
                        Key: itemKey,				// 필수
                        ACL: 'public-read',
                        Body: readStream,
                        ContentType: contentType
                    };
                    s3.putObject(params, function (err, data) {
                        if (err) {
                            console.error('S3 PubObject Error', err);
                            callback(err);
                        } else {
                            var imageUrl = s3.endpoint.href + bucketName + '/' + itemKey;
                            console.log('imageUrl ', imageUrl);
                            // aws의 upload에 생긴 파일 명시적으로 지워줘야 함
                            console.log('filePath',file.path);
                            fs.unlink(file.path, function(err){
                                if(err){
                                    var error = new Error('파일 삭제를 실패했습니다.');
                                    error.code = 400;
                                    return next(error);
                                }else{
                                    imageUrls.push({contentType : contentType, url :imageUrl});
                                    callback();
                                }
                            });
                        }
                    });

                }, function(err){
                    if(err){
                        callback(err);
                    }else{
                        callback(null,uploadInfo.title, uploadInfo.showType, uploadInfo.startDate, uploadInfo.endDate, uploadInfo.startTime, uploadInfo.endTime, uploadInfo.fee, uploadInfo.blogId, uploadInfo.content, imageUrls);
                    }
                });

            },
            function (showType, title, startDate, endDate, startTime,endTime,fee,  blogId, content, urls, callback) {




                // hash_tag 추출
                var tmpStr = content.split('#');
                var hashTag = [];
                for(var i=1; i<tmpStr.length; i++){
                    var tmp = tmpStr[i].split(' ')[0];
                    if(tmp != '')
                        hashTag.push(tmp);
                }

                // db 저장
                var postInfo = {
                    postType : 1,
                    _writer : blogId,
                    content : content,
                    hashTags : hashTag,
                    likes : [],
                    show : {
                        title : title,
                        type : showType,
                        tags : [],
                        startDate : startDate,
                        endDate : endDate,
                        startTime : startTime,
                        endTime : endTime,
                        fee : fee
                    },
                    resources : []
                };
                async.each(urls, function(url, callback){
                    console.log('url', url);
                    // s3 경로 저장
                    postInfo.resources.push({type : url.contentType, originalPath : url.url});
                    callback();
                }, function(err){
                    if(err){
                        var error = new Error('file url 관리에서 실패.....');
                        error.code = 400;
                        return next(error);
                    }else{
                        console.log("postInfo", postInfo);
                        Post.savePost(postInfo, function(err, doc){
                            if(err){
                                console.error('Error', err);
                                var error = new Error('포스팅 실패');
                                error.code = 400;
                                next(error);
                            }else{
                                console.log('Done');
                                callback();
                            }
                        });
                    }
                });
            }
        ],
        function (err) {
            if (err) {
                res.sendStatus(500);
            }
            else {
                res.redirect('/posts/shows');
            }
        });
};

////////////////////////////////////////////////////////////////////////////////
// 댓글 관련.....
/*
 댓글 저장하기
 */
module.exports.addComment = function(req, res, next){
    console.log('addComment');
    var postId = req.params.postId;
    Comment.saveComment(postId, req.body.writer, req.body.content, function(err, doc){
        if(err){
            console.error('ERROR AT ADD REPLY - ', err);
            var error = new Error('댓글을 입력할 수 없습니다.');
            error.code = 400;
            return next(error);
        }
        // web....
        res.redirect('/posts/'+postId+'/comments');

        // app ...
        /*
        var msg = {
            code : 200,
            msg : '댓글을 작성했습니다.'
        };
        res.status(msg.code).json(msg);
        */
    });
};
/*
 댓글 리스트 가져오기
 */
module.exports.getComments = function(req, res, next){
    var id = req.params.postId;
    Comment.findCommentsOfPost(id, function(err, docs){
        if(err){
            var error = new Error('댓글을 불러올 수 없습니다.');
            error.code = 400;
            return next(error);
        }
        console.log('replies docs ', docs);

        // web에서 입력할때 글쓴이를 편하게 하기 위해....;;;
        Blog.findBlogs(function(err, blogs){
            res.render('add_reply', {postId : id, replies : docs, users : blogs});
        });

        // app...
/*
        var msg = {
            code : 200,
            msg : '댓글을 가져왔습니다.',
            result : {
                // pagination....
                comments : docs.reverse()
            }
        };
        res.status(msg.code).json(msg);
*/
    });
};
