{
	_id : Number,
	post_type : Number, // 0(일반), 1(문화예술)
	work : {
		writer : {
			user_id : Number,
			blog_id : Number,
			nick : String,
			profile_photo : String
		}, 
            	type : Number, // 0(그림), 1(사진), 2(음악), 3(영상예술) 
            	emotion : Number,
		content : {type : String, trim : true},
            	hash_tags : [{type : String, trim : true}],
            	replies : [{
                	_id : Number,
			     writer : {
				user_id : Number,
                blog_id : Number,
				   nick : String,
				profile_photo : String
			},
                  	content : {type : String, trim : true},
                  	rg_date : {
                        	type : Date,
                        	default : Date.now
                  	},
                  	is_valid : {
                        	type : Boolean,
                        	default : true
                  	}
            	}],
            	rg_date : {
                  	type : Date,
                  	default : Date.now
            	},
            	likes : [Number],
            	reports : [Number],
            	is_valid : {
                	is_valid : {
                        	type : Boolean,
                        	default : true
                  	},
                	delete_date : Date
            	}
	},
	show : {
		writer : {
			user_id : Number,
			blog_id : Number,
			nick : String,
			profile_photo : String
		}, 
            	type : Number, // 0(전시), 1(공연), 2(상영), 3(예술모임), 4(패스티벌) 
            	emotion : Number,
            	tags : [{
			user_id : Number,
                  	nick : {type : String, trim : true},
                  	profile_photo : String,
                  	point {
                        	x : Number,
                        	y : Number
                  	}
            	}],
            	content : {type : String, trim : true},
            	hash_tags : [{type : String, trim : true}],
		replies : [{
                	_id : Number,
                	writer : {
				user_id : Number,
                  		blog_id : Number,
				nick : String,
				profile_photo : String
			},
                	content : {type : String, trim : true},
                	rg_date : {
                        	type : Date,
                        	default : Date.now
                  	},
                  	is_valid : {
                        	type : Boolean,
                        	default : true
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
                        	type : "Point",
                        	coordinates : <coordinates>
                	},
                	address : {type : String, trim : true}
            	},
            	rg_date : {
                  	type : Date,
                  	default : Date.now
            	},
            	likes : [Number],
            	reports : [Number],
            	is_valid : {
                	is_valid : {
                        	type : Boolean,
                        	default : true
                  	},
                  	delete_date : Date
            	}   
	},
	content : [{
            type: Number,            //0(이미지), 1(동영상), 2(음원)
            resourcePath : String //thumbnail path보류
      }]	 
}
