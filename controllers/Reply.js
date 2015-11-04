var Reply = require('../models/Replies.js'); 
var Post = require('../models/Posts.js');

var userKey = 1; // session에 있을 정보
var blogKey = 1; // session에 있을 정보


module.exports.addReply = function(req, res, next){
	var id = req.params.post_id;
	var content = req.body.content;
	Reply.saveReply({
		post_id : id,
		_writer : writer,
		content : content
	}, function(err, doc){
		if(err){
            console.error('ERROR AT ADD REPLY - ', err);
            var error = new Error('댓글을 입력할 수 없습니다.');
            error.code = 400;
            return next(error);
        }
        // app 에서 변경
        res.redirect('/reply/'+id);
	});
}

module.exports.findReplies = function(req, res, next){
	var id = req.params.post_id;
	Reply.findReplies(id, function(err, docs){
        if(err){
            var error = new Error('댓글을 불러올 수 없습니다.');
            error.code = 400;
            return next(error);
        }
		res.render('add_reply', {postId : id, replies : docs});
	});
}