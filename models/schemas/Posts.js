var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Blog = require('./Blogs.js');
var Reply = require('./Replies.js');

var postSchema = new Schema({
	_id : Number,
	post_type : Number, // 0(일반), 1(문화예술),
	rg_date : {
		type : Date,
		default : Date.now
	},
	_writer : {   // Blog에서 user_id, nick, profile_photo  가져옴
		type : Number,
		ref : 'Blog'
	}, 
	content : {type : String, trim : true},
	replies : [{type : Number, ref : 'Reply'}], // 최신 2개의 댓글 아이디만 들어감 
	hash_tags : [{type : String, trim : true}],
	likes : [{type : Number, ref : 'User'}],
	work : {
		type : {type : Number}, // 0(그림), 1(사진), 2(음악), 3(영상예술) 
		emotion : Number,//0(감정없음), 1(기쁨), 2(사랑), 3(슬픔),4( 화남)	
	},
	show : {
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
		date : {
        	start_date : Date,
            end_date : Date
		},
        time : {
        	start_time : {type : String, trim : true},
            end_time : {type : String, trim : true}
		},
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
		},
	},
	resources : [{
		kind: Number,            //0(이미지), 1(동영상), 2(음원)
		original_path : String,      // 영상, 음원이 thumbnail 사용 안하면 여기다가 저장
		thumbnail_path : String
	}],
	reports : [{type : Number, ref : 'Report'}],
	is_valid : {
		is_valid : {
			type : Boolean,
			default : true
		},
		delete_date : Date
	}
}, {versionKey : false});

module.exports = mongoose.model('Post', postSchema);

