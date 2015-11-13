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
module.exports.getShowAddForm = function (req, res) {
    fs.createReadStream(__dirname + '/../views/showAddForm.html').pipe(res);
};

//List
module.exports.getShowList = function (req, res) {
    var isStart = req.query.isStart;
    var lastSeen = null;

    if(!isStart){
        lastSeen = req.session[id];
    }

    var showList = [];
    var showModel = new Post({postType: 1});
    showModel.findByPostType(function (err, shows) {
        if (err) {
            console.error(err);
            var error = new Error('Show List 를 가져올 수 없다');
            error.code = 400;
            return next(error);
        }
        async.eachSeries(shows, function (showModel, callback) {
            var result = {
                postInfo: showModel
            };
            async.each(result, function (list, cb) {
                list['resources'] = list.resources[0];
                cb();
            });

            Comment.countCommentsOfPost(showModel._id, function (err, count) {
                if (err) {
                    console.error('CANT COUNT DATGUL', err);
                    var error = new Error('countComment Error');
                    error.code = 400;
                    return next(error);
                }
                result['commentCnt'] = count;
                //console.log('result, :', result);
                showList.push(result);
                callback();
            })//count
        }, function done() {

            var msg = {
                code: 200,
                msg: 'Success',
                result: showList
            };
            //res.render('shows',{shows : shows});
            res.status(msg.code).json(msg);
            console.log(msg);

        });//async
    });//findPostType
    //post결과와 comment수 결과를 담을 객체 생성
};

//detail
module.exports.getShowPost = function (req, res) {
    var id = req.params.postId;
    var showPost = {};
    Post.findPost(id, 1, function (err, doc) {
        if (err) {
            console.error('error message : ', err);
            var error = new Error('포스트없슴')
            error.code = 404;
            return next(error);
        }
        //console.log(doc);
        showPost['postInfo'] = doc;
        Comment.countCommentsOfPost(id, function (err, count) {
            showPost['commentCnt'] = count;
            var msg = {
                code: 200,
                msg: 'Success',
                result: showPost
            };
            res.status(msg.code).json(msg);
            //console.log(msg);
            //fs.writeFile('/showPost.json', JSON.stringify(msg, null, 4), function(err) {
            //    if(err) {
            //        console.log(err);
            //    } else {
            //        console.log("JSON saved ");
            //    }
            //});

        });
    });//findPost
};

//문화컨텐츠 추가 POST
module.exports.addShowPost = function (req, res, next) {
    async.waterfall(
        [
            function (callback) {
                var uploadInfo = {
                    files: [],
                    artist: []
                };
                var form = new formidable.IncomingForm();
                // aws 에 저장되는 경로....
                form.uploadDir = uploadUrl;

                form
                    .on('field', function (field, value) {
                        if (field == 'tag') {
                            uploadInfo.artist.push(JSON.parse(value));
                        } else {
                            console.log('file 아님 ', field);
                            uploadInfo[field] = value;
                        }
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
                async.each(uploadInfo.files, function (file, callback) {
                    var newFileName = 'content_' + randomStr + '_' + (order++);
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
                            console.log('filePath', file.path);
                            fs.unlink(file.path, function (err) {
                                if (err) {
                                    var error = new Error('파일 삭제를 실패했습니다.');
                                    error.code = 400;
                                    return next(error);
                                } else {
                                    imageUrls.push({contentType: contentType, url: imageUrl});
                                    callback();
                                }
                            });
                        }
                    });

                }, function (err) {
                    if (err) {
                        callback(err);
                    } else {
                        //console.log('before',imageUrls);
                        imageUrls.sort(function (a, b) {
                            if (a.url < b.url)
                                return -1;
                            else if (a.url > b.url)
                                return 1;
                            else
                                return 0;
                        });
                        //console.log('after',imageUrls);
                        callback(null, uploadInfo.showType, uploadInfo.title, uploadInfo.startDate, uploadInfo.endDate,
                            uploadInfo.startTime, uploadInfo.endTime, uploadInfo.fee, uploadInfo.blogId,
                            uploadInfo.content, uploadInfo.latitude, uploadInfo.longitude, uploadInfo.address,
                            uploadInfo.artist, imageUrls);
                    }
                });//asyncEach

            },
            function (showType, title, startDate, endDate, startTime, endTime, fee,
                      blogId, content, latitude, longitude, address, artist, urls, callback) {

                // hash_tag 추출
                var tmpStr = content.split('#');
                var hashTag = [];
                for (var i = 1; i < tmpStr.length; i++) {
                    var tmp = tmpStr[i].split(' ')[0];
                    if (tmp != '')
                        hashTag.push(tmp);
                }

                // db 저장
                var postInfo = {
                    postType: 1,
                    _writer: blogId,
                    content: content,
                    hashTags: hashTag,
                    likes: [],
                    show: {
                        title: title,
                        type: showType,
                        tags: artist,
                        startDate: startDate,
                        endDate: endDate,
                        startTime: startTime,
                        endTime: endTime,
                        fee: fee,
                        location: {
                            point: {
                                coordinates: [latitude, longitude]
                            },
                            address: address
                        }//loc
                    },
                    resources: []
                };
                async.each(urls, function (url, callback) {
                    console.log('url', url);
                    // s3 경로 저장
                    postInfo.resources.push({type: url.contentType, originalPath: url.url});
                    callback();
                }, function (err) {
                    if (err) {
                        console.error('save workPosts async error ', err);
                        var error = new Error('file url 관리에서 실패.....');
                        console.error(err);
                        error.code = 400;
                        return next(error);
                    } else {
                        console.log("postInfo", postInfo);
                        Post.savePost(postInfo, function (err, doc) {
                            if (err) {
                                console.error('Error', err);
                                var error = new Error('포스팅 실패');
                                error.code = 400;
                                next(error);
                            } else {
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
                var msg = {
                    code: 200,
                    msg: 'Success'
                };
                res.status(msg.code).json(msg);
                //res.redirect('/');
            }
        });
};

//ex
/**
 * Load
 */

exports.load = function (req, res, next, id) {
    var User = mongoose.model('User');

    Article.load(id, function (err, article) {
        if (err) return next(err);
        if (!article) return next(new Error('not found'));
        req.article = article;
        next();
    });
};

/**
 * List
 */

exports.index = function (req, res) {
    var page = (req.query.page > 0 ? req.query.page : 1) - 1;
    console.log(page);
    var perPage = 1;
    var options = {
        perPage: perPage,
        page: page
    };
    Post.list(options, function (err, articles) {
        if (err) return res.render('500');
        Post.count().exec(function (err, count) {
            res.json(articles);
            //res.render('articles/index', {
            //    title: 'Articles',
            //    articles: articles,
            //    page: page + 1,
            //    pages: Math.ceil(count / perPage)
            //});
        });
    });
};