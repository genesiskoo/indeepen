var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var blogSchema = new Schema({
	_id: Number,
<<<<<<< HEAD
	user_id: {type :Number, ref : 'User'},
=======
	user_id: Number,
>>>>>>> koo
	email : String,
	phone : String,
	type : {                         /// 0(개인) 1(블로그)
		type : Number,
		default : 0
	},
	bg_photo: {
		type : String,
		default : 'images/bg/default.png'
	},
	nick: String,
	profile_photo: {
		type : String,
		default : '추후 결정'
	},
	intro : String,
<<<<<<< HEAD
	imissyou : [{ type: Schema.Types.ObjectId, ref: 'Imissyou' }],
	fans : [{ type: Schema.Types.ObjectId, ref: 'Fans' }],
=======
>>>>>>> koo
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

module.exports = mongoose.model('blog', blogSchema);