var mongoose = require('mongoose');
mongoose.connect('mongodb://52.192.126.247:3000/indeepen');
//mongoose.connect('mongodb://localhost:27017/indeepen');
module.exports = mongoose;
//var db = mongoose.connect('mongodb://localhost:27017/indeepen');
//module.exports = db;d