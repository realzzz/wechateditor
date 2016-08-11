var zlib = require('zlib');
var async = require('async');
var request = require('request');
var fs = require('fs');
var bindexOf = require('buffer-indexof');
var mysql = require('../../util/mysql');
var cheerio = require('cheerio');
var jsonic = require('jsonic');
var iconv = require('iconv-lite');

var enum_type = require('./element_ext_item').enum_type;

var tmall = enum_type.tmall;
var taobao = enum_type.taobao;
var weibo = enum_type.weibo;
var weidian = enum_type.weidian;
var shopex = enum_type.shapex;


var debug = true;

module.exports.getWeibo = function(url, callback) {
	console.log('url='+url);
 	async.waterfall([function(ac_callback) {//get cookie
 			findCookie({
                success: function onSuccess(cookie) {
                	if(cookie !== null) {
                    	ac_callback(null, cookie);
                	} else {
                		ac_callback(Error('not cookie'));
                	}
                },
                error: function onError(error) {
                    ac_callback(error);
                }
            });
 		}, function(cookie,ac_callback){
			var options = {
			    url: url,
			    headers: {
			        'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 BIDUBrowser/8.0 Safari/537.36',
			        'cookie': cookie,
			        'Accept-Language':'zh-CN,zh;q=0.8',
			        'Accept-Encoding':'gzip, deflate',
			        'X-Requested-With': 'XMLHttpRequest',
			        'Accept': 'zh-CN,zh;q=0.8',
			        'Connection':'keep-alive',
			        'Cache-Control':'max-age=0'
			    }
			};
			ac_callback(null, options);
        }, function(options, ac_callback){//get html
			requestWithEncoding(options, function(err, data) {
			    if (err) {
			        // console.log(err);
			        ac_callback(err, null);
			    } else {
			        // console.log(data);
			        // fs.writeFile('D://json.txt', data, function(err) {
					      //       if(err) throw err;
					      //       console.log('it is save');
					      //   });

				    var startBuffer = new Buffer('<script>FM.view({"ns":"pl.content.homeFeed.index","domid":"Pl_Official_MyProfileFeed');
				    var endBuffer = new Buffer("\n");

					var i = bindexOf(data, startBuffer, 0);
					if(i == -1) {
						ac_callback(null, null);
						return ;
					}
				    var j = bindexOf(data, endBuffer, i);
				    if (j == -1) {
				    	ac_callback(null, null);
				    	return ;
				    }
				    // console.log("i="+i+",  j"+j);
				    var line = data.toString("utf-8", i, j);
				    if(line.length === 0) {
				    	ac_callback(null, null);
				    }
				    line = line.replace(/<script>FM.view\(/g, '');
					line = line.replace(/\)<\/script>/g, '');
					// console.log(line);
					// fs.writeFile('D://json1.txt', line, function(err) {
				 //            if(err) throw err;
				 //            console.log('it is save');
					// });
					var json = JSON.parse(line);
					var html = json['html'];
					ac_callback(null, html);
		    	}
			});

        },

    ],
    function(error, html){
        if (error != undefined) {
            callback.error(error);
        }
        else{
            callback.success(html);
        }
    });

}

function getShopex(url, callback) {
	console.log('url='+url);
 	async.waterfall([function(ac_callback){
			var options = {
			    url: url,
			    headers: {
					'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; rv:11.0) like Gecko',
			        'Accept-Language':'zh-CN',
			        'Accept-Encoding':'gzip, deflate',
			        'X-Requested-With': 'XMLHttpRequest',
			        'Accept': 'text/html, application/xhtml+xml, */*',
			        'Connection':'keep-alive',
			        'Cache-Control':'max-age=0'
			    }
			};
			ac_callback(null, options);
        }, function(options, ac_callback){//get html
			requestWithEncoding(options, function(err, data) {
			    if (err) {
			        // console.log(err);
			        ac_callback(err, null);
			    } else {
					$ = cheerio.load(data);
					var imgs = $('div.c-pic img').attr('src');

					var temp = $('.special').html();
					$ = cheerio.load(temp);

					var title = $('#detail_title').text();
					var price = $('#detail_nh_price').text();
					var price_del = $('.g-price del').text();
					var sells = $('.goods-statistics div').eq(0).text();
					var presells = $('.goods-statistics div').eq(1).text();

					var object = {
			            'type': 'weidian',
			            'title': title,
			            'price': price,
						'price_del': price_del,
						'sells' : sells,
						'presells': presells,
			            'imgs': imgs
			        };
					console.log('shapex = '+object);
					ac_callback(null, object);
		    	}
			});

        },

    ],
    function(error, html){
        if (error != undefined) {
            callback.error(error);
        }
        else{
            callback.success(html);
        }
    });

}

