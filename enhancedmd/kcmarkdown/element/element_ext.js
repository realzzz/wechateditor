var request = require('request');
var iconv = require('iconv-lite'); //解决编码转换模块
var cheerio = require('cheerio');
var BufferHelper = require('bufferhelper');
var phantom = require('phantom');
var itemFactory = require('./element_ext_item');
var reqHtml = require('./element_ext_req');
var fs = require('fs');
var mysql = require('../../util/mysql');
var async = require('async');
var html2json = require('../common/html2json');
var moment = require('moment');
var enum_type = require('./element_ext_item').enum_type;

var tmall = itemFactory.getEnumTmall();
var taobao = itemFactory.getEnumTaobao();
var weibo = itemFactory.getEnumWeibo();
var weidian = itemFactory.getEnumWeidian();
var shopex = enum_type.shapex;

/**
    微博数据爬取攻略
    1、拿到登录cookie。
        微博账号登陆登出后，用findder拿到cookie值
    2、将cookie值填入elemnt_ext_weibo.js 的   var cookie =

    以上是测试方案，正式会调用task定时获取cookie存入数据库中，调用微博爬取时只需要从数据库中拿去
*/
var urls = {
    'https://detail.tmall.com/': tmall,
    'https://chaoshi.detail.tmall.com':tmall,
    'https://item.taobao.com/': taobao,
    'http://weibo.com/': weibo,
    'http://www.weibo.com/': weibo,
    'http://detail.koudaitong.com':weidian
};

var fuzzyurl = {
    'm.fy.shopex.cn':shopex
}

String.prototype.startWith = function(str) {
    var reg = new RegExp("^" + str);
    return reg.test(this);
}


module.exports.create = function create(attrs, callback) {
    // useless
    // var imgObj = { "kctype": "ext" };
    // var keysOfAttr = Object.keys(attrs);
    // for (var i = 0; i < keysOfAttr.length; i++) {
    //     var attr = keysOfAttr[i];
    //     imgObj[attr] = attrs[attr];
    // }
    // callback.success(imgObj);


    // add fetch process

    // url, key, refresh, callback) {
    if (attrs == undefined) {
        var err = new Error("empty node to render");
        callback.error(err);
        return;
    }
    var url = attrs['url'];

    if (url === null || url === undefined) {
        var err = new Error("empty url to render");
        callback.error(err);
        return;
    }

    var key = attrs['key'];
    var refresh = attrs['refresh'];

    console.log("create element_ext url = %s", url);
    async.waterfall([
        function(ac_callback){
            if (refresh !== '1') {
                findContentInDb(url, {
                    success: function onSuccess(type, object) {
                        ac_callback(null, object, type);
                    },
                    error: function onError(error) {
                        ac_callback(null, null, null);
                    }
                });

            }
            else{
                ac_callback(null, null, null);
            }
        },
        function(dataobj, type,  ac_callback){
            if(dataobj == null){
                fetchExtContent(url, key, {
                    success: function onSuccess(type, object){
                        ac_callback(null, object, type);
                    },
                    error: function onError(error){
                        ac_callback(error);
                    }
                });
            }
            else{
                ac_callback(null, dataobj, type);
            }
        },
        function(dataobj,type, ac_callback){
            if(dataobj != null){
                renderExtContent(type, dataobj, key, {
                    success: function onRenderSuccess(html){
                        ac_callback(null, html);
                    },
                    error: function onRenderError(err){
                        ac_callback(err, null);
                    }
                });
            }
            else{
                var err = new Error("object not existing");
                ac_callback(err);
            }
        },
        function(html, ac_callback){

            // convert to json object
            html2json.convert(html,{
                success:function(jsonObj){
                    ac_callback(null, jsonObj);
                },
                error:function(err){
                    ac_callback(err);
                }
            });
        }
    ],
    function(error, jsonObj){
        if (error != undefined) {
            callback.error(error);
        }
        else{
            callback.success(jsonObj);
        }
    });

}

// well looks like most of the element has the same process here... but for now let's keep them seperated. will see how it goes later.
module.exports.update = function update(node, attrs, callback) {
    var keysOfAttr = Object.keys(attrs);
    for (var i = 0; i < keysOfAttr.length; i++) {
        var attr = keysOfAttr[i];
        node[attr] = attrs[attr];
    }
    callback.success(node);
}

