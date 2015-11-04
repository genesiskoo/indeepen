
var mongoose = require('./config/mongoose_conn.js');


var Users = require('./models/Users.js');


for(var i=1; i<11; i++) {
	Users.saveUser({
		email: 'moon'+i+'@naver.com',
		password: '1234',
		name: "문땡땡",
		nick: "moon"+i,
		profile_photo: "/images/profile_thumbnail/"+i+'.png',
		intro: '안뇽하세요. moon'+i+'입니다. 잘 부탁드립니다.',
		phone: '010-0000-000'+i
	}, function (err, doc) {
		if (err) {
			console.error(err);
			return;
		}
		console.log(' create' + doc);
	});
}

