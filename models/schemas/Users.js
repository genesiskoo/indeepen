var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
autoIncrement.initialize(mongoose);
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
    upd_date : {
        type : Date,
        default : Date.now
    },
    is_public: {
        type: Boolean,
        default: true
    },
    is_valid: {
        type: Boolean,
        default: true
    }
}, { versionKey: false });

userSchema.plugin(autoIncrement.plugin, {
	model : 'User',
	startAt : 1
});


module.exports = mongoose.model('User', userSchema);