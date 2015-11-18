/**
 * Created by Moon Jung Hyun on 2015-11-06.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Types.ObjectId;

var Blog = require('./Blogs');
var Comment = require('./Comments');

var postSchema = new Schema({
    postType : Number, // 0(일반 - work), 1(문화예술 - show),
    createAt : {
        type : Date,
        default : Date.now
    },
    updateAt : {
        type : Date,
        default : Date.now
    },
    _writer : {   // Blog에서 user_id, nick, profile_photo  가져옴
        type : Schema.Types.ObjectId,
        ref : 'Blog'
    },
    content : {type : String, trim : true},
    hashTags : [{type : String, trim : true}],
    likes : [{type : Schema.Types.ObjectId, ref : 'Blog'}],
    //comments : [{type : Schema.Types.ObjectId, ref : 'Comment'}],
    work : {
        type : {type : Number}, // 0(그림), 1(사진), 2(음악), 3(영상예술)
        emotion : Number//0(감정없음), 1(기쁨), 2(사랑), 3(슬픔),4( 화남)
    },
    show : {
        title : {type : String, trim : true},
        type : {type : Number}, // 0(전시), 1(공연), 2(상영), 3(예술모임), 4(패스티벌)
        tags : [{
            _user : {  // Blog에서 user_id, nick, profile_photo 가져옴
                type : Schema.Types.ObjectId,
                ref : 'Blog'
            },
            point : {
                x : Number,
                y : Number
            }
        }],
        startDate : Date,
        endDate : Date,
        startTime : {type : String, trim : true},
        endTime : {type : String, trim : true},
        fee : Number,
        location : {
            point : {
                type : {
                    type : String,
                    default : 'Point'
                },
                coordinates : [Number]
            },
            address : {type : String, trim : true}
        }
    },
    youTube : String,
    resources : [{
        _id : false,
        type : {type : String},            //0(이미지), 1(동영상), 2(음원)
        originalPath : String,      // 영상, 음원이 thumbnail 사용 안하면 여기다가 저장
        thumbnailPath : String
    }]
}, {versionKey : false});



/*
    method
 */
postSchema.methods = {
    /**
     * 해당 postType의 Post만 가져오기
     * @param callback
     * @returns {Promise}
     */
    findByPostType : function(options,lastSeen, field, callback){
        if(!options) options = {};
        var select = '';
        console.log(field);
        if(lastSeen == null){
            if(this.postType == 0)
                //select = '_id createAt _writer content likes work resources';
                select = '-updateAt -hashTags -show';
            else
                select = '-content -hashTags -work -show.location.point'; //-수정
            this.model('Post').find(options).
            where('postType').
            equals(this.postType).
            select(select).
            sort({createAt : -1}).
            limit(10).
            populate({path : '_writer', select : '-type -bgPhoto -intro -iMissYous -fans -location -createAt -updateAt -isActivated'}).
            //populate({path : 'likes', select : '_id _user nick profilePhoto'}).
            populate('show.tags._user', '_id _user nick profilePhoto').
            exec(callback);
        }else{
            this.model('Post').find({_id : {$lt : lastSeen}}).
            where('postType').
            equals(this.postType).
            select(select).
            sort({createAt : -1}).
            limit(10).
            populate({path : '_writer', select : '-type -bgPhoto -intro -iMissYous -fans -location -createAt -updateAt -isActivated'}).
            //populate({path : 'likes', select : '_id _user nick profilePhoto'}).
            populate('show.tags._user', '_id _user nick profilePhoto').
            exec(callback);
        }
    }
};

/*
    Statics
 */
