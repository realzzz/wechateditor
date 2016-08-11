/*
* @Author: Vaninadh
* @Date:   2016-05-27 15:39:01
* @Last Modified by:   Vaninadh
* @Last Modified time: 2016-05-30 17:43:22
*/

define(function(require) {

	var jquery = require('jquery');
	var lcAv = require('leancloudav');
    var lcAvCore = require('leancloudavcore');

	function initialize() {
		AV.initialize('lckey', 'lcsecret');
        var current=AV.User.current();
        console.log(current);
        if(!current){

        }

	return initialize;

})