module.exports.getRequestOjbect = function(url, webType, callback) {
	if (webType === tmall) {
		getTmao(url, callback);
	} else if (webType === taobao) {
		getTaobao(url, callback);
	} else if (webType === weibo) {
	} else if(webType === weidian) {
	} else if(webType === shopex) {
		getShopex(url, callback);
	} else {
		callback.error(Error(webType + 'is not valid type.'));
	}

}

function getTaobao(url, callback) {
	console.log('url='+url);

	var options = {
	    url: url,
	    headers: {
	        'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 BIDUBrowser/8.0 Safari/537.36',
	        'Accept-Language':'zh-CN,zh;q=0.8',
	        'Accept-Encoding':'gzip',
	        'X-Requested-With': 'XMLHttpRequest',
	        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
	        'Connection':'keep-alive',
	        'Cache-Control':'max-age=0',
	        'referer' : url
	    }
	};

 	async.waterfall([function(ac_callback) {
			requestWithEncoding(options, function(err, data) {
				if (err) {
					ac_callback(err, null);
				} else {
			        var temp = iconv.decode(data, 'gbk');
			        $ = cheerio.load(temp, {decodeEntities: false});

			        var title = $('#J_Title > h3').html().trim();
			        var des = $('#J_Title > p').html().trim();
			        var price = $('#J_StrPrice .tb-rmb-num').text();

					var imgs = [];
					$('#J_UlThumb > li > div > a > img').each(function(i, elem) {
						var img = $(elem).attr("data-src");
						if (img.indexOf('https:') === -1) {
							img = 'https:' + img;
						}
						imgs[i] = img;
					});

			        var reviewBody = findStr(temp, "Hub.config.set('sku', ", ");");
			        var apiinfoTemp = findStr(reviewBody, "apiItemInfo", "',", true);
			        var apiinfo = findStr(apiinfoTemp, "'", "',");
			        var selleridTemp = findStr(reviewBody, "itemId", "',", true);
			        var sellerid = findStr(selleridTemp, "'", "',");

					var resObj = {
						'type': 'taobao',
						'apiinfo' : apiinfo,
						'title': title,
						'price_del' : price,
						'sellerid' : sellerid,
						'des' : des,
						'imgs' : imgs
					};
					if(debug) console.log('getTaobao  resObj = ' + resObj);
					ac_callback(null, resObj, options);
				}
			});
 		}, function(resObj, options, ac_callback){
			var sellerid = resObj.sellerid;

			options.url = "https://count.taobao.com/counter3?_ksTS=1462955552229_98&callback=jsonp99&keys=ICE_3_feedcount-"+sellerid;
	        requestWithEncoding(options, function(err, data) {
	            if (err) {
	                ac_callback(err, null);
	            } else {
	                data = data.toString();
					if(debug) console.log("data = " + data);

	                var reviews = findStr(data, ":", "}").trim();
	                if(debug) console.log("reviews = " + reviews);
					resObj.reviews = reviews;
					ac_callback(null, resObj, options);
	            }
	        });
        }, function(resObj, options, ac_callback){
			var sellerid = resObj.sellerid;
			options.url = "https://detailskip.taobao.com/service/getData/1/p2/item/detail/sib.htm?itemId="+sellerid+"&modules=qrcode,viewer,price,contract,duty,xmpPromotion,dynStock,delivery,upp,sellerDetail,activity,fqg,zjys,amountRestriction,coupon&callback=onSibRequestSuccess"
			requestWithEncoding(options, function(err, data) {
			    if (err) {
			        ac_callback(err, null);
			    } else {
			        data = data.toString();
			        if(debug) console.log("data = " + data);

                    if(obj.data.promotion && obj.data.promotion.promoData){
                        var reviews = findStr(data, "onSibRequestSuccess(", ");").trim();
    			        var obj = jsonic(reviews);
    					var start = obj.data.promotion.promoData.def[0].start;
    					var price;
    					if(start) {
    						price = obj.data.promotion.promoData.def[0].price;
    					} else {
    						price = resObj.price_del;
    						resObj.price_del = '';
    					}
                        console.log("price = " + price);
                        resObj.price = price;
                    }
					ac_callback(null, resObj, options);
			    }
			});

        },function(resObj, options, ac_callback){//get html
			var apiinfo = "https:" + resObj.apiinfo;
			options.url = apiinfo;
			requestWithEncoding(options, function(err, data) {
			    if (err) {
			        ac_callback(err, null);
			    } else {
			        if(debug) console.log("apiinfo = " + data);
			        var sells = findStr(data, "$callback(", ");").trim();
			        var obj = jsonic(sells);
					var sells = obj.quantity.confirmGoods;
			        console.log("sells = " + sells);
					resObj.sells = sells;
					ac_callback(null, resObj);
			    }
			});
        },
    ],
    function(error, resObj){
        if (error != undefined) {
            callback.error(error);
        }
        else{
            callback.success(resObj);
        }
    });

}

