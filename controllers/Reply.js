var Reply = require('../models/Replies.js'); 
var Post = require('../models/Posts.js');

module.exports.addReply = function(req, res){
	var id = req.params.post_id;
	// 원래는 session에서 가져와야 함
	var writer = req.body.writer;
	var content = req.body.content;
	Reply.saveReply({
		post_id : id,
		_writer : writer,
		content : content
	}, function(err, doc){
		var newId = doc._id; // 새로 넣은 reply의 _id
		console.log('new Id ', newId);

		Post.updateReplies(id, newId, function(err, doc){
			console.log('update finich - \n ', doc);
			res.redirect('/reply/'+id);
		});

		// app 에서 변경

	});
}

module.exports.findReplies = function(req, res){
	var id = req.params.post_id;
	Reply.findReplies(id, function(err, docs){
		res.render('add_reply', {postId : id, replies : docs});
	});
}