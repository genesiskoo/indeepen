/**
 * Created by Moon Jung Hyun on 2015-11-07.
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

var userKey = '563ef1ca401ae00c19a15829'; // session에 있을 정보
var blogKey = '563ef1ca401ae00c19a15832'; // session에 있을 정보

//////////////////////// web 용
module.exports.showAddWorkPostPage = function(req, res){
    fs.createReadStream(__dirname + '/../views/workPost.html').pipe(res);
};

var Comment = require('./../models/Comments');
var Post = require('./../models/Posts');

/**
 * 예술 Post 저장하기
 * @param req
 * @param res
 * @param next
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
                        var error = new Error('파일에서 실패...');
                        error.code = 400;
                        return next(error);
                    }
                    console.log('before ', imageUrls);
                    imageUrls.sort(function(a, b){
                        if(a.url < b.url)
                            return -1;
                        else if(a.url > b.url)
                            return 1;
                        else
                            return 0;
                    });
                    console.log('after ', imageUrls);
                    callback(null, uploadInfo.workType, uploadInfo.emotion, uploadInfo.blogId, uploadInfo.content, imageUrls);
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
                    //console.log('url', url);
                    // s3 경로 저장
                    postInfo.resources.push({type : url.contentType, originalPath : url.url});
                    callback();
                }, function(err){
                    if(err){
                        console.error('save workPosts async error ', err);
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
                // app..

                var msg = {
                    code : 200,
                    msg : 'Success'
                };
                res.status(msg.code).json(msg);

                //res.redirect('/workPosts/page');
            }
        });
};

/**
 * 예술 Post List 가져오기
 * @param req
 * @param res
 * @param next
 */
module.exports.getWorkPosts = function(req, res, next){
    var works = [];
    var workPost = new Post({postType : 0});
    workPost.findByPostType(function(err, workPosts){
        if(err) {
            console.error('ERROR GETTING WORK POSTS', err);
            var error = new Error('Work Post를 가져올 수 없습니다.');
            error.code = 400;
            return next(error);
        }
        async.eachSeries(workPosts, function(workPost, callback){
            var tmp = {
                postInfo : workPost
            };

            Comment.countCommentsOfPost(workPost._id, function(err, count){
                if(err){
                    console.error('ERROR COUNT COMMENTS ', err);
                    var error = new Error('댓글 개수를 셀 수 없습니다.');
                    error.code = 400;
                    return next(error);
                }
                tmp['commentCnt'] = count;
                Comment.findLast2Comments(workPost._id, function(err, docs){
                    if(err){
                        console.error('ERROR FIND LAST 2 COMMENTS ', err);
                        var error = new Error('최신 댓글 2개를 가져오는데 실패했습니다.');
                        error.code = 400;
                        return next(error);
                    }
                    tmp['comments'] = docs.reverse();
                    //console.log('final workPost ', tmp);
                    works.push(tmp);
                    callback();
                });
            });
        }, function done(){
             var msg = {
                 code : 200,
                 msg : 'Success',
                 result : works
             };
             res.status(msg.code).json(msg);

            //res.render('post', {works : works});
        });
    });
};

/**
 * 해당 예술 Post의 상세정보 가져오기
 * @param req
 * @param res
 * @param next
 */
module.exports.getWorkPost = function(req, res, next){
    var id = req.params.postId;
    var workPost = {};
    Post.findPost(id, 0, function(err, doc){
        if(err){
            console.error('ERROR GETTING POST ', err);
            var error = new Error('해당 post를 찾을 수 없습니다.');
            error.code = 404;
            return next(error);
        }
        console.log('doc ', doc);
        workPost['postInfo'] = doc;
        Comment.countCommentsOfPost(id, function(err, count){
            console.log('count ', count);
            workPost['commentCnt'] = count;
            console.log('workPost ', workPost);
            var msg = {
                code : 200,
                msg : 'Success',
                result : workPost
            };
            res.status(msg.code).json(msg);
        });
    });
};

