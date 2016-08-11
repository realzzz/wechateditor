var express = require('express')
var router = express.Router();
var qiniu = require('../util/qiniu/qiniu');
var util = require('../util/util');

var config = util.config();
router.get('/insert', function(req, res, next) {
    var policy = new Object();
    var bucketName = config.qiniubucket;
    var bucketUrl = config.qiniuurl;
    var bucketAK = config.qiniuaccesskey;
    var bucketSK = config.qiniuaccesssecret;

    var key = util.guild();
    key = "em-" + key;
    var policy = new Object();
    policy.scope = bucketName+":"+key;

    var returnBody = '{"key": $(key), "w": $(imageInfo.width), "h": $(imageInfo.height)}';

    policy.returnBody = qiniu.safe64(returnBody);

    var deadline = Math.round(new Date().getTime() / 1000) + 1800;
    policy.deadline = deadline;

    policy.insertOnly =1;

    token = qiniu.genUpToken(bucketAK, bucketSK, policy);

    var resultObj = {};
    resultObj['token']=token;
    resultObj['key']=key;
    resultObj['url']=bucketUrl+'/'+key;

    res.status(200).send(resultObj);

});

module.exports = router;
