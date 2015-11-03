var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');
autoIncrement.initialize(mongoose);

var blogSchema = new Schema({
	_id: Number,
	user_id: Number,
	type : {                         /// 0(개인) 1(블로그)
		type : Number,
		default : 0
	},
	bg_photo: {
		type : String,
		default : '//////////////////// 추후 결정'
	},
	nick: String,
	profile_photo: {
		type : String,
		default : '추후 결정'
	},
	intro : String,
	i_miss_you: [{
		user_id: Number,
		profile_photo: String,
		nick: String
	}],
	fans: [{
		user_id: Number,
		profile_photo: String,
		nick: String
	}],
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
	rg_date: {
		type: Date,
		default: Date.now
	},
	is_activated: {
		type: Boolean,
		default: true
	},
	is_valid: {
		is_valid: {
			type: Boolean,
			default: true
		},
		deleted_date: {
			type: Date,
			default: ''
		}
	}
}, { versionKey: false });

userSchema.plugin(autoIncrement.plugin, {
	model : 'User',
	startAt : 1
});

module.exports = mongoose.model('Blog', blogSchema);