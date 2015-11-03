var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
	_id: Number,
	email: String,
	password : String,
	name: String,
	nick: {
		type : String,
		trim : true
	},
	profile_photo: {
		type : String,
		default : '/photo/profile/default_profile.png'
	},
	intro: String,
	phone: String,
	rg_date: {
		type: Date,
		default: Date.now
	},
	is_public: {
		type: Boolean,
		default: true
	},
	is_valid: {
		is_valid: {
			type: Boolean,
			default: true
		},
		deleted_date: {
			type : Date,
			default : ''
		}
	}
}, { versionKey: false });

module.exports = mongoose.model('User', userSchema);