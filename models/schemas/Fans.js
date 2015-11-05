var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var fanSchema = new Schema({
	
	_user : {type : Number, ref : 'User'},
	_blog : {type : Number, ref : 'Blog'},
	profilePhoto: String,
	nick: String,
	createAt: {
		type: Date,
		default: Date.now
	}
});

module.exports = mongoose.model('fan', fanSchema);