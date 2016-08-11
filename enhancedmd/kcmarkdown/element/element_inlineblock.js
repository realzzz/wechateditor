var base64 = require('../common/base64');
var mysql = require('../../util/mysql');
var cheerio = require('cheerio');
var html2json = require('../common/html2json');
// NOTE EACH ELEMENT REQUIRES TO HAVE FOLLOWING things
// all supported attributes
// 1 - create
// 2 - update
// 3 - render


module.exports.create = function create(attrs, callback) {
    var ibObj = { "kctype": "inline" };
    if (attrs == undefined) {
        var err = new Error("create inlineblock parameter error");
        callback.error(err);
        return;
    }

    if (attrs["content"] != undefined) {
        // first try to convert it to json
        html2json.convert(attrs["content"],{
            success: function(jsonObj){
                callback.success(jsonObj);
                /*
                var jsonstr = JSON.stringify(jsonObj);

                mysql.getConnection(function(error, conn) {
                    if (error) {
                        callback.error(error);
                    } else {
                        conn.query("INSERT INTO kcmd_inlineblock SET ? ", { "content": jsonstr, "ori_html":  attrs["content"]}, function(err, result) {
                            if (err) {
                                callback.error(err);
                            } else {
                                var bid = result.insertId;
                                jsonObj["bid"] = bid;
                                callback.success(jsonObj);
                            }
                            conn.release();
                        });
                    }
                });
                */
            },
            error: function(err){
                callback.error(err);
            }
        })
        // create via content
        // do base64 encode & save
        // var base64EncodedContent = base64.encode(attrs["content"]);
        // mysql.getConnection(function(error, conn) {
        //     if (error) {
        //         callback.error(error);
        //     } else {
        //         conn.query("INSERT INTO kcmd_inlineblock SET ? ", { "content": base64EncodedContent }, function(err, result) {
        //             if (err) {
        //                 callback.error(err);
        //             } else {
        //                 var bid = result.insertId;
        //                 ibObj["bid"] = bid;
        //                 callback.success(ibObj);
        //             }
        //         });
        //         conn.release();
        //     }
        // });
    } else if (attrs["bid"] != undefined) {
        // create via existing inline block
        // ibObj["bid"] = attrs["bid"];
        // callback.success(ibObj);

        mysql.getConnection(function(error, conn) {
            if (error) {
                callback.error(error);
            } else {
                conn.query("select * from kcmd_inlineblock where id =\'" + attrs["bid"] + "\' ", function(err, rows, fields) {
                    if (err) {
                        callback.error(err);
                    } else {
                        if (rows[0] == undefined) {
                            var notexisterr = new Error('inline block doesn not exist');
                            callback.error(notexisterr);
                        }
                        else{
                            var content = rows[0]['content'];
                            var jsonObj = JSON.parse(content);
                            callback.success(jsonObj);
                        }
                    }
                    conn.release();
                });
            }
        });

    }

}


// IMPORTANT --  this is not supposed to be invoked
module.exports.update = function update(node, attrs, callback) {
    // artical needs to be saved in cache before saving to db
    if (node == undefined || node["bid"] == undefined) {
        var err = new Error("create inlineblock node parameter error");
        callback.error(err);
        return;
    }

    if (attrs == undefined || attrs["content"] == undefined) {
        var err = new Error("create inlineblock attr parameter error");
        callback.error(err);
        return;
    }

    var base64EncodedContent = base64.encode(attrs["content"]);
    mysql.getConnection(function(error, conn) {
        if (error) {
            callback.error(error);
        } else {
            conn.query("update kcmd_inlineblock SET content = ?  where id =\'" + node["bid"] + "\' ", [base64EncodedContent], function(err, result) {
                if (err) {
                    callback.error(err);
                } else {
                    callback.success(node["bid"]);
                }
                conn.release();
            });
        }
    });
}

// IMPORTANT --  this is not supposed to be invoked
module.exports.render = function render(node, callback) {
    if (node == undefined || node["bid"] == undefined) {
        var err = new Error("create inlineblock node parameter error");
        callback.error(err);
        return;
    }

    // artical needs to be saved in cache when they are first fetched
    var content = "";
    mysql.getConnection(function(error, conn) {
        if (error) {
            callback.error(error);
        } else {
            conn.query("select * from kcmd_inlineblock where id =\'" + node["bid"] + "\' ", function(err, rows, fields) {
                if (err) {
                    callback.error(err);
                } else {
                    if (rows[0]== undefined) {
                        var notexisterr = new Error('inline block does not exist');
                        callback.error(notexisterr);
                    }
                    else{
                        contentBase64 = rows[0]['content'];
                        var contentHtml = base64.decode(contentBase64);
                        $ = cheerio.load("<section kctype='inline'> </section>");
                        if(node["id"] != undefined){
                            $('section').attr('id', node["id"]);
                        }
                        $('section').attr('bid', node["bid"]);
                        $('section').append(contentHtml);
                        callback.success($.html());
                    }
                }
                conn.release();
            });
        }
    });

}
