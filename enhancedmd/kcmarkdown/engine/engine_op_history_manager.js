var mysql = require('../../util/mysql');
var util = require('../../util/util');
var async = require('async');


module.exports.insertOpHistory = function insertOpHistory(aid, currentopid, kcpath, op, fromContent, toContent, callback) {
    // TODO sanity check -

    async.waterfall([
        function(ac_callback){
            if (currentopid<0) {
                ac_callback(null);
            }
            else{
                mysql.getConnection(function(error, conn) {
                    if (error) {
                        ac_callback.error(error);
                    } else {
                        conn.query("DELETE FROM kcmd_op_history where articleid = ? and id > ? ",[aid, currentopid], function(err, result) {
                            if (err) {
                                ac_callback(err);
                            } else {
                                // actually we don't even need to care about this id
                                ac_callback(null);
                            }
                            conn.release();
                        });
                    }
                });
            }
        },
        // then do the insert
        function(ac_callback){
            mysql.getConnection(function(error, conn) {
                if (error) {
                    ac_callback.error(error);
                } else {
                    conn.query("INSERT INTO kcmd_op_history SET ? ", { "articleid": aid, "op":op, "kcpath":kcpath, "from":JSON.stringify(fromContent) , "to":JSON.stringify(toContent) }, function(err, result) {
                        if (err) {
                            ac_callback(err);
                        } else {
                            var rid = result.insertId;
                            ac_callback(null, rid);
                        }
                        conn.release();
                    });
                }
            });
        }

    ],
    function(err, rid){
        if (err) {
            callback.error(err);
        }
        else{
            callback.success(rid);
        }
    });
}

module.exports.clearOpHistory = function clearOpHistory(aid, callback) {
    mysql.getConnection(function(error, conn) {
        if (error) {
            callback.error(error);
        } else {
            conn.query("DELETE FROM kcmd_op_history where articleid = ? ",[aid], function(err, result) {
                if (err) {
                    callback.error(err);
                } else {
                    callback.success();
                }
                conn.release();
            });
        }
    });
}



module.exports.popLastOpHistory = function popLastOpHistory(aid, currentopid, callback){

    //async.waterfall([
    mysql.getConnection(function(error, conn) {
        if (error) {
            callback.error(error);
        } else {
            var sqlstr = "SELECT * FROM kcmd_op_history where articleid = ? order by id desc LIMIT 2";
            var paramArr = [aid];
            if (currentopid > -1) {
                sqlstr = "SELECT * FROM kcmd_op_history where articleid = ? and id <= ? order by id desc LIMIT 2";
                paramArr = [aid, currentopid]
            }
            conn.query(sqlstr,paramArr,function(err, rows, fields) {
                if (err) {
                    callback.error(err);
                } else {
                    if (rows.length == 2) {
                        callback.success(rows[0],rows[1]);
                    }
                    else if (rows.length == 1){
                        callback.success(rows[0], {"id":0});
                    }
                    else{
                        var error = new Error('no more changes');
                        callback.error(error);
                    }

                }
                conn.release();
            });
        }
    });
}

module.exports.forwardOpHistory = function forwardOpHistory(aid, currentopid, callback){

    if (currentopid < 0) {
        var err = new Error("already at latest operation");
        callback.error(err);
        return;
    }
    //async.waterfall([
    mysql.getConnection(function(error, conn) {
        if (error) {
            callback.error(error);
        } else {
            var sqlstr = "SELECT * FROM kcmd_op_history where articleid = ? and id > ? order by id asc LIMIT 1";
            var paramArr = [aid, currentopid];

            conn.query(sqlstr,paramArr,function(err, rows, fields) {
                if (err) {
                    callback.error(err);
                } else {
                    if (rows.length == 1) {
                        callback.success(rows[0]);
                    }
                    else{
                        var err = new Error("no more op for article");
                        callback.error(err)
                    }
                }
                conn.release();
            });
        }
    });
}
