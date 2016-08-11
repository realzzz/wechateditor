/*
 * @Author: Vaninadh
 * @Date:   2016-05-27 17:50:39
 * @Last Modified by:   Vaninadh
 * @Last Modified time: 2016-06-02 15:51:56
 */

define(function(require) {
    var $ = require('jquery');
    
    var Mustache = require("mustache");

    var masonry = require('masonry');
    var bridget = require('jquery-bridget');
    $.bridget('masonry', masonry);
    return initialize;

    function initialize() {

        var pageid = 1;
        var box = $('#article_box ul');

        var temp = function() {
            return [
                '{{#objs}}',
                '<li style="width:364px;margin:8px;">',
                '<div class=" bgg pd20 b2 mb20">',
                '<a class="db pd10 fs0 b2 bbn" >',
                '<img src="../images/p1_5.jpg" width="80" height="80" class="di vm" />',
                '<div class="di vm w3 fs14 colorb pl10">你知道这些大号为了每一个阅读数付出多少成本吗？</div>',
                '</a>',
                '<a class="db pd10 fs0 b2 bbn" >',
                '<img src="../images/p1_5.jpg" width="40" height="40" class="di vm" />',
                '<div class="di vm w5 fs14 colorb pl10">你知道这些大号为了每一个阅读数付出多少成本吗？</div>',
                '</a>',
                '<a class="db pd10 fs0 b2" >',
                '<img src="../images/p1_5.jpg" width="40" height="40" class="di vm" />',
                '<div class="di vm w5 fs14 colorb pl10">你知道这些大号为了每一个阅读数付出多少成本吗？</div>',
                '</a>',
                '<div class="fs14 colorb pt10 pb10 tc">创建时间<span class="colorg pl10">2016-05-26 12:30</span></div>',
                '<div class=""><a class="db fs14 colorw tc bgy1 pt5 pb5">查看同步状态</a></div>',
                '</div>',
                '</li>',
                '{{/objs}}'
            ].join("\n");
        };

        var renderList = function(dataObj) {
            var $html = $(Mustache.render(temp(), dataObj));
            box.append($html).masonry('appended', $html);
        }

        var init = function() {
            box.masonry({
                columnWidth: 380,
                itemSelector: 'li',
                isAnimated: true
            });
            var data = { objs: [{ title: 'xxx' }, { title: 'xxxx' }, { title: 'xxxx' }, { title: 'xxxx' }] };
            renderList(data);
        }

        var getList = function() {
            $.ajax({
                type: "POST",
                url: "",
                data: {},
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function(result) {
                	renderList(result);
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    console.log(XMLHttpRequest.status);
                    console.log(XMLHttpRequest.readyState);
                    console.log(textStatus);
                }
            });
        }

        init();
    }

    
})
