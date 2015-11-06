var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = require('./Users');

var blogSchema = new Schema({
	_user: { type : Schema.Types.ObjectId, ref :'User'},
	type : {                         /// 0(개인) 1(블로그)
		type : Number,
		default : 0
	},
	bgPhoto: {
		type : String,
		default : '/images/bg_thumbnail/default.png'
	},
	nick: String,
	profilePhoto: {
		type : String,
		default : '/images/profile_thumbnail/default.png'
	},
	intro : String,
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
    saveBlog : function(blogInfo, callback){
        return this.create(blogInfo, callback);
    },
    findBlogs : function(callback){
        return this.find().exec(callback);
    }
}


module.exports = mongoose.model('Blog', blogSchema);