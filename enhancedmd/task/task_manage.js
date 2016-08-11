var mysql = require('../util/mysql');
var exec = require('child_process').exec;
var later = require('later');
var util = require('../util/util');

module.exports.init = function init(cookie, callback) {
    console.log('task init');

    // TOOOOO LAG during debug - disable for now
    //循环1天1次
    //var sched = later.parse.text('every 1 days'),
	//t = later.setInterval(function() {
	//        getWeiboCookie();
	//    }, sched);

	//启动后半分钟调用一次
	// setTimeout(function() {
	// 	getWeiboCookie();
	// }, 30*1000);

    //getWeiboCookie();
    console.log("finish task");
}

module.exports.saveCookie = function saveCookie(cookie, callback) {
    insertCookie(cookie);
}

function getWeiboCookie() {

	var config = util.config();
	var postUrl = config['weiboPostUrl'];
	exec('casperjs --ssl-protocol=any --ignore-ssl-errors=true ./task/weibocookie.js '+ postUrl, function(err,stdout,stderr){
	    if(err) {
	        console.log('task init error:'+stderr);
	    } else {
	        //var data = JSON.parse(stdout);
	        //console.log(data);
	    }
	});
}

function insertCookie(cookie) {
    mysql.getConnection(function(error, conn) {
        if (error) {
            throw error;
        } else {
        	var now = new Date();
            conn.query("INSERT INTO kcmd_weibocookie SET ? ", { "cookie": cookie, 'created_at': now, 'updated_at': now }, function(err, result) {
                if (err) {
                    throw err;
                } else {
                    console.log(result);
                }
                conn.release();
            });
        }
    });
}
