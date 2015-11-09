/**
 * Created by heroKoo on 2015-11-08.
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

var userKey = '563ef1ca401ae00c19a15829'; // session에 있을 정보
var blogKey = '563ef1ca401ae00c19a15832'; // session에 있을 정보

var Comment = require('./../models/Comments');
var Post = require('./../models/Posts');

//add_form
module.exports.getShowAddForm = function(req,res){
    fs.createReadStream(__dirname + './../views/showAddForm.html').pipe(res);
}

//List
module.exports.getShowList = function(req,res){
    var showList = new Post({postType : 1});
    showList.findByPostType(function(err,shows){
       if(err){
           console.error(err);
           var error = new Error('Show List 를 가져올 수 없다');
           error.code = 400;
           return next(error);
       }
        res.render('shows',{shows : shows});
    });
}
//detail
module.exports.getShowPost = function(req,res){
    //상세표시 추가예정
}


//will remove
module.exports.getShowPosts = function(req,res){
    var showPost = new Post({postType : 1});
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
                            uploadInfo.content,uploadInfo.latitude,uploadInfo.longitude, uploadInfo.address, imageUrls);
                    }
                });

            },
            function (showType, title, startDate, endDate, startTime,endTime, fee,
                      blogId, content, latitude,longitude, address, urls, callback) {




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
                                coordinates : [latitude, longitude]
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
                        console.error('save workPosts async error ', err);
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
                res.redirect('/');
            }
        });
};