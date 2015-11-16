var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Types.ObjectId;

var User = require('./Users');

var blogSchema = new Schema({
	_user: { type : Schema.Types.ObjectId, ref :'User'},
	type : {                         /// 0(개인) 1(공간)
		type : Number,
		default : 0
	},
	bgPhoto: {
		type : String,
		default : 'https://s3-ap-northeast-1.amazonaws.com/in-deepen/images/bg/default_bg.png'
	},
	nick: String,
	profilePhoto: {
		type : String,
		default : 'https://s3-ap-northeast-1.amazonaws.com/in-deepen/images/profile/icon-cafe.png'
	},
	intro : String,
    phone : String,
    email : String,
    iMissYous : [{type : Schema.Types.ObjectId, ref : 'Blog'}],
	fans: [{type : Schema.Types.ObjectId, ref : 'Blog'}],
	location: {
		point: {
			type: {
				type: String,
				default: 'Point'
			},
			coordinates: [Number]
		},
		address: String
	},
	createAt: {
		type: Date,
		default: Date.now
	},
    updateAt : {
        type : Date,
        default : Date.now
    },  // blog 에 isActivated가 있는 것보다는 User에 활동 중인 blog의 _id가 있는 게  더 좋을 수도...
	isActivated: {
		type: Boolean,
		default: true
	}
}, { versionKey: false });

blogSchema.statics = {
    // 댓글 달때 사용자 id 편하게 하기 위해 한 것. 나중에 지워....
    findBlogs: function (callback) {
        return this.find().exec(callback);
    },
    saveBlog: function (blogInfo, callback) {
        return this.create(blogInfo, callback);
    },
    findBlogsOfUser : function(userId, callback){
        this.find({ _user : new ObjectId(userId) }).
            select('-_user -bgPhoto -intro -iMissYous -fans -location -createAt -updateAt').
            exec(callback);
    },
    findOneBlog : function(blogId, callback){
        this.findOne({_id : new ObjectId(blogId)}).
            select('-intro -location -createAt -updateAt -isActivated').
            exec(callback);
    },
    findFansOfBlog : function(blogId, callback){ // pagination 추가
        this.findOne({_id : new ObjectId(blogId)}).
            select('-_id -_user -type -bgPhoto -nick -profilePhoto -intro -iMissYous -location -createAt -updateAt -isActivated').
            populate('fans', '-type -bgPhoto -intro -iMissYous -fans -location -createAt -updateAt -isActivated').
            exec(callback);
    },
    findArtistsOfUser : function(blogId, callback){
        this.find({fans : new ObjectId(blogId)}).
            select('-type -bgPhoto -intro -fans -iMissYous -location -createAt -updateAt -isActivated').
            exec(callback);
    },
    findIMissYousOfBlog : function(blogId, callback){  //pagination 추가
        this.findOne({_id : new ObjectId(blogId)}).
            select('-_id -_user -type -bgPhoto -nick -profilePhoto -intro -fans -location -createAt -updateAt -isActivated').
            populate('iMissYous', '-type -bgPhoto -intro -iMissYous -fans -location -createAt -updateAt -isActivated').
            exec(callback);
    },
    findProfileOfArtistBlog : function(blogId, callback){
        this.findOne({_id : new ObjectId(blogId)}).
            select('-type -bgPhoto -nick -profilePhoto -iMissYous -fans -location -createAt -updateAt -isActivated').
            populate('_user', '-password -profilePhoto -intro -createAt -updateAt').
            exec(callback);
    },

    //공용
    updateProfileOfBlog : function(blogId, newInfo, callback){
        this.findOneAndUpdate({_id : new ObjectId(blogId)}, { $set : newInfo}, callback);
    },
    findProfilePhotoOfBlog : function(blogId, callback){
        this.findOne({_id : new ObjectId(blogId)}).
            select('-_id -_user -type -bgPhoto -nick -intro -fans -iMissYous -location -createAt -updateAt -isActivated').
            exec(callback);
    },
    updateProfilePhotoOfBlog : function(blogId, newUrl, callback){
        this.findOneAndUpdate({_id : new ObjectId(blogId)}, {$set : {profilePhoto : newUrl}}, callback);
    },
    updateBgPhotoOfBlog : function(blogId, newUrl, callback){
        this.findOneAndUpdate({_id : new ObjectId(blogId)}, {$set : {bgPhoto : newUrl}}, callback);
    },
    pushFanToBlog : function(blogId, userBlogId, callback){
        return this.findOneAndUpdate({_id : new ObjectId(blogId)}, {$push : {fans : new ObjectId(userBlogId)}}, callback);
    },
    pullFanFromBlog : function(blogId, userBlogId, callback){
        return this.findOneAndUpdate({_id : new ObjectId(blogId)}, {$pull : {fans : new ObjectId(userBlogId)}}, callback);
    },
    pushIMissYouToBlog : function(blogId, userBlogId, callback){
        return this.findOneAndUpdate({_id : new ObjectId(blogId)}, {$push : {iMissYous : new ObjectId(userBlogId)}}, callback);
    },
    removeBlog : function(blogId, callback){
        return this.findOneAndRemove({_id : new ObjectId(blogId)}, callback);
    },
    updateIsActivated: function(userId, blogId, callback){
        var that = this;
        this.update({_user : new ObjectId(userId)}, {$set : {isActivated : false}}, {multi : true}, function(err, docs){
            if(err){
                callback(err, null);
            }else{
                that.findOneAndUpdate({_id : new ObjectId(blogId)}, {$set : {isActivated : true}}, callback);
            }
        });
    },
    findLocation : function (blogId, callback){
        return  this.findOne({_id : new ObjectId(blogId)})
                      .select('location')
                      .exec(callback);
    },
    findProfileOfSpaceBlog : function(blogId, callback){
        return this.findOne({_id: new Object(blogId)})
                    .select('-type  -bgPhoto -profilePhoto -iMissYous -fans -location -createAt -updateAt -isActivated')
                    .exec(callback);
    }

};


module.exports = mongoose.model('Blog', blogSchema);