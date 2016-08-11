var mysql = require('mysql');
var util = require('./util');


var config = util.config();
var pool  = mysql.createPool({
    host     :  config.mysqlhost,
    port     :  config.mysqlport,
    user     :  config.mysqluser,
    password :  config.mysqlpwd,
    database :  config.mysqldb,
    connectionLimit : 1000,
    waitForConnections: false
});

var getConnection = exports.getConnection  = function(callback) {
    pool.getConnection(function(err, connection) {
        callback(err, connection);
    });
};
