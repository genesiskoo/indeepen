var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var fanSchema = new Schema({
	
	_user : {type : Number, ref : 'User'},
	_blog : {type : Number, ref : 'Blog'},
	profile_photo: String,
	nick: String,
	rg_date: {
		type: Date,
		default: Date.now
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
	
});

module.exports = mongoose.model('fan', fanSchema);