/**
 * Created by Moon Jung Hyun on 2015-11-06.
 */
var userKey = '563ef1ca401ae00c19a15829'; // session에 있을 정보
var blogKey = '563ef1ca401ae00c19a15832'; // session에 있을 정보

var Blog = require('./../models/Blogs');  // web 에서 정보 입력시 편하게 하게 하려고 추가 나중에 지움요.

var Comment = require('./../models/Comments');
var Post = require('./../models/Posts');
var Report = require('./../models/Reports');

// 이거.. session하면 메소드 안에 들어가야 겠...지???
// c_+postId를 키값으로 lastseen값 저장....
//var lastSeenOfComments = null; // session에서 가져옴... 인데??? 음??? postId별로 되나???

/**
 * 모든 type의 Post 가져오기
 * @param req
 * @param res
 * @param next
 */
module.exports.getPosts = function (req, res, next) {
    // PostSchema.findPosts();
};

/**
 * Post 삭제하기
 * @param req
 * @param res
 * @param next
 */
module.exports.deletePost = function (req, res, next) {
    var postId = req.params.postId;
    if (!postId) {
        var error = new Error('URL 확인 부탁해요.');
        error.code = 400;
        return next(error);
    }
    Post.removePost(postId, function (err, doc) {
        if (err) {
            console.error('ERROR REMOVE POST ', err);
            var error = new Error('Post를 삭제할 수 없습니다.');
            error.code = 400;
            return next(error);
        }
        //console.log(doc);
        Comment.removeComments(doc._id, function (err, docs) {
            if (err) {
                console.error('ERROR REMOVE COMMENTS ', err);
                var error = new Error('Comments를 삭제할 수 없습니다. ');
                error.code = 400;
                return next(error);
            }
            //console.log(docs);
            var msg = {
                code: 200,
                msg: 'Success'
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
module.exports.changeLike = function (req, res, next) {
    var id = req.params.postId;
    var status = req.params.likeStatus;
    console.log('postId', id);
    console.log('likeStatus', status);
    if (status == 'like') { // 좋아요
        Post.pushLike(id, blogKey, function (err, doc) {
            if (err) {
                console.error('ERROR PUSH LIKE', err);
                var error = new Error('좋아요에 실패했습니다.');
                error.code = 400;
                return next(error);
            }
            console.log('push like ', doc);
            var msg = {
                code: 200,
                msg: 'Success'
            };
            res.status(msg.code).json(msg);
        });
    } else if (status == 'unlike') { // 좋아요 취소
        Post.pullLike(id, blogKey, function (err, doc) {
            if (err) {
                console.error('ERROR PULL LIKE ', err);
                var error = new Error('좋아요를 취소할 수가 없습니다.');
                error.code = 400;
                return next(error);
            }
            console.log('pull like ', doc);
            var msg = {
                code: 200,
                msg: 'Success',
            };
            res.status(msg.code).json(msg);
        });
    } else {
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
module.exports.reportPost = function (req, res, next) {
    var postId = req.params.postId;
    if (!postId) {
        var error = new Error('URL 확인 부탁해요.');
        error.code = 400;
        return next(error);
    }
    Report.isReported(postId, blogKey, function (err, isReported) {
        if (err) {
            console.error('ERROR CHECK REPORTER ', err);
            var error = new Error('신고 여부를 확인할 수 없습니다.');
            error.code = 400;
            return next(error);
        }
        if (!isReported) {
            Report.saveReport(postId, blogKey, function (err, doc) {
                if (err) {
                    console.error('ERROR SAVE REPORT ', err);
                    var error = new Error('신고 실패했습니다.');
                    error.code = 400;
                    return next(error);
                }
                console.log('RESULT SAVE REPORT ', doc);
                var msg = {
                    code: 200,
                    msg: 'Success'
                };
                res.status(msg.code).json(msg);
            });
        } else {
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
module.exports.addComment = function (req, res, next) {
    console.log('addComment');
    var postId = req.params.postId;
    Comment.saveComment(postId, req.body.writer, req.body.content, function (err, doc) {
        if (err) {
            console.error('ERROR AT ADD REPLY - ', err);
            var error = new Error('댓글을 입력할 수 없습니다.');
            error.code = 400;
            return next(error);
        }
        // web....
        res.redirect('/posts/' + postId + '/comments');

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
module.exports.getComments = function (req, res, next) {
    var id = req.params.postId;
    var isStart = req.query.isStart;
    if (!id) {
        var error = new Error('URL 확인 부탁해요.');
        error.code = 400;
        return next(error);
    }
    var lastSeenOfComments = null;
    if (!isStart) {
        lastSeenOfComments = req.session[id];
    }

    Comment.findCommentsOfPost(id, lastSeenOfComments, function (err, docs) {
        if (err) {
            var error = new Error('댓글을 불러올 수 없습니다.');
            error.code = 400;
            return next(error);
        }
        // web에서 입력할때 글쓴이를 편하게 하기 위해....;;;
        /* Blog.findBlogs(function(err, blogs){
         res.render('add_reply', {postId : id, replies : docs, users : blogs});
         });*/

        // app...
        //lastSeenOfComments = docs.slice(-1)[0].createAt;
        if (docs.slice(-1).length != 0) {
            req.session[id] = docs.slice(-1)[0]._id;
            var msg = {
                code: 200,
                msg: 'Success',
                result: docs.reverse()
            };
            res.status(msg.code).json(msg);
        } else {
            var error = new Error('댓글이 없습니다.');
            error.code = 404;
            return next(error);
        }
    });
};
