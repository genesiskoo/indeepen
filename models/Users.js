/**
 * Created by Moon Jung Hyun on 2015-11-06.
 */

var mongoose = require('mongoose');
var Blog = require('./Blogs');
var ObjectId = mongoose.Types.ObjectId;
var Schema = mongoose.Schema;

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
    myArtists : [{type : Schema.Types.ObjectId, ref:'Blog'}],
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
        this.findOneAndUpdate({_id : new ObjectId(userId)}, {$set : newInfo}, callback);
    },
    updateProfilePhoto : function(userId, newUrl, callback){
        this.findOneAndUpdate({_id : new ObjectId(userId)}, {$set : {profilePhoto : newUrl}}, callback);
    },
    findOneMyArtists : function(userId, callback){
        this.findOne({_id : new ObjectId(userId)}).
            select('-_id -email -password -name -nick -profilePhoto -intro -phone -createAt -updateAt -isPublic').
            exec(callback);
    },
    pushMyArtists : function(userId, blogId, callback){
        this.findOneAndUpdate({_id : new ObjectId(userId)}, {$push : {myArtists : new ObjectId(blogId)}}, callback);
    },
    pullMyArtists : function(userId, blogId, callback){
        this.findOneAndUpdate({_id : new ObjectId(userId)}, {$pull : {myArtists : new ObjectId(blogId)}}, callback);
    },
    isExistEmail : function(email, callback){
        this.findOne({email : email}, function(err, doc){
            if(doc == null){
                callback(err, false);
            }else{
                callback(err, true);
            }
        });
    },
    updatePassword : function(userId, pw, callback){
        this.findOneAndUpdate({_id : new ObjectId(userId), password : pw.oldPw}, {$set : {password : pw.newPw}}, callback);
    }
};

module.exports = mongoose.model('User', userSchema);