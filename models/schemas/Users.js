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
    profilePhoto: {
        type : String,
        default : '/photo/profile/default_profile.png'
    },
    intro: String,
    phone: String,
    createAt: {
        type: Date,
        default: Date.now
    },
    updateAt : {
        type : Date,
        default : Date.now
    },
    isPublic: {
        type: Boolean,
        default: true
    },
    isValid: {
        type: Boolean,
        default: true
    }
}, { versionKey: false });

userSchema.plugin(autoIncrement.plugin, {
	model : 'User',
	startAt : 1
});


module.exports = mongoose.model('User', userSchema);