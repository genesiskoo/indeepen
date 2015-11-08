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
            msg : 'Success'
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
