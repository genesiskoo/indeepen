var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');
autoIncrement.initialize(mongoose);

var Blog = require('./Blogs');
var User = require('./Users');

var postSchema = new Schema({
    _id : Number,
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
        type : Number,
        ref : 'Blog'
    },
    content : {type : String, trim : true},
    hashTags : [{type : String, trim : true}],
    likes : [{type : Number, ref : 'Blog'}
        //{
        //    _user : {type : Number, ref : 'User'},
        //    flag : {
        //        type : Boolean,
        //        default : true
        //    }
        //}
    ],
    work : {
        type : {type : Number}, // 0(그림), 1(사진), 2(음악), 3(영상예술)
        emotion : Number//0(감정없음), 1(기쁨), 2(사랑), 3(슬픔),4( 화남)
    },
    show : {
        title : String,
        type : {type : Number}, // 0(전시), 1(공연), 2(상영), 3(예술모임), 4(패스티벌)
        tags : [{
            _user : {  // Blog에서 user_id, nick, profile_photo 가져옴
                type : Number,
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
    resources : [{
        _id : false,
        type : {type : String},            //0(이미지), 1(동영상), 2(음원)
        originalPath : String,      // 영상, 음원이 thumbnail 사용 안하면 여기다가 저장
        thumbnailPath : String
    }],
    isValid : {
        type : Boolean,
        default : true
    }
}, {versionKey : false});

postSchema.methods.findByPostType =function(callback){
    return this.model('Post').find({postType : this.postType, isValid : true}).
        sort({createAt : -1}).
        populate({path : '_writer', select : '_id _user nick profilePhoto'}).
        populate({path : 'likes', select : '_id _user nick profilePhoto'}).
        populate({path : 'show.tags', select : '_id _user nick profilePhoto'}).
        exec(callback);
};


postSchema.plugin(autoIncrement.plugin, {
	model : 'Post',
	startAt : 1
});

module.exports = mongoose.model('Post', postSchema);

