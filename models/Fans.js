var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var fanSchema = new Schema({
	
<<<<<<< HEAD
	user_id : {type : Number, ref : 'User'},
	blog_id : {type : Number, ref : 'Blog'},
=======
	user_id : Number,
	blog_id : Number,
>>>>>>> koo
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