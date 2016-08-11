/*
* @Author: Vaninadh
* @Date:   2016-06-03 15:20:43
* @Last Modified by:   Vaninadh
* @Last Modified time: 2016-06-03 17:58:20
*/

define(function(require) {
    var $ = require('jquery');
    var jquery_ui = require('jquery-ui');
    var Mustache = require("mustache");
    return initialize;

    function initialize() {
    	var pageid = 1;
        var box = $("#gzh_list");

        var temp = function() {
            return [
                '{{#objs}}',
                '{{/objs}}',
            ].join("\n");
        };



        var renderList = function(dataObj) {

        }

        var init = function() {

        }

        init();
    }


})