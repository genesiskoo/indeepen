/**
 * Created by Moon Jung Hyun on 2015-11-14.
 */

var express = require('express');
var router = express.Router();
var User = require('./../controllers/Users');

router.post('/', User.join);

router.post('/emailCheck', User.checkEmail);

router.put('/pw', User.changePw);

router.get('/info', User.getUserInfo);

router.put('/activityMode', User.changeActivityMode);



module.exports = router;