var cheerio = require('cheerio')
var express = require('express')
var router = express.Router();
var commonmark = require('../lib/commonmark');
var kcmd_engine = require('../kcmarkdown/engine/engine_api');
var base64 = require('../kcmarkdown/common/base64')
var html2json = require('../kcmarkdown/common/html2json')
var mysql = require('../util/mysql')
var async = require('async');
var task_manage = require('../task/task_manage');
var weixinHtml = require('../kcapi/weixinspider');
var userapi = require('../kcapi/kcuserapi');

/* GET home page. */

router.get('/', function(req, res, next) {
    res.render('md_prod', {  });
});

router.get('/md', function(req, res, next) {
    res.render('md', {});
});

router.get('/mdtest', function(req, res, next) {
    res.render('md_test', {});
});
//prod canvas
router.get('/mdprod', function(req, res, next) {
  res.render('md_prod', {  });
});

router.get('/mdcanvas', function(req, res, next) {
    res.render('md_canvas', {});
});

router.post('/rendermd', function(req, res, next) {
    var mdcontent = req.body.mdcontent;
    var reader = commonmark.Parser();
    var writer = new commonmark.HtmlRenderer();
    var parsed = reader.parse(mdcontent);
    console.log(parsed.toString());
    var result = writer.render(parsed);
    var resultObj = {};
    resultObj["result"] = result;

    console.log("respnose back" + resultObj);
    return res.status(200).send(resultObj);

});

router.post('/html2json', function(req, res, next) {
    var html = req.body.html;

    console.log(html);
    html2json.convert(html, {
        success: function(jsonObj) {
            var jsonStr = JSON.stringify(jsonObj);

            mysql.getConnection(function(error, conn) {
                if (error) {

                } else {
                    // so add this to db, together with the html
                    conn.query("INSERT INTO kcmd_template SET ? ", {
                        "content": jsonStr,
                        "ori_html": html,
                        "type": "正文"
                    }, function(err, result) {
                        if (err) {
                            console.log("insert template error !");
                            console.log(err.message);
                        } else {
                            // well donw
                        }
                        conn.release();
                    });
                }
            });
            return res.status(200).send(jsonStr);
        },
        error: function(err) {
            return res.status(200).send("error " + err.message);
        }
    });

});

router.get('/reConstructAllTemplates', function(req, res, next) {

    mysql.getConnection(function(error, conn) {
        if (error) {

        } else {
            // so add this to db, together with the html
            conn.query("select id,ori_html from kcmd_template", function(err, rows, fields) {
                if (err) {
                    console.log(err.message);
                } else {
                    ids = rows;
                }
                conn.release();

                async.forEachOfSeries(ids, function(v, key, cb) {

                    async.waterfall([
                            function(ac_callback) {
                                html2json.convert(v['ori_html'], {
                                    success: function(jsonObj) {
                                        ac_callback(null, jsonObj);
                                    },
                                    error: function(err) {
                                        ac_callback(err);
                                    }
                                });
                            },
                            function(jObj, ac_callback) {
                                mysql.getConnection(function(error, conn) {
                                    if (error) {
                                        ac_callback(error);
                                    } else {
                                        var jsonStr = JSON.stringify(jObj);
                                        conn.query("update kcmd_template SET content = ?  where id =\'" + v['id'] + "\' ", [jsonStr], function(err, result) {
                                            if (err) {
                                                console.log(err.message);
                                                ac_callback(err);
                                            } else {
                                                //console.log("done with id = " + key);
                                                ac_callback(null);
                                            }
                                            conn.release();
                                        });
                                    }
                                });
                            }
                        ],
                        function(err) {
                            if (err) {
                                console.log(err.message);
                            } else {
                                // donothing
                            }
                            console.log(" over " + key);
                            cb();
                        })

                }, function(err) {
                    return res.status(200).send("done ");
                });

            });
        }
    });

});

