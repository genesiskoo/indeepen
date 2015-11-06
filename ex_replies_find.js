/**
 * Created by heuneul on 2015-11-02.
 */

var mongoose = require('./config/mongoose_conn.js');

var Reply = require('./models/Replies.js');

Reply.findReplies(3, function(err, docs){
    if(err){
        console.error('ERROR GETTING REPLIES : ', err);
        return;
    }
    if(docs.length == 0){
        console.log('NOT DOCS');
    }else{
        console.log(docs.length);
    }
})