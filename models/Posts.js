var Post = require('./schemas/Posts.js');

module.exports.savePost = function(postInfo, callback){
    Post.create(postInfo, callback);
}

module.exports.findPost = function(postId, callback){
	console.log('key, ', postId);
	Post.findOne(postId)
	.populate('_writer', '_user nick profile_photo')
	.exec(callback);
}

module.exports.findShowPosts = function(key, callback){
	key.postType = 1; // 문화 예술
	Post.find(key)
	.populate('_writer', 'userId nick profilePhoto')
	.exec(callback); 
}

module.exports.findWorkPosts = function(key, filter, callback){
	key.postType = 0; // 일반 예술
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

