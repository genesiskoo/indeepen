var ObjectId = require('mongoose').Types.ObjectId;

var Reply = require('./schemas/Replies.js');
var Blog = require('./schemas/Blogs');

/*
 포스트를 저장하면 댓글 초기화 해야 함
 */
module.exports.initReply = function(postId, callback){
    Reply.create({_post : postId}, callback);
};

/*
 댓글 저장.
 */
module.exports.saveReply = function(replyInfo, callback){
    Reply.findOneAndUpdate({_post : postId}, {$push : {replies : replyInfo}}, callback);
};

/*
    댓글 count
 */
module.exports.countReplies = function(postId, callback){
    Reply.findOne({_post : postId}, function(err, doc){
        var cnt = doc.replies.length;
        console.log('cnt', cnt);
        callback(err, cnt);
    });
};
/*
    댓글 최신 2개만 가져오기
 */
module.exports.findLast2Replies = function(postId, callback){
    Reply.aggregate([{
        $match : {_post : postId}
    },  {
        $unwind : "$replies"
    },{
        $sort : {
            'replies.rg_date' : -1
        }
    }])
        .limit(2)
        .exec(function(err, docs){
            Blog.populate(docs, {path : "replies._writer", select : '_id  nick'}, callback);
        });
};

/*
    20개씩 끊어서....
    paginationInfo = {
        total : 10,
        nowPage : 0,
 */
module.exports.findReplies = function(postId, callback) {
    var unit = 20;
    Reply.aggregate([{
        $match : {_post : postId}
    },  {
        $unwind : "$replies"
    },{
        $sort : {
            'replies.rg_date' : -1
        }
    }])
        .skip(0)
        .limit(20)
        .exec(function(err, docs){
            Blog.populate(docs, {path : "replies._writer", select : '_id _user nick profilePhoto'}, callback);
        });
};

module.exports.deleteReply = function(replyId, callback) {
    // 작성자 비교는 어디서 할 지 몰라서 보류임

    Reply.update({'_post': postId }, {
        $pull: {
            replies : {_id : new ObjectId(replyId)}
        }
    }, callback)
};


module.exports.updateReply = function(postId, replyId, content, callback) {
    // 작성자 비교는 어디서 할 지 몰라서 보류임

    Reply.update({'_post': postId, 'replies._id': new ObjectId(replyId)}, {
        $set: {
            'replies.$.content': content
        }
    }, callback)
};
