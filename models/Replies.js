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
    //Reply.findOne({_post : postId}).
        //where('replies', {$elemMatch : {is_valid : true}}).
        //elemMatch('replies', { is_valid : true }).
        //where('replies').elemMatch(function(elem){
        //    elem.where('is_valid', true)
        //}).
    Reply.findOne({'_post': postId}).
        select({'replies' : {$elemMatch : {'_id' : 9}}}).
        exec(callback);

   // Reply.findOne({_post : postId, 'replies.$.is_valid' : true}).exec();



    //Reply.find({"replies.is_valid" : true}).exec(callback);
    //Reply.findOne({_post : postId}).
    //    where('replies').elemMatch(function(elem){
    //        elem.where('_id').equals(1);
    //    }).
    //    exec(callback);
};

module.exports.deleteReply = function(postId, replyId, callback) {
    // 작성자 비교는 어디서 할 지 몰라서 보류임

    Reply.update({'_post': postId }, {
        $pull: {
            'replies._id': replyId
        }
    }, callback)
}


module.exports.updateReply = function(postId, replyId, content, callback) {
    // 작성자 비교는 어디서 할 지 몰라서 보류임

    Reply.update({'_post': postId, 'replies._id': replyId}, {
        $set: {
            'replies.$.content': content
        }
    }, callback)
}

