var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var imissyouSchema = new Schema({
	
	user_id : Number,
	blog_id : Number,
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

module.exports = mongoose.model('imissyou', imissyouSchema);