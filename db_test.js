/**
 * Created by heuneul on 2015-11-04.
 */
var mongoose = require('./config/mongoose_conn');
var Reply = require('./models/Replies');

var postId = 1;
var replyInfo = {
    _writer : 2,
    content : '그럽니다.......'
};
//Reply.findReplies(postId, function(err, doc){
//    console.log(doc);
//    console.log(doc[0]._writer.nick);
//    //console.log(doc.replies.length);
//});

//Reply.countReplies(postId, function(err, result){
//    console.log(result);
//});
Reply.findLast2Replies(postId, function(err, docs){
    console.log(docs);
});
//Reply.deleteReply(postId, 3, function(err, doc){
//    console.log(doc);
//})

//for(var i =2; i<11; i++){
//    Reply.saveReply({
//        _post : postId,
//        _writer : i,
//        content : '오늘은 삽질의 날이다.....  '+i
//    }, function(err, doc){
//        console.log("?????",doc);
//    });
//}