router.post('/mdop', function(req, res, next) {
    var op = req.body.op;
    var aid = req.body.aid;
    var kcpath = req.body.kcpath;
    var type = req.body.type;
    var attrs = req.body.attrs;
    var uid = req.body.uid;

    var result = 0;
    var content = "";
    switch (op) {
        case "createArticle":
            if (uid == undefined){
                kcmd_engine.createArticle(attrs, {
                    success: function onSuccess(content, articleid) {
                        console.log("fainal result" + content);
                        var resultObj = {};
                        resultObj["result"] = "0";
                        resultObj["content"] = content;
                        resultObj["articleid"] = articleid;
                        return res.status(200).send(resultObj);
                    },
                    error: function onError(error) {
                        var resultObj = {};
                        resultObj["result"] = "1";
                        return res.status(200).send(resultObj);
                    }
                });
            }
            else{
                userapi.createUserArticle(uid, {
                    success: function(aritcalid,content){
                        var resultObj = {};
                        resultObj["result"] = "0";
                        resultObj["articleid"] = aritcalid;
                        resultObj["content"] = content;
                        return res.status(200).send(resultObj);
                    },
                    error: function (err){
                        var resultObj = {};
                        resultObj["result"] = "1";
                        resultObj["error"] = err.message;
                        return res.status(200).send(resultObj);
                    }
                });
            }
            break;

        case "renderArticle":
            kcmd_engine.renderArticle(aid, {
                success: function onSuccess(content) {
                    var resultObj = {};
                    resultObj["result"] = "0";
                    resultObj["content"] = content;
                    // you can not send json data including html, otherwise " will become /"
                    return res.status(200).send(resultObj);
                },
                error: function onError(error) {
                    var resultObj = {};
                    resultObj["result"] = "1";
                    return res.status(200).send(resultObj);
                }
            });
            break;

        case "pruneArticle":
            kcmd_engine.pruneArticle(aid,{
                success: function onSuccess(articleid, content){
                    var resultObj = {};
                    resultObj["result"] = "0";
                    resultObj["articleid"] = articleid;
                    resultObj["content"] = content;
                    return res.status(200).send(resultObj);
                },
                error: function onError(error){
                    var resultObj = {};
                    resultObj["result"] = "1";
                    return res.status(200).send(resultObj);
                }
            });
            break;
        case "deleteArticle":
            kcmd_engine.deleteArticle(aid, {
                success: function onSuccess() {
                    var resultObj = {};
                    resultObj["result"] = "0";
                    resultObj["aid"] = aid;
                    return res.status(200).send(resultObj);
                },
                error: function onError(error) {
                    var resultObj = {};
                    resultObj["result"] = "1";
                    return res.status(200).send(resultObj);
                }
            });
            break;

        case "insertNode":
            kcmd_engine.insertNodeAfterPath(aid, kcpath, type, attrs, {
                success: function onSuccess(id, path, content) {
                    var resultObj = {};
                    resultObj["result"] = "0";
                    resultObj["kcpath"] = kcpath;
                    resultObj["content"] = content;
                    return res.status(200).send(resultObj);
                },
                error: function onError(error) {
                    var resultObj = {};
                    resultObj["result"] = "1";
                    return res.status(200).send(resultObj);
                }
            });
            break;

        case "duplicateNode":
            kcmd_engine.duplicateNode(aid, kcpath, {
                success: function onSuccess(id, path, content) {
                    var resultObj = {};
                    resultObj["result"] = "0";
                    resultObj["kcpath"] = kcpath;
                    resultObj["content"] = content;
                    return res.status(200).send(resultObj);
                },
                error: function onError(error) {
                    var resultObj = {};
                    resultObj["result"] = "1";
                    return res.status(200).send(resultObj);
                }
            });
            break;

        case "updateNode":
            kcmd_engine.modifyNodeAtPath(aid, kcpath, attrs, -2, {
                success: function onSuccess(aid, patch, content) {
                    var resultObj = {};
                    resultObj["result"] = "0";
                    resultObj["content"] = content;
                    console.log("updated node " + content);
                    return res.status(200).send(resultObj);
                },
                error: function onError(error) {
                    var resultObj = {};
                    resultObj["result"] = "1";
                    return res.status(200).send(resultObj);
                }
            });
            break;

        case "deleteNode":
            kcmd_engine.deleteNodeAtPath(aid, kcpath, -2, {
                success: function onSuccess(nodeid, nodepath) {
                    var resultObj = {};
                    resultObj["result"] = "0";
                    resultObj["aid"] = nodeid;
                    resultObj["kcpath"] = nodepath;
                    return res.status(200).send(resultObj);
                },
                error: function onError(error) {
                    var resultObj = {};
                    resultObj["result"] = "1";
                    return res.status(200).send(resultObj);
                }
            });
            break;
        case "renderNode":
            kcmd_engine.refreshNodeAtPath(aid, kcpath, {
                success: function onSuccess(id, path, content) {
                    var resultObj = {};
                    resultObj["result"] = "0";
                    resultObj["kcpath"] = kcpath;
                    resultObj["content"] = content;
                    return res.status(200).send(resultObj);
                },
                error: function onError(error) {
                    var resultObj = {};
                    resultObj["result"] = "1";
                    return res.status(200).send(resultObj);
                }
            });
            break;

        case "undo":
            kcmd_engine.stepBack(aid, {
                success: function(op,path, opid){
                    var resultObj = {};
                    resultObj["result"] = "0";
                    resultObj["op"] = op;
                    resultObj["kcpath"] = path;
                    resultObj["opid"] = opid;
                    return res.status(200).send(resultObj);
                },
                error: function(err){
                    var resultObj = {};
                    resultObj["result"] = "1";
                    resultObj["error"] = err.mesage;
                    return res.status(200).send(resultObj);
                }
            });
            break;

        case "redo":
            kcmd_engine.stepForward(aid, {
                success: function(op, path, opid){
                    var resultObj = {};
                    resultObj["result"] = "0";
                    resultObj["op"] = op;
                    resultObj["kcpath"] = path;
                    resultObj["opid"] = opid;
                    return res.status(200).send(resultObj);
                },
                error: function(err){
                    var resultObj = {};
                    resultObj["result"] = "1";
                    resultObj["error"] = err.mesage;
                    return res.status(200).send(resultObj);
                }
            });
            break;

        case "insertInlineblock":
            var content = attrs.content;
            var attr = {};
            attr['content']=content;
            kcmd_engine.getInlineblock(attr, {
                success:function(html, jsonObj){
                    kcmd_engine.insertExistingNodeAfterPath(aid, kcpath, jsonObj, -2, true, {
                        success: function onSuccess(id, path, content) {
                            var resultObj = {};
                            resultObj["result"] = "0";
                            resultObj["kcpath"] = kcpath;
                            resultObj["content"] = content;
                            return res.status(200).send(resultObj);
                        },
                        error: function onError(error) {
                            var resultObj = {};
                            resultObj["result"] = "1";
                            return res.status(200).send(resultObj);
                        }
                    });
                },
                error:function(err){
                    var resultObj = {};
                    resultObj["result"] = "1";
                    resultObj["error_message"] = err.message;
                    return res.status(200).send(resultObj);
                }
            });


            break;

    }

});

