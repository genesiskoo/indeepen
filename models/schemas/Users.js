/**
 * Created by Moon Jung Hyun on 2015-11-06.
 */

var mongoose = require('mongoose');
var Blog = require('./Blogs');

var userSchema = new mongoose.Schema({
    email: {type : String, unique : true},
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
    intro: {type : String, trim : true},
    phone: {type : String, trim : true},
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
    }
}, { versionKey: false });

userSchema.post('save', function(doc){
    console.log('Save User _id', doc._id);
    var blogInfo = {
        _user : doc._id,
        nick : doc.nick
    };
    Blog.saveBlog(blogInfo, function(err, doc){
        if(err){
            console.error('Save Blog Error in User post event ', err);
            return;
        }
        console.log(doc);
    });
});

module.exports = mongoose.model('User', userSchema);