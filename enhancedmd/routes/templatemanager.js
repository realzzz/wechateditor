// i guess you need all of them - pretty much huh?
var cheerio = require('cheerio')
var express = require('express')
var router = express.Router();
var commonmark = require('../lib/commonmark');
var kcmd_engine = require('../kcmarkdown/engine/engine_api')
var kcmd_engine_nodemngr = require('../kcmarkdown/engine/engine_node_manager')
var base64 = require('../kcmarkdown/common/base64')
var html2json = require('../kcmarkdown/common/html2json')
var mysql = require('../util/mysql')
var async = require('async');


router.get('/', function(req, res, next) {
  res.render('templatemngr', { title: '模板管理' });
});

router.post('/insert', function(req, res, next) {
    var html = req.body.html;
    var type = req.body.type;
    var subtype = req.body.subtype;
    console.log(html);
    html2json.convert(html,{
        success:function(jsonObj){
            var jsonStr = JSON.stringify(jsonObj);
            mysql.getConnection(function(error, conn) {
                if (error) {
                    return res.status(200).send("get mysql conntection error");
                } else {
                    // so add this to db, together with the html
                    conn.query("INSERT INTO kcmd_template SET ? ", { "content": jsonStr , "ori_html":html, "type":type, "subtype": subtype}, function(err, result) {
                        if (err) {
                            console.log("insert template error !");
                            console.log(err.message);
                            return res.sendStatus("insert template error !");
                        } else {
                            // well donw
                            console.log(result.insertId);
                            return res.sendStatus(result.insertId);
                        }
                        conn.release();
                    });
                }
            });
        },
        error:function(err){
            return res.status(200).send("error "+ err.message);
        }
    });
});

router.post('/querybytype', function(req, res, next) {
    console.log("query by type");
    var type = req.body.type;
    var subtype = req.body.subtype;

    mysql.getConnection(function(error, conn) {
        if (error) {
            return res.status(200).send("get mysql conntection error");
        } else {
            // so add this to db, together with the html
            if (subtype == undefined || subtype == "") {
                conn.query("SELECT id from kcmd_template where type = ? and subtype is NULL order by weight desc",[ type ], function(err, result) {
                    if (err) {
                        console.log("query template error !");
                        console.log(err.message);
                        return res.status(200).send("insert template error !");
                    } else {
                        // well done
                        return res.status(200).send(result);
                    }
                    conn.release();
                });
            }
            else{
                conn.query("SELECT id from kcmd_template where type = ? and subtype = ? order by weight desc",[ type, subtype ], function(err, result) {
                    if (err) {
                        console.log("query template error !");
                        console.log(err.message);
                        return res.status(200).send("insert template error !");
                    } else {
                        // well done
                        return res.status(200).send(result);
                    }
                    conn.release();
                });
            }

        }
    });
});

router.post('/querybyid', function(req, res, next) {
    console.log("query by id");
    var tid = req.body.tid;

    mysql.getConnection(function(error, conn) {
        if (error) {
            return res.status(200).send("get mysql conntection error");
        } else {
            // so add this to db, together with the html
            conn.query("SELECT * from kcmd_template where id = ? ",[ tid ], function(err, result) {
                if (err) {
                    console.log("insert template error !");
                    console.log(err.message);
                    return res.status(200).send("insert template error !");
                } else {
                    // well done
                    return res.status(200).send(result);
                }
                conn.release();
            });
        }
    });
});

router.post('/render', function(req, res, next) {
    console.log("render by id");
    var tid = req.body.tid;

    mysql.getConnection(function(error, conn) {
        if (error) {
            return res.status(200).send("get mysql conntection error");
        } else {
            // so add this to db, together with the html
            conn.query("SELECT * from kcmd_template where id = ? ",[ tid ], function(err, result) {
                if (err) {
                    console.log("insert template error !");
                    console.log(err.message);
                    return res.status(200).send("insert template error !");
                } else {
                    // well done
                    var jsonObj = JSON.parse(result[0]['content']);



                    kcmd_engine_nodemngr.render(jsonObj, {
                        success: function onSuccess(renderhtml) {
                            var resultObj = {};
                            resultObj["result"] = "0";
                            resultObj["render"] = renderhtml;
                            resultObj["html"] = result[0]['ori_html'];
                            return res.status(200).send(resultObj);
                        },
                        error: function onError(render_error) {
                            return res.status(200).send(render_error.message);
                        }
                    });
                }
                conn.release();
            });
        }
    });
});

router.post('/updatetype', function(req, res, next) {
    console.log("query by type");
    var tid = req.body.tid;
    var type = req.body.type;
    var subtype = req.body.subtype;
    var html = req.body.html;
    var weight = req.body.weight;

    if (weight === undefined || weight == "") {
        weight = 0;
    }
    else{
        weight = parseInt(weight);
    }

    if (html == "") {
        if (type != "") {
            mysql.getConnection(function(error, conn) {
                if (error) {
                    return res.status(200).send("get mysql conntection error");
                } else {
                    // so add this to db, together with the html
                    conn.query("UPDATE kcmd_template set type = ?, subtype=?, weight=? where id = ? ",[ type, subtype, weight, tid ], function(err, result) {
                        if (err) {
                            console.log("update template error !");
                            console.log(err.message);
                            return res.status(200).send("insert template error !");
                        } else {
                            // well done
                            return res.status(200).send("done");
                        }
                        conn.release();
                    });
                }
            });
        }
        else{
            mysql.getConnection(function(error, conn) {
                if (error) {
                    return res.status(200).send("get mysql conntection error");
                } else {
                    // so add this to db, together with the html
                    conn.query("UPDATE kcmd_template set weight=? where id = ? ",[ weight, tid ], function(err, result) {
                        if (err) {
                            console.log("update template error !");
                            console.log(err.message);
                            return res.status(200).send("update template error !");
                        } else {
                            // well done
                            return res.status(200).send("done");
                        }
                        conn.release();
                    });
                }
            });
        }

    }
    else{
        html2json.convert(html,{
            success:function(jsonObj){
                var jsonStr = JSON.stringify(jsonObj);
                mysql.getConnection(function(error, conn) {
                    if (error) {
                        return res.status(200).send("get mysql conntection error");
                    } else {
                        // so add this to db, together with the html
                        conn.query("UPDATE kcmd_template set content=?, ori_html=?  where id = ? ",[jsonStr, html, tid ], function(err, result) {
                            if (err) {
                                console.log("insert template error !");
                                console.log(err.message);
                                return res.status(200).send("insert template error !");
                            } else {
                                // well done
                                return res.status(200).send("done");
                            }
                            conn.release();
                        });
                    }
                });
            },
            error:function(err){
                console.log("parese html error " + err.message);
                return res.status(200).send("error "+ err.message);
            }
        });
    }

});


module.exports = router;
