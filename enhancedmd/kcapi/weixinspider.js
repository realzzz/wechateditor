var cheerio = require('cheerio');
var request = require('request');
var zlib = require('zlib');
var qiniu = require("qiniu");
var util = require('../util/util');
var config = util.config();
var promise = require('promise');


//需要填写你的 Access Key 和 Secret Key
qiniu.conf.ACCESS_KEY = config.qiniuaccesskey;
qiniu.conf.SECRET_KEY = config.qiniuaccesssecret;

var bucket = config.qiniubucket;
var url = config.qiniuurl;

var weixin = 'weixin';
var toutiao = 'toutiao';

var urls = {
    'http://mp.weixin.qq.com/': weixin,
    'http://toutiao.com/':toutiao
};


module.exports.getHtml = function(url, callback) {
	console.log("weixinsprider url = " + url);
	var cheerio = require('cheerio');
	var options = {
	    url: url,
	    headers: {
	        'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 BIDUBrowser/8.0 Safari/537.36',
	        'Accept-Language':'zh-CN,zh;q=0.8',
	        'Accept-Encoding':'gzip',
	        'X-Requested-With': 'XMLHttpRequest',
	        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
	        'Connection':'keep-alive',
	        'Cache-Control':'max-age=0'
	    }
	};

	requestWithEncoding(options, function(err, data) {
	    if (err) {
	        // console.log(err);
	        callback.error(err);
	    } else {
			var webType = checkWebType(url);

		    if (webType === weixin) {
				weixinHandler(data, callback);
			} else if(webType === toutiao) {
				toutiaoHandler(data, callback);
			} else {
				callback.error(Error('url type is not support'));
			}
	    }
	})
}


function toutiaoHandler(data, callback) {
	$ = cheerio.load(data);
	var temp = $('#pagelet-article').html();
	if(temp === null || temp === undefined) {
		callback.error(Error('sprider is fail'));
		return ;
	}
	$ = cheerio.load(temp);
	var title = $('div.article-header > h1.title').text();
    title = title.trim();
	console.log('title='+title);
	var time = $('div.article-header > div > span').text();
	console.log('time='+time);
	var author = '头条';
	var body = $('div.article-content').html();

	// $ = cheerio.load(body);
	// var uploads = [];
	// $('img').each(function(i, elem) {
	// 	var upload = updloadImage(elem);
	// 	uploads.push(upload);
	// });
 	callback.success(title, time, author, body);
// 	Promise.all(uploads)
// 	  .then(function (res) {
// 		  console.log(res);
// 		  callback.success(title, time, author, $.html());
// 	});
}

function weixinHandler(data, callback) {
	$ = cheerio.load(data);
	var temp = $('#img-content').html();
	if(temp === null || temp === undefined) {
		callback.error(Error('sprider is fail'));
		return ;
	}
	$ = cheerio.load(temp);
	var title = $('#activity-name').text();
    title = title.trim();
	var time = $('#post-date').text();
	var author = $('#post-user').text();
	var body = $('#js_content').html();

	$ = cheerio.load(body);
	var uploads = [];
	$('img').each(function(i, elem) {
		var upload = updloadImage(elem);
		uploads.push(upload);
	});

	Promise.all(uploads)
	  .then(function (res) {
		  console.log(res);
		  callback.success(title, time, author, $.html());
	});
}


function updloadImage(elem) {
	return new Promise(function(resolve, reject) {

		var img = $(elem).attr("src");
		if(img === undefined) {
			console.log($(elem).attr("data-src"));
			$(elem).attr('src', $(elem).attr("data-src"));
		}
		img = $(elem).attr("src");
		//updload
		console.log("updloadImage img=" + img);

		var stream = request(img);
		var key =  util.guild();
		var token = uptoken(bucket, key);
		var extra = new qiniu.io.PutExtra();
		qiniu.io.putReadable(token, key, stream, extra, function (err, ret) {
			if(!err) {
				// 上传成功， 处理返回值
				// console.log(ret.hash, ret.key, ret.persistentId);
				var newImg = url + '/'+ret.key;
				console.log('updloadImage  newImg='+newImg);
				$(elem).attr("src", newImg);
				$(elem).removeAttr("data-src");
				resolve(true);
			} else {
				// 上传失败， 处理返回代码
				resolve(false);
			}
		});
  	});
}

function checkWebType(targetUrl) {
    for (var url in urls) {
        if (targetUrl.startWith(url)) {
            return urls[url];
        }
    };
    return null;
}

function uptoken(bucket, key) {
  var putPolicy = new qiniu.rs.PutPolicy(bucket+":"+key);
  return putPolicy.token();
}

var requestWithEncoding = function(options, callback) {
  var req = request.get(options);

  req.on('response', function(res) {
    var chunks = [];
    res.on('data', function(chunk) {
      chunks.push(chunk);
    });

    res.on('end', function() {
      var buffer = Buffer.concat(chunks);
      var encoding = res.headers['content-encoding'];
      if (encoding == 'gzip') {
        zlib.gunzip(buffer, function(err, decoded) {
          callback(err, decoded && decoded.toString());
        });
      } else if (encoding == 'deflate') {
        zlib.inflate(buffer, function(err, decoded) {
          callback(err, decoded && decoded.toString());
        })
      } else {
        callback(null, buffer.toString());
      }
    });
  });

}
