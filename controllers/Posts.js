/**
 * Created by heuneul on 2015-11-04.
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

var Post = require('../models/Posts');

var userKey = 1; // session에 있을 정보
var blogKey = 1; // session에 있을 정보
var uploadUrl = __dirname + './../upload';
//////////////////////// web 용
module.exports.showAddWorkPostPage = function(req, res){
    fs.createReadStream(__dirname + './../views/workPost.html').pipe(res);
}
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
                res.redirect('/post/work');
            }
        });
};
//
//module.exports.getWorkPosts = function(req, res, next){
//
//}
//
//module.exports.getWorkPostDetailInfo = function(req, res, next){
//
//}


