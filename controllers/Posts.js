/**
 * Created by Moon Jung Hyun on 2015-11-06.
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
var uploadUrl = __dirname + './../upload';

var userKey = '563cc592e1bdc2c8177dd104'; // session에 있을 정보
var blogKey = '563cc593e1bdc2c8177dd10c'; // session에 있을 정보



var Post = require('../models/Posts');
var Reply = require('../models/Replies');
var Blog = require('./../models/schemas/Blogs');  // web 에서 정보 입력시 편하게 하게 하려고 추가 나중에 지움요.

var Comment = require('./../models/schemas/Comments');
var PostSchema = require('./../models/schemas/Posts');
var Report = require('./../models/schemas/Reports');

/**
 * 모든 type의 Post 가져오기
 * @param req
 * @param res
 * @param next
 */
module.exports.getPosts = function(req, res, next){
   // PostSchema.findPosts();
};





module.exports.getShowAddForm = function(req,res,next){
    fs.createReadStream(__dirname + './../views/showAddForm.html').pipe(res);
}

module.exports.getShowPosts = function(req,res,next){
    var showPost = new PostSchema({postType : 1});
    showPost.findByPostType(function(err, showPosts){
        console.log(showPosts);
        res.render('shows', {shows : showPosts});
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
                        callback(null,uploadInfo.showType, uploadInfo.title, uploadInfo.startDate, uploadInfo.endDate,
                            uploadInfo.startTime, uploadInfo.endTime, uploadInfo.fee, uploadInfo.blogId,
                            uploadInfo.content, uploadInfo.address, imageUrls);
                    }
                });

            },
            function (showType, title, startDate, endDate, startTime,endTime,fee, blogId, content, address, urls, callback) {




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
                        fee : fee,
                        location : {
                            point : {
                            },
                            address : address
                        }//loc
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
                        console.error(err);
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


/**
 * Post 삭제하기
 * @param req
 * @param res
 * @param next
 */
module.exports.deletePost = function(req, res, next){
    var postId = req.params.postId;
    if(!postId){
        var error = new Error('URL 확인 부탁해요.');
        error.code = 400;
        return next(error);
    }
    PostSchema.removePost(postId, function(err, doc){
        if(err){
            console.error('ERROR REMOVE POST ', err);
            var error = new Error('Post를 삭제할 수 없습니다.');
            error.code = 400;
            return next(error);
        }
        //console.log(doc);
        Comment.removeComments(doc._id, function(err, docs){
            if(err){
                console.error('ERROR REMOVE COMMENTS ', err);
                var error = new Error('Comments를 삭제할 수 없습니다. ');
                error.code = 400;
                return next(error);
            }
            //console.log(docs);
            var msg = {
                code : 200,
                msg : 'Success'
            };
            res.status(msg.code).json(msg);
        });
    });
};

/**
 * 해당 Post에 대한 User(Blog)의 좋아요 추가/취소하기
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
module.exports.changeLike = function(req, res, next){
    var id = req.params.postId;
    var status = req.params.likeStatus;
    console.log('postId', id);
    console.log('likeStatus', status);
    if(status == 'like'){ // 좋아요
        PostSchema.pushLike(id, blogKey, function(err, doc){
            if(err){
                console.error('ERROR PUSH LIKE', err);
                var error = new Error('좋아요에 실패했습니다.');
                error.code = 400;
                return next(error);
            }
            console.log('push like ', doc);
            var msg = {
                code : 200,
                msg : 'Success'
            };
            res.status(msg.code).json(msg);
        });
    }else if(status == 'unlike'){ // 좋아요 취소
        PostSchema.pullLike(id, blogKey, function(err, doc){
            if(err){
                console.error('ERROR PULL LIKE ', err);
                var error = new Error('좋아요를 취소할 수가 없습니다.');
                error.code = 400;
                return next(error);
            }
            console.log('pull like ', doc);
            var msg = {
                code : 200,
                msg : 'Success',
            };
            res.status(msg.code).json(msg);
        });
    }else{
        var error = new Error('Only like Or unlike');
        error.code = 400;
        return next(error);
    }

};

/**
 * 해당 Post에 대해 한 User(Blog)가 신고하기
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
module.exports.reportPost = function(req, res, next){
    var postId = req.params.postId;
    if(!postId){
        var error = new Error('URL 확인 부탁해요.');
        error.code = 400;
        return next(error);
    }
    Report.isReported(postId, blogKey, function(err, isReported){
        if(err){
            console.error('ERROR CHECK REPORTER ', err);
            var error = new Error('신고 여부를 확인할 수 없습니다.');
            error.code =400;
            return next(error);
        }
        if(!isReported){
            Report.saveReport(postId, blogKey, function(err, doc){
                if(err){
                    console.error('ERROR SAVE REPORT ', err);
                    var error = new Error('신고 실패했습니다.');
                    error.code = 400;
                    return next(error);
                }
                console.log('RESULT SAVE REPORT ', doc);
                var msg = {
                    code : 200,
                    msg : 'Success'
                };
                res.status(msg.code).json(msg);
            });
        }else{
            console.log('이미 신고함...');
            var error = new Error('이미 신고한 Post입니다.');
            error.code = 400;
            return next(error);
        }
    });
};


////////////////////////////////////////////////////////////////////////////////
// 댓글 관련.....
/**
 * 댓글 저장하기
 * @param req
 * @param res
 * @param next
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
            msg : 'Success'
        };
        res.status(msg.code).json(msg);
        */
    });
};
/**
 * 댓글 리스트 가져오기
 * @param req
 * @param res
 * @param next
 */
module.exports.getComments = function(req, res, next){
    var id = req.params.postId;
    Comment.findCommentsOfPost(id, function(err, docs){
        if(err){
            var error = new Error('댓글을 불러올 수 없습니다.');
            error.code = 400;
            return next(error);
        }
        // web에서 입력할때 글쓴이를 편하게 하기 위해....;;;
        Blog.findBlogs(function(err, blogs){
            res.render('add_reply', {postId : id, replies : docs, users : blogs});
        });

        // app...
/*
        var msg = {
            code : 200,
            msg : 'Success',
            result : {
                // pagination....
                comments : docs.reverse()
            }
        };
        res.status(msg.code).json(msg);
*/
    });
};
