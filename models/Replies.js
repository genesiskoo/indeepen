var Counter = require('./Counters');
var Reply = require('./schemas/Replies.js');


/*
 포스트를 저장하면 댓글 초기화 해야 함
 */
module.exports.initReply = function(postId, callback){
    Reply.create({_post : postId}, callback);
}

/*
 댓글 저장.
 */
module.exports.saveReply = function(postId, replyInfo, callback){
    Counter.getNextSeq('replyInfo', function(err, doc){
        replyInfo._id = doc.seq;
        Reply.findOneAndUpdate({_post : postId}, {$push : {replies : replyInfo}}, callback);
    });
};

module.exports.findReplies = function(postId, callback) {
    Reply.find({_post : postId}).
        elemMatch('replies', {is_valid : true}).
        exec(callback);

};
