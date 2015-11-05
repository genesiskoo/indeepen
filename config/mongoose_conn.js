var mongoose = require('mongoose');
mongoose.connect('mongodb://54.199.219.43:3000/indeepen');
//mongoose.connect('mongodb://localhost:27017/indeepen');
module.exports = mongoose;
//var db = mongoose.connect('mongodb://localhost:27017/indeepen');
//module.exports = db;d