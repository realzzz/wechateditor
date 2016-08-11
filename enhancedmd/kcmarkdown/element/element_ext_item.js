
var enum_tmall = 'tmall';
var enum_taobao = 'taobao';
var enum_weibo = 'weibo';
var enum_error = 'error';
var enum_weidian = 'weidian';

module.exports.enum_type = {
	'tmall' : 'tmall',
	'taobao' : 'taobao',
	'weibo' : 'weibo',
	'error' : 'error',
	'weidian' : 'weidian',
	'shopex' : "shopex"
};

function errorItem() {
	this.type = enum_error;
}

function tmaoItem(title, des, price, sells, reviews, imgs) {
	 this.title = title; 	//标题
	 this.des = des;     	//描述
	 this.price = price;	//价格
	 this.sells = sells;	//销量
	 this.reviews = reviews;//评价
	 this.imgs = imgs;		//图片列表
}

module.exports.createTmaoItem = function(title, des, price, sells, reviews, imgs) {
	return new tmaoItem(title, des, price, sells, reviews, imgs);
}

module.exports.createErrorItem = function() {
	return new errorItem();
}


module.exports.getEnumTmall = function() {
	return enum_tmall;
}

module.exports.getEnumTaobao = function() {
	return enum_taobao;
}

module.exports.getEnumWeibo = function() {
	return enum_weibo;
}

module.exports.getEnumError = function() {
	return enum_error;
}

module.exports.getEnumWeidian = function() {
	return enum_weidian;
}
