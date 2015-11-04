

var Post = require('./schemas/Posts.js');

module.exports.savePost = function(postInfo, callback){
    Post.create(postInfo, callback);
}

module.exports.findPost = function(key, callback){
	key['is_valid'] = {
		is_valid : true
	};
	console.log('key, ', key);
	Post.findOne(key)
	.populate('_writer', 'user_id nick profile_photo')
	.exec(callback);
}

module.exports.findShowPosts = function(key, filter, callback){
	key.post_type = 1; // 문화 예술
	Post.findOne(key)
	.populate('_writer', 'user_id nick profile_photo')
	.exec(callback); 
}

module.exports.findWorkPosts = function(key, filter, callback){
	key.post_type = 0; // 일반 예술
	Post.findOne(key)
	.populate('_writer', 'user_id nick profile_photo')
	.exec(callback); 
}

module.exports.findPosts = function(key, filter, callback){
	Post.find(key)
	.populate({
		path : '_writer',
		select : 'user_id nick profile_photo'
	})
	.exec(callback);
}

module.exports.updateReplies = function(postId, newId, callback){
	Post.findOne({_id : postId})
	.select({replies : 1})
	.exec(function(err, doc){
		if(err){
			console.error('ERROR GETTING REPLIES : ', err);
			callback(err, doc);
		}
		console.log('replies : ', doc);
		if(doc.length <2){
			// 그냥 추가 
			Post.update({_id : postId}, {$push : {replies : newId}}, {upsert : true}, callback);
			//Post.update
		}else{
			//앞에 것 지우고 뒤에 추가
			doc.replies.$shift();
			console.log('after shift', doc.replies);
			doc.save(function(err){
				if(err){
					console.error('error');
				}else{
					Post.update({_id : postId}, {$push : {replies : newId}}, {upsert : true}, callback);
				}
			});
		}
	});
}