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

//Reply.initReply(postId, function(err, doc){
//    console.log(doc);
//});
//for(var i =1; i<11; i++){
//    Reply.saveReply(postId,  {
//        _writer : i,
//        content : '아하......... '+i
//    }, function(err, doc){
//        console.log("?????",doc);
//    });
//}

//Reply.findReplies(postId, function(err, docs){
//    console.log(docs);
//    console.log('size', docs.replies.length);
//})



//Reply.deleteReply(2, 6, function(err, doc){
//    console.log(doc);
//})

