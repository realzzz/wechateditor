
var x = require('casper').selectXPath;
var fs = require('fs')
var debug =false;
/*
    casperjs --ssl-protocol=any --ignore-ssl-errors=true weibocookie.js

*/

var casper = require('casper').create({
    pageSettings: {
        loadImages:  false,        // The WebPage instance used by Casper will
        loadPlugins: false         // use these settings
    },
    logLevel: "info",              // Only "info" level messages will be logged
    verbose: true,
	Connection: 'keep-alive',
	CacheControl: 'max-age=0',
	Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,\*/\*;q=0.8',
	UserAgent: 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 BIDUBrowser/8.0 Safari/537.36',
	AcceptEncoding: 'gzip, deflate',
	AcceptLanguage: 'zh-CN,zh;q=0.8'

});



casper.start('http://weibo.com/', function(response) {

  //   this.wait(5000, function(){
  //      this.capture('step1_start.png');
		// this.echo("wait ");
  //   });

    this.waitForSelector('.W_login_form', (function() {
        if(debug) {
    	   this.capture('step1_start.png');
        }
		this.echo("wait ");
    }), (function() {
    	this.die("Timeout reached. Fail whale?");
    	this.exit();
    }), 12000);

    this.echo("open mp ");
});

casper.thenClick('a[node-type=normal_tab]', function(){
	this.echo("button");
	this.wait(1000, function() {
        if(debug) {
            this.capture('step1_start2.png');
        }
    });
});


casper.then(function(){
	this.echo("fill");
    // TODO - set your weibo acc here
	this.fillXPath('div.W_login_form', {
	        '//input[@name="username"]':    'wbun',
	        '//input[@name="password"]':    'wbpwd',
	    }, false);
});

casper.thenClick('a.W_btn_a', function(){
    this.wait(5000, function() {
        if(debug) {
    	   this.capture('step1_start1.png');
        }
        this.echo("login");
        //this.capture('step2_afterlogin.png');
    });
});

var cookie='';
casper.then(function(){
	var cookies = JSON.stringify(phantom.cookies);
	// this.echo(cookies);
	// fs.write("cookie.txt", cookies, 664);

    var json = JSON.parse(cookies)
    if(debug) {
        console.log(json);
    }

    for (var site in json) {

        if(json[site]['domain'].indexOf('weibo')) {
            cookie += json[site]['name']+'='+json[site]['value']+';';
        }
    };

});

casper.then(function(){

    var postUrl = casper.cli.get(0);
    this.echo('postUrl = '+postUrl);

    casper.open(postUrl, {
        method: 'post',
        data:{
            'cookie': cookie
        }
    });
});

casper.run(function() {


    this.echo('end');

    this.exit();
});