function getTmao(url, callback) {
	console.log('url='+url);

	var options = {
	    url: url,
	    headers: {
	        'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 BIDUBrowser/8.0 Safari/537.36',
	        'Accept-Language':'zh-CN,zh;q=0.8',
	        'Accept-Encoding':'gzip',
	        'X-Requested-With': 'XMLHttpRequest',
	        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
	        'Connection':'keep-alive',
	        'Cache-Control':'max-age=0',
	        'referer' : url
	    }
	};

 	async.waterfall([function(ac_callback) {
			requestWithEncoding(options, function(err, data) {
				if (err) {
					ac_callback(err, null);
				} else {
			        var temp = iconv.decode(data, 'gbk');
			        $ = cheerio.load(temp, {decodeEntities: false});

			        var title = $('.tb-detail-hd > h1').html().trim();
			        var des = $('.tb-detail-hd > p').html().trim();

					var imgs = [];
					$('#J_UlThumb > li > a > img').each(function(i, elem) {
			            var img = $(elem).attr("src");
			            if (img.indexOf('https:') === -1) {
			                img = 'https:' + img;
			            }
			            imgs[i] = img;
			        });

					var priceTemp = findStr(temp, "TShop.Setup(", ");");
					var priceJson = JSON.parse(priceTemp);
			        var price = priceJson.detail.defaultItemPrice;

			        var initApi  = priceJson.initApi;
					var itemId  = priceJson.rateConfig.itemId;
					var sellerid  = priceJson.rateConfig.sellerId;
					var spuId  = priceJson.rateConfig.spuId;

					var resObj = {
						'type': 'taobao',
						'title': title,
						'price_del' : price,
						'des' : des,
						'imgs' : imgs,
						'initApi' : initApi,
						'itemId' : itemId,
						'sellerId' : sellerid,
						'spuId' : spuId
					};
					console.log('getTaobao  resObj = ' + resObj);
					ac_callback(null, resObj, options);
				}
			});
 		}, function(resObj, options, ac_callback){
			var itemId  = resObj.itemId;
			var sellerId  = resObj.sellerId;
			var spuId  = resObj.spuId;

        	options.url = "https://dsr-rate.tmall.com/list_dsr_info.htm?itemId="+itemId+"&spuId="+spuId+"&sellerId="+sellerId+"&_ksTS=1463038647679_196&callback=jsonp197";
	        requestWithEncoding(options, function(err, data) {
	            if (err) {
	                ac_callback(err, null);
	            } else {
					data = data.toString();
	                var reviews = findStr(data, "jsonp197(", ")").trim();
	                var obj = jsonic(reviews);
					resObj.reviews = obj.dsr.rateTotal;
					console.log("reviews = " + resObj.reviews);
					ac_callback(null, resObj, options);
	            }
	        });
        },function(resObj, options, ac_callback){
			options.url = "https:" + resObj.initApi;
			requestWithEncoding(options, function(err, data) {
			    if (err) {
			        ac_callback(err, null);
			    } else {
					data = data.toString();
			        if(debug) console.log("apiinfo = " + data);

					var obj = jsonic(data);
					var sells = obj.defaultModel.sellCountDO.sellCount;
					var priceInfos = obj.defaultModel.itemPriceResultDO.priceInfo;
					var priceInfo;
					for (var key in priceInfos) {
						priceInfo = priceInfos[key];
						break;
					}
					var price;
	                if(priceInfo.promotionList === undefined) {
	                    price = priceInfo.price;
						resObj.price_del = '';
	                } else {
	                    price = priceInfo.promotionList[0].price;
	                }
					resObj.price = price;
					resObj.sells = sells;
					console.log("price = " + price + "   sells="+sells);
					ac_callback(null, resObj);
			    }
			});
        },
    ],
    function(error, resObj){
        if (error != undefined) {
            callback.error(error);
        }
        else{
            callback.success(resObj);
        }
    });

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
	          callback(err, decoded /*&& decoded.toString()*/);
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

function findStr(str, startstr, endstr, isContain) {
    var isContain = false | isContain;

    var start = str.indexOf(startstr);
    if(start === -1) {
        return null;
    }
    var end = str.indexOf(endstr, start);
    if(end === -1) {
        return null;
    }

    if(debug) console.log(start + '    ' + end);
    var body = '';
    if(isContain) {
        body = str.substring(start, end+ endstr.length);
    } else {
        body = str.substring(start + startstr.length, end);
    }
    if(debug) console.log('body ' + body);
    return body;
}

function findCookie(callback) {
    mysql.getConnection(function(error, conn) {
        if (error) {
            throw error;
        } else {
        	var now = new Date();
            conn.query("SELECT * FROM kcmd_weibocookie ORDER BY created_at DESC limit 1", null, function(err, result) {
                if (err) {
                    callback.error(err);
                } else {
                    if (result.length > 0) {
                        var item = result[0];
                        var cookie = item['cookie'];
                        callback.success(cookie);
                    } else {
                        callback.success(null);
                    }
                }
                conn.release();
            });
        }
    });
}