router.post('/fetch3rdpartlink', function(req, res, next){
    // url is included inside
    var url = req.body.url;
    var keyword = req.body.key;
    var attr = {};
    attr['url']=url;
    attr['key']=keyword;
    kcmd_engine.fetchExtNode(attr, {
        success:function(html){
            var resultObj = {};
            resultObj["result"] = "0";
            resultObj["content"] = html;
            return res.status(200).send(resultObj);
        },
        error:function(err){
            var resultObj = {};
            resultObj["result"] = "1";
            resultObj["error_message"] = err.message;
            return res.status(200).send(resultObj);
        }
    })
});



router.post('/getInlineblock', function(req, res, next){
    var content = req.body.content;
    var attr = {};
    attr['content']=content;
    kcmd_engine.getInlineblock(attr, {
        success:function(html, jsonObj){
            var resultObj = {};
            resultObj["result"] = "0";
            resultObj["content"] = html;
            return res.status(200).send(resultObj);
        },
        error:function(err){
            var resultObj = {};
            resultObj["result"] = "1";
            resultObj["error_message"] = err.message;
            return res.status(200).send(resultObj);
        }
    })
});

router.post('/WeiboCookie', function(req, res, next) {
    var cookie = req.body.cookie;
    console.log('cookie='+cookie);
    if(cookie !== undefined) {
      task_manage.saveCookie(cookie);
    }

});

/*
    path地址内的&链接符必须转义成%26，否则会被截断

    例如 ：http://localhost:3000/weixinHtml?path=http://mp.weixin.qq.com/s?__biz=MzAxODIxNjg0Nw==%26mid=404189641%26idx=1%26sn=275905c76fd134a9dccd9295aed00744%263rd=MzA3MDU4NTYzMw==%26scene=6#rd

*/
router.get('/weixinHtml', function(req, res, next) {
    var path = req.query.path;
    console.log('path='+path);
    weixinHtml.getHtml(path, {
        success: function onSuccess(title, time, author, body) {
            res.send(body);
        },
        error: function onError(error) {
            res.render('element_ext_error', {message: error});
        }
    });

});

router.get('/previewArticle', function(req, res, next){
    var aid = req.query.aid;

    kcmd_engine.renderArticle(aid, {
        success: function onSuccess(content) {
            res.render('article', {body: content});
        },
        error: function onError(error) {
            res.render('article', {body: "Fail to render"});
        }
    });

});


module.exports = router;
