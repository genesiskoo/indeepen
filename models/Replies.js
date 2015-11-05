//var Counter = require('./Counters');
var Reply = require('./schemas/Replies.js');
var Blog = require('./schemas/Blogs');

/*
 댓글 저장.
 */
module.exports.saveReply = function(replyInfo, callback){
  Reply.create(replyInfo, callback);
};

/*
    댓글 count
 */
module.exports.countReplies = function(postId, callback){
    Reply.find({_post : postId}).count(callback);
};
/*
    댓글 최신 2개만 가져오기
 */
module.exports.findLast2Replies = function(postId, callback){
    Reply.find({_post : postId}).sort({rg_date : -1})
        .limit(2)
        .exec(callback);
}

/*
    20개씩 끊어서....
    paginationInfo = {
        total : 10,
        nowPage : 0,
 */
module.exports.findReplies = function(postId, callback) {
    var unit = 20;
    Reply.find({_post : postId}).populate('_writer', '_user nick profile_photo')
        .sort({rg_date : -1})
        .skip(0)
        .limit(20)
        .exec(callback);
};

module.exports.deleteReply = function(replyId, callback) {
    // 작성자 비교는 어디서 할 지 몰라서 보류임

    Reply.find({_id : replyId}).remove().exec(callback);
};


module.exports.updateReply = function(postId, replyId, content, callback) {
    // 작성자 비교는 어디서 할 지 몰라서 보류임

    Reply.update({'_post': postId, 'replies._id': replyId}, {
        $set: {
            'replies.$.content': content
        }
    }, callback)
};