module.exports.render = function render(node, callback) {
    // url, key, refresh, callback) {
    if (node == undefined) {
        var err = new Error("empty node to render");
        callback.error(err);
        return;
    }
    var url = node['url'];

    if (url === null || url === undefined) {
        var err = new Error("empty url to render");
        callback.error(err);
        return;
    }

    var key = node['key'];
    var refresh = node['refresh'];

    console.log("element_ext url = %s", url);
    async.waterfall([
        function(ac_callback){
            if (refresh !== '1') {
                findContentInDb(url, {
                    success: function onSuccess(type, object) {
                        ac_callback(null, object, type);
                    },
                    error: function onError(error) {
                        ac_callback(null, null, null);
                    }
                });

            }
            else{
                ac_callback(null, null, null);
            }
        },
        function(dataobj, type,  ac_callback){
            if(dataobj == null){
                fetchExtContent(url, key, {
                    success: function onSuccess(type, object){
                        ac_callback(null, object, type);
                    },
                    error: function onError(error){
                        ac_callback(error);
                    }
                });
            }
            else{
                ac_callback(null, dataobj, type);
            }
        },
        function(dataobj,type, ac_callback){
            if(dataobj != null){
                renderExtContent(type, dataobj, key, {
                    success: function onRenderSuccess(html){
                        ac_callback(null, html);
                    },
                    error: function onRenderError(err){
                        ac_callback(err, null);
                    }
                });
            }
            else{
                var err = new Error("object not existing");
                ac_callback(err);
            }
        },
        function(html, ac_callback){
            $ = cheerio.load('<section></section>');
            $('section').attr('kctype',"ext");
            $('section').attr('url',node['url']);
            if (node['id'] != undefined) {
                $('section').attr('id', node['id']);
            }
            $('section').append(html);
            var finalhtml = $.html();
            ac_callback(null, finalhtml);
        }
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

function fetchExtContent(url, key, callback){
    var webType = checkWebType(url);
    console.log("element_ext url = %s", webType);
    if (webType === weibo) {
        reqHtml.getWeibo(url, {
            success: function onSuccess(content) {
                if(content !== null) {
                    var object = handleWeibo(content, key);
                    callback.success(webType, object);
                    saveContent(url, webType, object, {
                        success: function onSuccess() {},
                        error: function onError(error) {}
                    });
                } else {
                    callback.error(Error('spider fail'));
                }
            },
            error: function onError(error) {
                callback.error(error);
            }
        });

    } else if(webType === shopex || webType === taobao || webType === tmall) {
        reqHtml.getRequestOjbect(url, webType, {
            success: function onSuccess(content) {
                if(content !== null) {
                    callback.success(webType, content);
                    saveContent(url, webType, content, {
                        success: function onSuccess() {},
                        error: function onError(error) {}
                    });
                } else {
                    callback.error(Error('spider fail'));
                }
            },
            error: function onError(error) {
                callback.error(error);
            }
        });

    } else if (webType !== null) {
        phantom.create().then(function(ph) {
            ph.createPage().then(function(page) {
                page.open(url).then(function(status) {
                    console.log(status);
                    if (status === 'success') {
                        page.property('content').then(function(content) {
                            page.close();
                            ph.exit();
                            // console.log('body='+content);
                            // save(content);
                            console.log('webType=' + webType);
                            var object;
                            if (webType === tmall) {
                                object = handleTmall(content);
                            } else if (webType === taobao) {
                                object = handleTaobao(content);
                            } else if (webType === weibo) {
                                object = handleWeibo(content, key);
                            } else if(webType === weidian) {
                                 object = handleWeidian(content, key);
                            }
                            callback.success(webType, object);
                            saveContent(url, webType, object, {
                                success: function onSuccess() {},
                                error: function onError(error) {}
                            });
                        });
                    } else {
                        hanldeError(callback, '请求网页失败');
                    }
                });
            });
        });
    } else {
        hanldeError(callback, '不支持此类型');
    }
}


function renderExtContent(type, itemObj, key, callback){
    if (type === tmall) {
        object = drawLayoutTmall(itemObj, callback);
    } else if (type === taobao) {
        object = drawLayoutTaobao(itemObj, callback);
    } else if (type === weibo) {
        object = drawLayoutWeibo(itemObj,key, callback);
    } else if (type === weidian) {
        object = drawLayoutWeidian(itemObj, callback);
    } else if(type === shopex) {
        object = drawLayouShopex(itemObj, callback);
    }
}


function handleTmall(body) {
    $ = cheerio.load(body);
    var html = $('div.tm-clear').html();
    $ = cheerio.load(html);

    var title = $('div.tb-detail-hd > h1').text();
    var des = $('div.tb-detail-hd > p').text();
    var price = $('div.tm-promo-price > span').text();
    var price_del = $('dl.tm-tagPrice-panel > dd > span').text();
    if(price === '' && price_del === '') {
        price = $('div.tm-fcs-panel > dl > dd > span.tm-price').text();
    }

    var sells = $('li.tm-ind-sellCount > div > span.tm-count').text();
    var reviews = $('li.tm-ind-reviewCount > div > span.tm-count').text();

    var imgs = [];
    $('#J_UlThumb > li > a > img').each(function(i, elem) {
        var img = $(elem).attr("src");
        if (!img.startWith('https:')) {
            img = 'https:' + img;
        }
        imgs[i] = img;
    });

    var object = {
        'type': tmall,
        'title': title,
        'des': des,
        'price': price,
        'price_del':price_del,
        'sells': sells,
        'reviews': reviews,
        'imgs': imgs
    };
    return object;
}

function handleTaobao(body) {

    $ = cheerio.load(body);
    var html = $('div.tb-summary').html();
    $ = cheerio.load(html);
    var title = $('#J_Title > h3').text();
    var price = $('#J_PromoPriceNum').text();
    var reviews = $('#J_RateCounter').text();
    var sells = $('#J_SellCounter').text();

    var imgs = [];
    $('#J_UlThumb > li > div > a > img').each(function(i, elem) {
        var img = $(elem).attr("src");
        if (!img.startWith('https:')) {
            img = 'https:' + img;
        }
        imgs[i] = img;
    });
    var object = {
        'type': taobao,
        'title': title,
        'price': price,
        'sells': sells,
        'reviews': reviews,
        'imgs': imgs
    };
    return object;
}

function handleWeibo(body, key) {
    // $ = cheerio.load(body);
    // var html = $('div.WB_feed.WB_feed_profile > div.WB_feed.WB_feed_profile').html();
    var items = [];
    $ = cheerio.load(body);
    $('div.WB_feed_detail').each(function(i, elem) {
        // console.log('i==%d', i);
        var item = $(elem).html();
        // console.log(item);
        $ = cheerio.load(item);
        $('span.W_icon_feedhot').remove();
        $('a.W_btn_b').remove();
        var des = $('div.WB_text').text();
        var imgsHtml = $('div.WB_detail > div > div > ul').html();
        var head = $('div.face > a > img').attr("src");
        var name = $('div.WB_info > a').text();
        var date = $('div.WB_from > a').attr("date");

        var imgs = [];
        if (imgsHtml !== null) {
            $ = cheerio.load(imgsHtml);
            $('li > img').each(function(i, elem) {
                var img = $(elem).attr("src");
                imgs[i] = img;
            });
        }
        var item = {
            'type': weibo,
            'head':head,
            'name':name,
            'date':date,
            'des': des,
            'imgs': imgs
        };

        items[i] = item;
    });
    return items;
}

function handleWeidian(body) {

    $ = cheerio.load(body);
    var html = $('div.goods-summary').html();
    $ = cheerio.load(html);
    var title = $('div > h3.goods-title').text();
    $('em.goods-rmb').remove();
    var price = $('strong.goods-current-price').text();

    var imgs = [];
    $('div.swiper-pagination-list > span > img').each(function(i, elem) {
        var img = $(elem).attr("src");
        if (!img.startWith('https:')) {
            img = 'https:' + img;
        }
        imgs[i] = img;
    });
    var object = {
        'type': weidian,
        'title': title,
        'price': price,
        'imgs': imgs
    };
    return object;
}

function findWeiboKey(items, key) {
    for (var i = 0; i < items.length; i++) {
        var item = items[i];
        var index = item['des'].indexOf(key);
        if (index !== -1) {
            // console.log('find it %d', i);
            return i;
        }
    };
    return -1;
}

// function save(body) {
// 	fs.writeFile('D://html3.txt', body, function(err) {
// 		if(err) throw err;
// 		console.log('it is save');

// 	});
// }

function drawLayoutTmall(object,callback) {
    var content = object['title'] + object['des'] + object['price'] + object['sells'] + object['reviews'];
    // callback('element_ext_tmao', { 'title': content, 'img': object['imgs'][0]});

    mysql.getConnection(function(error, conn) {
        if (error) {
            console.log('sql connect fail');
            callback.error(error);
        } else {
            conn.query("SELECT * FROM kcmd_element_ext_html WHERE ? ", { id: 1 }, function(err, result) {
                if (err) {
                    console.log('sql select fail');
                    callback.error(err);
                } else {
                    if (result.length > 0) {
                        var item = result[0];
                        var content = item['content'];
                        $ = cheerio.load(content);
                        $('#title').text(object['title']);
                        $('#price').text('¥  ' + object['price']);
                        if(object['price_del'] !== '' && object['price_del'] !== undefined) {
                            $('#price_del').text('¥  ' + object['price_del']);
                        } else {
                            $('#price_del').remove();
                        }
                        $('#reviews').text('评论  ' + object['reviews']);
                        $('#source').text('来自天猫');
                        $('#copy').remove();
                        var imgs = object['imgs'];
                        if (imgs !== null && imgs !== undefined && imgs[0] !== undefined) {
                            //大图
                            var img = imgs[0].replace(/60x60/g, '600x600');
                            setImageSrc( $('#img'), img);
                        } else {
                            $('#img').remove();
                        }
                        callback.success($.html());
                    } else {
                        var notexisterr = new Error('tmall tempalte not exist');
                        callback.error(notexisterr);
                    }
                }
                conn.release();
            });
        }
    });
}

function drawLayoutTaobao(object,callback) {
    var content = object['title'] + object['price'] + object['sells'] + object['reviews'];

    mysql.getConnection(function(error, conn) {
        if (error) {
            console.log('sql connect fail');
            callback.error(error);
        } else {
            conn.query("SELECT * FROM kcmd_element_ext_html WHERE ? ", { id: 1 }, function(err, result) {
                if (err) {
                    console.log('sql select fail');
                    callback.error(err);
                } else {
                    if (result.length > 0) {
                        var item = result[0];
                        var content = item['content'];
                        $ = cheerio.load(content);
                        $('#title').text(object['title']);
                        $('#price').text('¥  ' + object['price']);
                        if(object['price_del'] !== '' && object['price_del'] !== undefined) {
                            $('#price_del').text('¥  ' + object['price_del']);
                        } else {
                            $('#price_del').remove();
                        }
                        $('#reviews').text('评论  ' + object['reviews']);
                        $('#source').text('来自淘宝');
                        $('#copy').remove();
                        var imgs = object['imgs'];
                        if (imgs !== null && imgs !== undefined && imgs[0] !== undefined) {
                            //大图
                            var img = imgs[0].replace(/50x50/g, '600x600');
                            setImageSrc( $('#img'), img);
                        } else {
                            $('#img').remove();
                        }
                        callback.success($.html());
                    } else {
                        var notexisterr = new Error('taobao tempalte not exist');
                        callback.error(notexisterr);
                    }
                }
                conn.release();
            });
        }
    });
}


function drawLayoutWeibo( objects, key, callback) {

    if (key === null || key === '') {
        hanldeError(callback, '缺少关键词');
        return;
    }

    var index = findWeiboKey(objects, key);
    if (index === -1) {
        hanldeError(callback, '未找到对应关键词');
    } else {
        var object = objects[index];

        mysql.getConnection(function(error, conn) {
            if (error) {
                console.log('sql connect fail');
                callback.error(error);
            } else {
                var id = 2;
                if (object['imgs'].length > 1) {
                    id = 3;
                }
                conn.query("SELECT * FROM kcmd_element_ext_html WHERE ? ", { 'id': id }, function(err, result) {
                    if (err) {
                        console.log('sql select fail');
                        callback.error(err);
                    } else {
                        if (result.length > 0) {
                            var item = result[0];
                            var content = item['content'];
                            $ = cheerio.load(content);
                            var head = object['head'];
                            if(head !== undefined) {
                                setImageSrc($('#head'), head);
                            }
                            var timestamp = object['date'];
                            var date = moment(timestamp * 1).format('YYYY.MM.DD HH:mm');
                            $('#date').text(date);
                            $('#name').text(object['name']);
                            $('#des').text(object['des']);
                            var imgs = object['imgs'];
                            if(id == 3) {
                                if (imgs !== undefined && imgs.length > 0) {
                                    $('ul > li > img').each(function(i, elem) {
                                        //大图
                                        if(imgs[i] !== undefined) {
    	                                    var img = imgs[i].replace(/thumbnail/g, 'bmiddle');
    	                                    setImageSrc(elem, img);
    	                                }
                                    });
                                }
                            } else {
                                if(imgs[0] !== undefined) {
                                    var img = imgs[0].replace(/thumbnail/g, 'bmiddle');
                                    setImageSrc($('#img'), img);
                                }
                            }

                            callback.success($.html());
                        } else {
                            var notexisterr = new Error('weibo tempalte not exist');
                            callback.error(notexisterr);
                        }
                    }
                    conn.release();
                });
            }
        });
    }
}

function drawLayoutWeidian(object,callback) {

    mysql.getConnection(function(error, conn) {
        if (error) {
            console.log('sql connect fail');
            callback.error(error);
        } else {
            conn.query("SELECT * FROM kcmd_element_ext_html WHERE ? ", { id: 1 }, function(err, result) {
                if (err) {
                    console.log('sql select fail');
                    callback.error(err);
                } else {
                    if (result.length > 0) {
                        var item = result[0];
                        var content = item['content'];
                        $ = cheerio.load(content);
                        $('#title').text(object['title']);
                        $('#des').remove();
                        $('#price').text('¥  ' + object['price']);
                        var imgs = object['imgs'];
                        if (imgs !== null && imgs !== undefined) {
                            $('#imgs > img').each(function(i, elem) {
                                //大图
                                if(i < imgs.length) {
                                    var img = imgs[i].replace(/100x100/g, '580x580');
                                    setImageSrc(elem, img);
                                }
                            });
                        } else {
                            $('#imgs').remove();
                        }
                        callback.success($.html());
                    } else {
                        var notexisterr = new Error('weidian tempalte not exist');
                        callback.error(notexisterr);
                    }
                }
                conn.release();
            });
        }
    });
}

function drawLayouShopex(object, callback) {
    mysql.getConnection(function(error, conn) {
        if (error) {
            console.log('sql connect fail');
            callback.error(error);
        } else {
            conn.query("SELECT * FROM kcmd_element_ext_html WHERE ? ", { id: 1 }, function(err, result) {
                if (err) {
                    console.log('sql select fail');
                    callback.error(err);
                } else {
                    if (result.length > 0) {
                        var item = result[0];
                        var content = item['content'];
                        $ = cheerio.load(content);
                        $('#title').text(object['title']);
                        $('#des').remove();
                        $('#price').text( object['price']);
                        var imgs = object['imgs'];
                        if (imgs !== null && imgs !== undefined) {
                            setImageSrc( $('#img'), imgs);
                        } else {
                            $('#imgs').remove();
                        }
                        callback.success($.html());
                    } else {
                        var notexisterr = new Error('weidian tempalte not exist');
                        callback.error(notexisterr);
                    }
                }
                conn.release();
            });
        }
    });
}

function setImageSrc(path, img) {
    if (img !== undefined) {
        $(path).attr('src', img);
    }
}

function hanldeError(callback, errorStr) {
    var err = new Error(errorStr);
    callback.error(err);
}

function checkWebType(targetUrl) {
    for (var url in urls) {
        if (targetUrl.startWith(url)) {
            return urls[url];
        }
    };

    for(var url in fuzzyurl) {
        if(targetUrl.indexOf(url) > -1) {
            return fuzzyurl[url];
        }
    }

    return null;
}

function findContentInDb(url, callback) {
    mysql.getConnection(function(error, conn) {
        if (error) {
            console.log('sql connect fail');
            callback.error(error);
        } else {
            conn.query("SELECT * FROM kcmd_element_ext WHERE ? ", { 'url': url }, function(err, result) {
                if (err) {
                    console.log('sql select fail');
                    callback.error(err);
                } else {
                    if (result.length > 0) {
                        var item = result[0];
                        var content = item['content'];
                        var object = JSON.parse(content);
                        var type = item['type'];
                        callback.success(type, object);
                    } else {
                        callback.error(err);
                    }
                }
                conn.release();
            });
        }
    });
}


function saveContent(url, type, content, callback) {
    mysql.getConnection(function(error, conn) {
        if (error) {
            callback.error(error);
        } else {
            var str = JSON.stringify(content);

            conn.query("INSERT INTO kcmd_element_ext SET ? ", { "url": url, 'content': str, 'type': type }, function(err, result) {
                if (err) {
                    callback.error(error);
                } else {
                    console.log(result);
                    callback.success();
                }
                conn.release();
            });
        }
    });
}
