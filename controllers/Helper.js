/**
 * Created by Moon Jung Hyun on 2015-11-22.
 */

var async = require('async');
var Comment = require('./../models/Comments');


module.exports.findPostsVerPostList = function(req,res, type, sessionId, docs){
    console.log('seesionId ', sessionId);
    var order = 0;
    var posts = [];
    async.each(docs, function(doc, callback){
        var tmp ={
            seq : (order++),
            postInfo : doc
        };
        Comment.countCommentsOfPost(doc._id, function(err, count){
            if(err){
                console.error('ERROR COUNT COMMENTS ', err);
                var error = new Error('댓글 개수를 셀 수 없습니다.');
                error.code = 400;
                return next(error);
            }
            tmp['commentCnt'] = count;
            Comment.findLast2Comments(doc._id, function(err, docs){
                if(err){
                    console.error('ERROR FIND LAST 2 COMMENTS ', err);
                    var error = new Error('최신 댓글 2개를 가져오는데 실패했습니다.');
                    error.code = 400;
                    return next(error);
                }
                tmp['comments'] = docs.reverse();
                //console.log('final workPost ', tmp);
                posts.push(tmp);
                callback();
            });
        });
    }, function(err){
        if(err){
            var error = new Error('error at async each');
            error.code = 400;
            return next(error);
        }
        if(type == 2)
            req.session[sessionId] = docs.splice(-1)[0]._id;
        posts.sort(function(a, b){
            return a.seq - b.seq;
        });
        var msg = {
            code : 200,
            msg : 'Success',
            result : posts
        };
        res.status(msg.code).json(msg);
    });
};
/**
 * 사진 한개 리스트로 응답하기
 * @param req
 * @param res
 * @param sessionId
 * @param docs
 */
module.exports.findWorkPostsVerOnePictureList = function(req, res, sessionId, docs){
    console.log('seesionId ', sessionId);
    async.each(docs, function(doc, callback){
        doc.resources = doc.resources[0];
        callback();
    }, function(err){
        if(err){
            console.error('ERROR AFTER GETTING POSTS BY HASH TAG', err);
            var error = new Error('post by hash tag each 하는데 실패...');
            error.code = 400;
            return next(error);
        }
        req.session[sessionId] = docs.slice(-1)[0]._id;
        var msg = {
            code : 200,
            msg : 'Success',
            result : docs
        };
        res.status(msg.code).json(msg);
    });
};
