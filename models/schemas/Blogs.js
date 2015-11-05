var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = require('./Users');

var autoIncrement = require('mongoose-auto-increment');
autoIncrement.initialize(mongoose);

var blogSchema = new Schema({
	_id: Number,
	_user: { type : Number, ref :'User'},
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
	fans: [{type : Number, ref : 'User'}],
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
    },
	isActivated: {
		type: Boolean,
		default: true
	},
	isValid: {
        type: Boolean,
        default: true
    }
}, { versionKey: false });

blogSchema.plugin(autoIncrement.plugin, {
	model : 'Blog',
	startAt : 1
});

module.exports = mongoose.model('Blog', blogSchema);