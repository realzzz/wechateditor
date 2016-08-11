/*
 * @Author: Vaninadh
 * @Date:   2016-05-27 17:50:30
 * @Last Modified by:   Vaninadh
 * @Last Modified time: 2016-06-02 16:55:32
 */

define(function(require) {
    var $ = require('jquery');
    var Mustache = require("mustache");
    return initialize;

    function initialize() {
    	var pageid = 1;
        var box = $("#gzh_list");

        var temp = function() {
            return [
                '{{#objs}}',
                '<a class="db b3 fs0 pt10 pb10">',
                '<img src="../images/p1_3_1.jpg" width="80" height="80" class="di vm" />',
                '<div class="di vm w3 pl15 fs14 colorb tl">',
                '<div class="pb3">公众号：IF</div>',
                '<div class="colorg">微信：if_fashion888</div>',
                '</div>',
                '<div class="di vm w3 pl15 fs14 colorb tl">',
                '<div class="pb3">授权时间：<span class="colorg">2016-05-25 13:20</span></div>',
                '<div class="">状态：<span class="colorg">有效</span></div>',
                '</div>',
                
                '<div class="di vm pl15 pr10 fs12 colorg tc cancel_auth">',
                '<div class="di line mb10"></div>',
                '<div class="">取消授权</div>',
                '</div>',
                
                '{{/objs}}',
            ].join("\n");
        };

        var renderList = function(dataObj) {
            var $html = $(Mustache.render(temp(), dataObj));
            box.append($html);
        }

        var init = function() {
        	box.on('click','.cancel_auth',function(){
        		console.log('1111111111');
        	})
            var data = { objs: [{ title: 'xxx' }, { title: 'xxxx' }, { title: 'xxxx' }, { title: 'xxxx' }] };
            renderList(data);
        }

        init();
    }


})
