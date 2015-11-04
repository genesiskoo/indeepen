var express = require('express');
var mongoose = require('mongoose');

mongoose.connect('mongodb://54.199.219.43:3000/indeepenkoo');

var Post = require('./models/');

