var express = require('express');
var router = express.Router();
var util = require('../util/util');
var mysql = require('../util/mysql');


// TODO TODO move api operation to kcapi folder
router.post('/getTemplateByType', function(req, res, next) {
    var type = req.body.type;
    var subtype = req.body.subtype;
    var pageid = req.body.pageid;
    var pagecount = req.body.pagecount;
    var queryAll = false;
    var querysubtypeAll=false;

    if (util.isEmptyStr(type) ) {
        queryAll = true;
    }else if (util.isEmptyStr(subtype) ){
        querysubtypeAll = true;
    }

    if (util.isEmptyStr(pageid)) {
        pageid = 0;
        pagecount = 10;
    }
    else{
        if (pagecount>10) {
            pagecount = 10;
        }
    }

    // TODO TODO TODO - need to add cache here!
    mysql.getConnection(function(error, conn) {
        if (error) {
            callback.error(error);
        } else {
            if (queryAll) {
                conn.query("select id, ori_html, type, subtype from kcmd_template where archive = 0 order by weight desc LIMIT ?,?", [pageid*pagecount, pagecount], function(err, result) {
                    if (err) {
                        var resultObj = {};
                        resultObj["result"] = "1";
                        resultObj["error"] = err.message;
                        return res.status(200).send(resultObj);
                    } else {
                        var resultObj = {};
                        resultObj["result"] = "0";
                        resultObj["objs"] = result;
                        return res.status(200).send(resultObj);
                    }
                    conn.release();
                });
            }
            else if(querysubtypeAll){
                conn.query("select id, ori_html, type, subtype from kcmd_template where type = ? and archive = 0 order by weight desc LIMIT ?,?", [type, pageid*pagecount, pagecount], function(err, result) {
                    if (err) {
                        var resultObj = {};
                        resultObj["result"] = "1";
                        resultObj["error"] = err.message;
                        return res.status(200).send(resultObj);
                    } else {
                        var resultObj = {};
                        resultObj["result"] = "0";
                        resultObj["objs"] = result;
                        return res.status(200).send(resultObj);
                    }
                    conn.release();
                });
            }else{
                conn.query("select id, ori_html, type, subtype from kcmd_template where type = ? and subtype = ? and archive = 0 order by weight desc LIMIT ?,?", [type, subtype , pageid*pagecount, pagecount], function(err, result) {
                    if (err) {
                        var resultObj = {};
                        resultObj["result"] = "1";
                        resultObj["error"] = err.message;
                        return res.status(200).send(resultObj);
                    } else {
                        var resultObj = {};
                        resultObj["result"] = "0";
                        resultObj["objs"] = result;
                        return res.status(200).send(resultObj);
                    }
                    conn.release();
                });

            }

        }
    });
});


module.exports = router;
