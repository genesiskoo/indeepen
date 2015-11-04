var mongoos = require('./config/mongoose_conn.js');

var Post = require('./models/Posts.js');

var workinfo = {
	post_type : 0,
	_writer : 1,
	content : '아.. 왜 이리 고칠게 많냐... #슬픈날 이다...',
	hash_tags : ['슬픈날'],
	likes : [{ _user : 2},{ _user : 3}, { _user : 4}],
	work : {
		type : 0,
		emotion : 3
	},
	resources : [{
		kind : 0,
		original_path : '/contents/images/1.png',
		thumbnail_path : '/contents/images_thumbnail/1.png'
	},
	{
		kind : 0,
		original_path : '/contents/images/2.png',
		thumbnail_path : '/contents/images_thumbnail/2.png'
	}]
};

 Post.savePost(workinfo, function(err, doc){
 	if(err){
 		console.error(err);
 		return;
 	}
 	console.log(doc);
 });

//Post.findOne({_id : 1}, function(err, doc){
//	//console.log(doc);
//	if(err){
//		console.error("ERROR GETTING ONE POST : ", err);
//		return;
//	}
//	if(!doc){
//		console.log('NOT DOC');
//	}else {
//		console.log('findOne 1211321321: ', doc.replies);
//		//console.log('findOne : ', doc);
//	}
//});