var mysql = require('../../util/mysql');
var nodemngr = require('./engine_node_manager');

// NOTE IN FRONT - artical belongs to which user is NOT engine's responsibility
// NOTE the article is already a JSON Object when they are fetched out, so operate directly on them

var construct_article = module.exports.construct_article =  function constructarticle(attr, callback) {
    var article = {};
    var elements = [];

    if (attr != undefined && attr['bodyObj'] != undefined) {
        elements.push(attr['bodyObj']);
    }

    article["articleid"] = "-1";
    //article["root"] = true;
    var nodeObj = { direction: "v",
                    root:true,
                    style: {
                        "min-height":"800px",
                        "padding-top": "1px"
                    },
                    items: elements };
    nodemngr.createNode("container", nodeObj, {
        success: function onSuccess(contentObj) {
            article["kc"] = contentObj;
            callback.success(article);
        },
        error: function onError() {
            var err = new Error("create root node failure");
            callback.error(err);
        }
    });
}

module.exports.createarticle = function createarticle(attr, callback) {
    // artical needs to be saved in cache when they are first fetched
    construct_article(attr, {
        success: function onSuccess(contentObj) {
            var content = JSON.stringify(contentObj);
            mysql.getConnection(function(error, conn) {
                if (error) {
                    callback.error(error);
                } else {
                    conn.query("INSERT INTO kcmd_article SET ? ", { "content": content }, function(err, result) {
                        if (err) {
                            callback.error(err);
                        } else {
                            var id = result.insertId;
                            contentObj["articleid"] = id;
                            updatearticle(id, contentObj, {
                                success: function onSuccess(aid) {
                                    callback.success(aid, contentObj);
                                },
                                error: function onError(update_err) {
                                    console.log("update_err" + update_err.message);
                                    callback.error(update_err);
                                }
                            });
                        }
                        conn.release();
                    });
                }
            });
        },
        error: function onError() {
            var err = new Error("create article failure");
            callback.error(err)
        }
    });

}

module.exports.loadarticle = function loadarticle(articleid, callback) {
    // artical needs to be saved in cache when they are first fetched
    var content = "";
    mysql.getConnection(function(error, conn) {
        if (error) {
            callback.error(error);
        } else {
            conn.query("select * from kcmd_article where id =\'" + articleid + "\' ", function(err, rows, fields) {
                if (err) {
                    callback.error(err);
                } else {
                    if (rows[0] == undefined) {
                        var notexisterr = new Error("artical doesn't exist");
                        callback.error(notexisterr);
                    }
                    else{
                        content = rows[0]['content'];
                        var contentObj = {};
                        try {
                            contentObj = JSON.parse(content);
                        } catch (e) {
                            console.error(e);
                        }
                        callback.success(contentObj);
                    }
                }
                conn.release();
            });
        }
    });
}

var updatearticle = module.exports.updatearticle = function updatearticle(articleid, contentObj, callback) {
    // artical needs to be saved in cache before saving to db
    var content = JSON.stringify(contentObj);
    mysql.getConnection(function(error, conn) {
        if (error) {
            callback.error(error);
        } else {
            conn.query("update kcmd_article SET content = ?  where id =\'" + articleid + "\' ", [content], function(err, result) {
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

module.exports.deletearticle = function deletearticle(articleid, callback) {
    // artical needs to be delete from cache before delete from db
    console.log(callback);
    var content = "";
    mysql.getConnection(function(error, conn) {
        if (error) {
            callback.error(error);
        } else {
            conn.query("DELETE from kcmd_article where id =\'" + articleid + "\' ", function(err, result) {
                console.log(err);
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
