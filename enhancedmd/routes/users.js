var express = require('express');
var router = express.Router();
var userapi = require('../kcapi/kcuserapi');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/getUserArticles', function(req, res, next) {
    var uid = req.body.userid;
    var pageid = req.body.pageid;
    var pagecount = req.body.pagecount;

    userapi.getUserArticles(uid, pageid, pagecount, {
        success: function(results){
            var resultObj = {};
            resultObj["result"] = "0";
            resultObj["objs"] = results;
            return res.status(200).send(resultObj);
        },
        error: function(err){
            var resultObj = {};
            resultObj["result"] = "1";
            resultObj["error"] = err.message;
            return res.status(200).send(resultObj);
        }
    });
});

// actually this shall not be used
router.post('/createUserArticle', function(req,res,next) {
    var uid = req.body.userid;

    userapi.createUserArticle(uid, {
        success: function(aritcalid){
            var resultObj = {};
            resultObj["result"] = "0";
            resultObj["articleid"] = aritcalid;
            return res.status(200).send(resultObj);
        },
        error: function (err){
            var resultObj = {};
            resultObj["result"] = "1";
            resultObj["error"] = err.message;
            return res.status(200).send(resultObj);
        }
    });
});

router.post('/createArticleViaWxArt', function(req, res, next){
    var uid = req.body.userid;
    var wxurl = req.body.wxurl;

    userapi.createArticleViaWxArt(uid, wxurl, {
        success: function(title, articleid, html){
            var resultObj = {};
            resultObj["result"] = "0";
            resultObj["articleid"] = articleid;
            resultObj["title"] = title;
            resultObj["content"] = html;
            return res.status(200).send(resultObj);
        },
        error: function (err){
            var resultObj = {};
            resultObj["result"] = "1";
            resultObj["error"] = err.message;
            return res.status(200).send(resultObj);
        }
    });
});

router.post('/getArticleInfo', function(req, res, next){
    var uid = req.body.userid;
    var aid = req.body.articleid;

    userapi.getUserArticleInfo(uid, aid, {
        success: function (results){
            var resultObj = {};
            resultObj["result"] = "0";
            if (results.length > 0) {
                resultObj["obj"] = results[0];
            }
            return res.status(200).send(resultObj);
        },
        error: function (err){
            var resultObj = {};
            resultObj["result"] = "1";
            resultObj["error"] = err.message;
            return res.status(200).send(resultObj);
        }
    })
});

router.post('/updateUserArticleTitleImg', function(req,res,next) {
    var uid = req.body.userid;
    var aid = req.body.articleid;
    var title = req.body.title;
    var desc = req.body.desc;
    var img = req.body.img;

    userapi.updateUserArticleTitleImg(uid, aid, title, desc, img, {
        success: function(aritcalid){
            var resultObj = {};
            resultObj["result"] = "0";
            return res.status(200).send(resultObj);
        },
        error: function (err){
            var resultObj = {};
            resultObj["result"] = "1";
            resultObj["error"] = err.message;
            return res.status(200).send(resultObj);
        }
    });
});

router.post('/updateAritcleUserInfo', function(req,res,next){
    var uid = req.body.userid;
    var aid = req.body.articleid;

    userapi.updateAritcleUserInfo(uid, aid,{
        success: function(aritcalid){
            var resultObj = {};
            resultObj["result"] = "0";
            return res.status(200).send(resultObj);
        },
        error: function (err){
            var resultObj = {};
            resultObj["result"] = "1";
            resultObj["error"] = err.message;
            return res.status(200).send(resultObj);
        }
    });
});

router.post('/deleteUserArticle', function(req, res, next){
    var uid = req.body.userid;
    var aid = req.body.articleid;

    userapi.deleteUserArticle(uid, aid, {
        success: function(status){
            var resultObj = {};
            resultObj["result"] = "0";
            return res.status(200).send(resultObj);
        },
        error: function(err){
            var resultObj = {};
            resultObj["result"] = "1";
            resultObj["error"] = err.message;
            return res.status(200).send(resultObj);
        }
    })
});

router.post('/getUserCollection', function(req, res, next) {
    var uid = req.body.userid;
    var type = req.body.type;
    var pageid = req.body.pageid;
    var pagecount = req.body.pagecount;

    userapi.getUserCollection(uid, type, pageid, pagecount, {
        success: function(results){
            var resultObj = {};
            resultObj["result"] = "0";
            resultObj["objs"] = results;
            return res.status(200).send(resultObj);
        },
        error: function(err){
            var resultObj = {};
            resultObj["result"] = "1";
            resultObj["error"] = err.message;
            return res.status(200).send(resultObj);
        }
    });
});

router.post('/addUserCollection', function(req, res, next) {
    var uid = req.body.userid;
    var tid = req.body.templateid;
    var orihtml = req.body.orihtml;

    userapi.addUserCollection(uid, tid, orihtml, {
        success: function(sid){
            var resultObj = {};
            resultObj["result"] = "0";
            resultObj["sid"] = sid;
            return res.status(200).send(resultObj);
        },
        error: function(err){
            var resultObj = {};
            resultObj["result"] = "1";
            resultObj["error"] = err.message;
            return res.status(200).send(resultObj);
        }
    });
});

router.post('/deleteUserCollection', function(req, res, next) {
    var uid = req.body.userid;
    var cid = req.body.cid;

    userapi.deleteUserCollection(uid, cid, {
        success: function(sid){
            var resultObj = {};
            resultObj["result"] = "0";
            return res.status(200).send(resultObj);
        },
        error: function(err){
            var resultObj = {};
            resultObj["result"] = "1";
            resultObj["error"] = err.message;
            return res.status(200).send(resultObj);
        }
    });
});

router.post('/getUserLibrary', function(req, res, next) {
    var uid = req.body.userid;
    var pageid = req.body.pageid;
    var pagecount = req.body.pagecount;

    userapi.getUserLibrary(uid, pageid, pagecount, {
        success: function(results){
            var resultObj = {};
            resultObj["result"] = "0";
            resultObj["objs"] = results;
            return res.status(200).send(resultObj);
        },
        error: function(err){
            var resultObj = {};
            resultObj["result"] = "1";
            resultObj["error"] = err.message;
            return res.status(200).send(resultObj);
        }
    });
});

router.post('/addUserLibrary', function(req, res, next) {
    var uid = req.body.userid;
    var url = req.body.url;

    userapi.addUserLibrary(uid, url, {
        success: function(lid){
            var resultObj = {};
            resultObj["result"] = "0";
            resultObj["lid"] = lid;
            return res.status(200).send(resultObj);
        },
        error: function(err){
            var resultObj = {};
            resultObj["result"] = "1";
            resultObj["error"] = err.message;
            return res.status(200).send(resultObj);
        }
    });
});

router.post('/deleteUserLibrary', function(req, res, next) {
    var uid = req.body.userid;
    var lid = req.body.lid;

    userapi.deleteUserLibrary(uid, lid, {
        success: function(rst){
            var resultObj = {};
            resultObj["result"] = "0";
            return res.status(200).send(resultObj);
        },
        error: function(err){
            var resultObj = {};
            resultObj["result"] = "1";
            resultObj["error"] = err.message;
            return res.status(200).send(resultObj);
        }
    });
});


module.exports = router;
