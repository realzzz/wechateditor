var async = require('async');
var nodemngr = require('../kcmarkdown/engine/engine_node_manager');
var kcmd_engine = require('../kcmarkdown/engine/engine_api');
var mysql = require('../util/mysql');
var util = require('../util/util');
var html2json = require('../kcmarkdown/common/html2json');
var wxspider = require('./weixinspider');

// Program MARK -- user article related APIs
module.exports.getUserArticles = function getUserArticles(userid, pageid, pagecount, callback){
    if (util.isEmptyStr(userid)) {
        var err = new Error("input parameter missing");
        callback.error(err);
        return;
    }

    if (userid == '1'){
        callback.success([]);
        return;
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

    mysql.getConnection(function(error, conn) {
        if (error) {
            callback.error(error);
        } else {
            conn.query("select id, title, description, img, updated from kcmd_article where userid = ? order by updated desc LIMIT ?,? ", [userid , pageid*pagecount, pagecount], function(err, result) {
                if (err) {
                    callback.error(err);
                } else {
                    callback.success(result);
                }
                conn.release();
            });
        }
    });

}

module.exports.createUserArticle = function createUserArticle(userid, callback){
    if (util.isEmptyStr(userid)) {
        var err = new Error("input parameter missing");
        callback.error(err);
        return;
    }

    kcmd_engine.createArticle({},{
        success: function onSuccess(content, articleid) {
            mysql.getConnection(function(error, conn) {
                if (error) {
                    callback.error(error);
                } else {
                    conn.query("update kcmd_article SET userid = ?  where id =\'" + articleid + "\' ", [userid], function(err, result) {
                        if (err) {
                            callback.error(err);
                        } else {
                            callback.success(articleid,content);
                        }
                        conn.release();
                    });
                }
            });
        },
        error: function onError(error) {
            callback(error);
        }
    });
}

module.exports.getUserArticleInfo = function getUserArticleInfo(userid, articleid, callback){
    if (util.isEmptyStr(userid) || util.isEmptyStr(articleid)) {
        var err = new Error("input parameter missing");
        callback.error(err);
        return;
    }

    mysql.getConnection(function(error, conn) {
        if (error) {
            callback.error(error);
        } else {
            conn.query("select id, title, description, img from kcmd_article where userid = ? and id = ?", [userid , articleid], function(err, result) {
                if (err) {
                    callback.error(err);
                } else {
                    callback.success(result);
                }
                conn.release();
            });
        }
    });

}

module.exports.updateUserArticleTitleImg = function updateUserArticleTitleImg(userid, articleid, title, desc, img, callback){
    if (util.isEmptyStr(userid) || util.isEmptyStr(articleid)) {
        var err = new Error("input parameter missing");
        callback.error(err);
        return;
    }

    var updateStr = "";
    var updateArr = [];

    if (!util.isEmptyStr(title)) {
        updateStr += " title = ? ";
        updateArr.push(title);
    }

    if (!util.isEmptyStr(desc)) {
        if (updateStr != "") {
            updateStr += ", "
        }
        updateStr += " description = ? ";
        updateArr.push(desc);
    }

    if (!util.isEmptyStr(img)) {
        if (updateStr != "") {
            updateStr += ", "
        }
        updateStr += " img = ? ";
        updateArr.push(img);
    }

    updateArr.push(articleid);
    updateArr.push(userid);

    console.log(updateStr);

    mysql.getConnection(function(error, conn) {
        if (error) {
            callback.error(error);
        } else {
            conn.query("update kcmd_article SET "+ updateStr +" where id = ? and userid = ? ", updateArr, function(err, result) {
                if (err) {
                    callback.error(err);
                } else {
                    callback.success(articleid);
                }
                conn.release();
            });
        }
    });
}


// for success callback - callback.success(html, articleid);
module.exports.createArticleViaWxArt = function createArticleViaWxArt(uid, url, callback){
    async.waterfall([
        // first is fetch from wx
        function(ac_callback) {
            wxspider.getHtml(url, {
                success: function(title, time, author, htmlcontent){
                    if (util.isEmptyStr(title)) {
                        title = "";
                    }
                    ac_callback(null, title, htmlcontent);
                },
                error: function(err){
                    ac_callback(err);
                }
            })
        },
        // convert to json object:
        function(title, html, ac_callback){
            html2json.convert(html, {
                success: function(bodyJsonObj){
                    ac_callback(null, title, bodyJsonObj);
                },
                error: function(err){
                    ac_callback(err);
                }
            })
        },
        // create article through upon info
        function(title, bodyJsonObject, ac_callback){

            kcmd_engine.createArticle({bodyObj:bodyJsonObject},{
                success: function onSuccess(content, articleid) {
                    mysql.getConnection(function(error, conn) {
                        if (error) {
                            ac_callback(null,title, articleid);
                        } else {
                            conn.query("update kcmd_article SET userid = ?,title = ?  where id =\'" + articleid + "\' ", [uid, title], function(err, result) {
                                if (err) {
                                    ac_callback(null, title, articleid);
                                } else {
                                    ac_callback(null,title, articleid);
                                }
                                conn.release();
                            });
                        }
                    });
                },
                error: function onError(error) {
                    ac_callback(error);
                }
            });
        },
        // render and fall back
        function(title, articleid ,ac_callback){

            kcmd_engine.renderArticle(articleid, {
                success: function(artHtml){
                    ac_callback(null,title, articleid, artHtml);
                },
                error: function(err){
                    ac_callback(err);
                }
            });
        }
    ],
    function(error, title, aid, html){
        if (error == null) {
            callback.success(title, aid, html);
        }
        else{
            callback.error(error);
        }
    });
}




// TODO TODO TODO  for delete - need to mark as archive instead of real deleteion
module.exports.deleteUserArticle = function deleteUserArticle(userid, articleid, callback){
    if (util.isEmptyStr(userid) || util.isEmptyStr(articleid)) {
        var err = new Error("input parameter missing");
        callback.error(err);
        return;
    }
    mysql.getConnection(function(error, conn) {
        if (error) {
            callback.error(error);
        } else {
            conn.query("DELETE from kcmd_article where id = ? and userid = ? ", [articleid, userid], function(err, result) {
                if (err) {
                    callback.error(err);
                } else {
                    callback.success(err);
                }
                conn.release();
            });
        }
    });
}


// Program MARK -- user collection related APIs
// only get list of collection ids and pagable
module.exports.getUserCollection = function getUserCollection(userid, type, pageid, pagecount, callback) {

    if (util.isEmptyStr(userid) || util.isEmptyStr(type)) {
        var err = new Error("input parameter missing");
        callback.error(err);
        return;
    }

    // TODO - probabaly make it configureable?
    // ALSO - We shall never let page count getting too big, it impacts efficiency a lot
    if (util.isEmptyStr(pageid)) {
        pageid = 0;
        pagecount = 10;
    }
    else{
        if (pagecount>10) {
            pagecount = 10;
        }
    }

    async.waterfall([
        function(ac_callback){
            mysql.getConnection(function(error, conn) {
                if (error) {
                    callback.error(error);
                } else {
                    conn.query("select * from kcmd_user_collection where userid = ? and type = ? order by updated desc LIMIT ?,?", [userid, type, pageid*pagecount, pagecount], function(err, result) {
                        if (err) {
                            ac_callback(err);
                        } else {
                            ac_callback(null, result);
                        }
                        conn.release();
                    });
                }
            });
        },
        function(results, ac_callback){
            if (results == undefined || results.length == 0) {
                ac_callback(results);
            }
            else{
                async.forEachOf(results, function (v, key, cb) {
                    var targetid = v['targetid'];
                    var table = "kcmd_template";
                    if (type == 'inlineblock') table = 'kcmd_inlineblock';
                    var querystr = "select * from " + table + " where id=? ";

                    mysql.getConnection(function(error, conn) {
                        if (error) {
                            cb();
                        } else {
                            conn.query(querystr, [targetid], function(err, result) {
                                if (err) {
                                    cb();
                                } else {
                                    if (result.length == 1) {
                                        v['html']=result[0]['ori_html'];
                                    }
                                    cb();
                                }
                                conn.release();
                            });
                        }
                    });
                },function (err) {
                    if (err) console.error(err.message);
                    ac_callback(null, results);
                });
            }
        }
    ],
    function(err, collections){
        if (err) {
            callback.error(err);
        }
        else{
            callback.success(collections);
        }
    });

}


// type template if templateid exists, inlineblock if ori_html exists
module.exports.addUserCollection = function addUserCollection(userid, templateid, ori_html, callback) {
    if (util.isEmptyStr(userid) || (util.isEmptyStr(templateid) && util.isEmptyStr(ori_html) )) {
        var err = new Error("input parameter missing");
        callback.error(err);
        return;
    }
    //
    var type = "template";
    if (!util.isEmptyStr(ori_html)) {
        type = "inlineblock";
    }

    async.waterfall([
        function(ac_callback){
            // first check if this is inline block that needs to convert and store the html
            if (type == "template") {
                ac_callback(null, templateid);
            }
            else{
                html2json.convert(ori_html,{
                    success:function(jsonObj){
                        var jsonStr = JSON.stringify(jsonObj);

                        mysql.getConnection(function(error, conn) {
                            if (error) {
                                ac_callback(error);
                            } else {
                                // so add this to db, together with the html
                                conn.query("INSERT INTO kcmd_inlineblock SET ? ", {
                                    "content": jsonStr,
                                    "ori_html": ori_html,
                                    "userid": userid
                                }, function(err, result) {
                                    if (err) {
                                        ac_callback(err);
                                    } else {
                                        ac_callback(null, result.insertId);
                                    }
                                    conn.release();
                                });
                            }
                        });
                    },
                    error: function(err){
                        ac_callback(err);
                    }
                })
            }
        },
        // check for duplication
        function(cid, ac_callback){
            mysql.getConnection(function(error, conn) {
                if (error) {
                    ac_callback(error);
                } else {
                    // so add this to db, together with the html
                    conn.query("select * from  kcmd_user_collection where targetid = ? and userid = ? and type = ? ",
                    [cid, userid, type]
                    , function(err, result) {
                        if (err) {
                            ac_callback(null, cid);
                        } else {
                            if (result.length > 0) {
                                var err = new Error("collection already exists");
                                ac_callback(err, null);
                            }
                            else{
                                ac_callback(null, cid);
                            }
                        }
                        conn.release();
                    });
                }
            });
        },
        function(cid, ac_callback){
            mysql.getConnection(function(error, conn) {
                if (error) {
                    ac_callback(error);
                } else {
                    // so add this to db, together with the html
                    conn.query("INSERT INTO kcmd_user_collection SET ? ", {
                        "userid": userid,
                        "targetid": cid,
                        "type": type
                    }, function(err, result) {
                        if (err) {
                            ac_callback(err);
                        } else {
                            ac_callback(null, result.insertId);
                        }
                        conn.release();
                    });
                }
            });
        }
    ],
    function(err, sid){
        if (err) {
            callback.error(err);
        }
        else{
            callback.success(sid);
        }
    });
}

// delete record of type is template, delete inlineblock line + record of inlinelbock
module.exports.deleteUserCollection = function deleteUserCollection(userid, cid, callback) {
    if (util.isEmptyStr(cid) || util.isEmptyStr(userid)) {
        var err = new Error("input parameter missing");
        callback.error(err);
        return;
    }

    mysql.getConnection(function(error, conn) {
        if (error) {
            callback.error(error);
        } else {
            conn.query("DELETE from kcmd_user_collection where id = ? and userid = ? ", [cid, userid], function(err, result) {
                if (err) {
                    callback.error(err);
                } else {
                    callback.success(result);
                }
                conn.release();
            });
        }
    });

    // todo also delete the inlinelbock inside the table
}

// Program MARK -- user library related APIs
module.exports.getUserLibrary = function getUserLibrary(userid,pageid,pagecount, callback) {
    if (util.isEmptyStr(userid)) {
        var err = new Error("input parameter missing");
        callback.error(err);
        return;
    }

    // TODO - probabaly make it configureable?
    if (util.isEmptyStr(pageid)) {
        pageid = 0;
        pagecount = 40;
    }

    mysql.getConnection(function(error, conn) {
        if (error) {
            callback.error(error);
        } else {
            conn.query("select * from kcmd_user_library where userid = ?  LIMIT ?,?", [userid, pageid*pagecount, pagecount], function(err, result) {
                if (err) {
                    callback.error(err);
                } else {

                    callback.success(result);
                }
                conn.release();
            });
        }
    });
}

module.exports.addUserLibrary = function addUserLibrary(userid, url, callback) {
    if (util.isEmptyStr(userid) || util.isEmptyStr(url)) {
        var err = new Error("input parameter missing");
        callback.error(err);
        return;
    }

    mysql.getConnection(function(error, conn) {
        if (error) {
            callback.error(error);
        } else {
            // so add this to db, together with the html
            console.log("insert userid" + userid);
            conn.query("INSERT INTO kcmd_user_library SET ? ", {
                "userid": userid,
                "url": url,
            }, function(err, result) {
                if (err) {
                    callback.error(err);
                } else {
                    callback.success(result.insertId);
                }
                conn.release();
            });
        }
    });
}

module.exports.deleteUserLibrary = function deleteUserLibrary(userid, lid, callback) {
    if (util.isEmptyStr(lid)) {
        var err = new Error("input parameter missing");
        callback.error(err);
        return;
    }

    mysql.getConnection(function(error, conn) {
        if (error) {
            callback.error(error);
        } else {
            conn.query("DELETE from kcmd_user_library where id= ? and userid = ?", [lid, userid], function(err, result) {
                if (err) {
                    callback.error(err);
                } else {
                    callback.success(result);
                }
                conn.release();
            });
        }
    });
}

module.exports.updateAritcleUserInfo = function updateAritcleUserInfo(userid, articleid, callback){
    if (util.isEmptyStr(userid) || util.isEmptyStr(articleid)) {
        var err = new Error("input parameter missing");
        callback.error(err);
        return;
    }

    mysql.getConnection(function(error, conn) {
        if (error) {
            callback.error(error);
        } else {
            conn.query("update kcmd_article SET userid = ?  where id =\'" + articleid + "\' ", [userid], function(err, result) {
                if (err) {
                    callback.error(err);
                } else {
                    callback.success(articleid);
                }
                conn.release();
            });
        }
    });
}
