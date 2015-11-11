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
        default : 'https://s3-ap-northeast-1.amazonaws.com/in-deepen/images/profile/icon-person.png'
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
        nick : doc.nick,
        profilePhoto : doc.profilePhoto
    };
    Blog.saveBlog(blogInfo, function(err, doc){
        if(err){
            console.error('Save Blog Error in User post event ', err);
            return;
        }
        console.log(doc);
    });
});

userSchema.statics = {
    saveUser : function(userInfo, callback){
        return this.create(userInfo, callback);
    },
    updateProfileAtArtistBlog : function(userId, newInfo, callback){
        this.findOneAndUpdate({_id : new ObjectId(blogId)}, {$set : newInfo}, callback);
    }
};

module.exports = mongoose.model('User', userSchema);