postSchema.statics = {
    /**
     * 특정 post의 상세정보 가져오기 - pagination 추가
     * @param postId
     * @param callback
     * @returns {Promise}
     */
    findPost : function(postId, postType, callback){
        var select = '';
        if(postType == 0){
            select ='createAt _writer content likes work resources';
        }else{
            select = 'createAt _writer content likes show resources';
        }
        return this.findOne({_id : new ObjectId(postId)}).
            select(select).
            populate('_writer', '_id _user nick profilePhoto').
            populate('show.tags._user', '_id _user nick profilePhoto').
            sort({createAt : -1}).
            exec(callback);

    },
    /**
     * 모든 type의 post들 가져오기
     * @param options filtering 조건들
     * @param callback
     * @returns {Promise}
     */
    findPosts : function(options, lastSeen, callback){
        if(!options) options = {};
        if(lastSeen == null){

        }else{

        }

        return this.find(options).
            select('postType createAt _writer content likes work show resources').
            populate('_writer', '_id _user nick profilePhoto').
            populate('show.tags._user', '_id _user nick profilePhoto').
            sort({createAt : -1}).
            exec(callback);
    },
    /**
     * 모든 type의 posts 가져오기 (fan page)
     * @param userBlogId
     * @param userArtists
     * @param lastSeen
     * @param callback
     */
    findPostsAtFanPage : function(userBlogId, userArtists, lastSeen, callback){
        if(lastSeen == null){
            this.find({$or : [{$and : [{_writer : new ObjectId(userBlogId)}, {postType : 0}]},{_writer : {$in : userArtists}}]}).
                sort({createAt : -1}).
                select('-updateAt -hashTags -show.location.point').
                limit(10).
                populate('_writer', '-type -bgPhoto -intro -iMissYous -fans -location -createAt -updateAt -isActivated').
                populate('show.tags._user', '-_user -type -bgPhoto -intro -iMissYous -fans -location -createAt -updateAt -isActivated').
                exec(callback);
        }else{
            this.find({$or : [{$and : [{_writer : new ObjectId(userBlogId)}, {postType : 0}]},{_writer : {$in : userArtists}}],_id : {$lt : lastSeen}}).
                sort({createAt : -1}).
                select('-updateAt -hashTags -show.location.point').
                limit(10).
                populate('_writer', '-type -bgPhoto -intro -iMissYous -fans -location -createAt -updateAt -isActivated').
                populate('show.tags._user', '-_user -type -bgPhoto -intro -iMissYous -fans -location -createAt -updateAt -isActivated').
                exec(callback);
        }

    },
    /**
     * Post정보 저장하기
     * @param postInfo
     * @param callback
     * @returns {postInfo}
     */
    savePost : function(postInfo, callback){
        return this.create(postInfo, callback);
    },
    /**
     * 해당 Post 의 좋아요에 회원 blogId 추가하기
     * @param postId
     * @param blogId
     * @param callback
     * @returns {Query|*}
     */
    pushLike : function(postId, blogId, callback){
        return this.findOneAndUpdate({_id : new ObjectId(postId)}, {$push : {likes : new ObjectId(blogId)}}, callback);
    },
    /**
     * 해당 Post 의 좋아요에 회원 blogId 제거하기
     * @param postId
     * @param blogId
     * @param callback
     * @returns {Query|*}
     */
    pullLike : function(postId, blogId, callback){
        return this.findOneAndUpdate({_id : new ObjectId(postId)}, {$pull : {likes : new ObjectId(blogId)}}, callback);
    },
    removePost : function(postId, callback){
        this.findOneAndRemove({_id : new ObjectId(postId)}, callback);
    },

    /**
     * Find article by id
     *
     * @param {ObjectId} id
     * @param {Function} cb
     * @api private
     */

    load: function (id, cb) {
        this.findOne({ _id : id })
            .populate('user', 'name email username')
            .populate('comments.user')
            .exec(cb);
    },

    /**
     * List articles
     *
     * @param {Object} options
     * @param {Function} cb
     * @api private
     */

    list: function (options, cb) {
        var criteria = options.criteria || {}

        this.find({'postType' : 1})
            .populate('_writer', '_id nick photoProfile')
            .populate('show.tags._user', '_id nick photoProfile')
            .sort({'createAt': -1}) // sort by date
            .limit(options.perPage)
            .skip(options.perPage * options.page)
            .exec(cb);
    },
    findWorkPostsAtBlog : function(writer, lastSeen, callback){
        if(lastSeen == null){
            this.find({_writer : new ObjectId(writer), postType : 0}).
                select('-postType -_writer -createAt -updateAt -content -hashTags -likes -work.emotion -show').
                sort({createAt : -1}).
                limit(15).
                exec(callback);
        }else{
            this.find({_writer : new ObjectId(writer), postType : 0, _id : {$lt : lastSeen}}).
                select('-postType -_writer -createAt -updateAt -content -hashTags -likes -work.emotion -show').
                sort({createAt : -1}).
                limit(15).
                exec(callback);
        }
    },
    findLikePostsAtBlog : function(artistBlogId, lastSeen, callback){
        if(lastSeen == null){
            this.find({likes : new ObjectId(artistBlogId), postType : 0}).
                select('-postType -_writer -likes -createAt -updateAt -content -hashTags -work.emotion -show').
                sort({createAt : -1}).
                limit(15).
                exec(callback);
        }else{
            this.find({likes : new ObjectId(artistBlogId), postType : 0, _id : {$lt : lastSeen}}).
                select('-postType -_writer -likes -createAt -updateAt -content -hashTags -work.emotion -show').
                sort({createAt : -1}).
                limit(15).
                exec(callback);
        }
    }
};

module.exports = mongoose.model('Post', postSchema);

