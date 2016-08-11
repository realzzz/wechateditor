/*
 * @Author: Vaninadh
 * @Date:   2016-05-04 14:22:39
 * @Last Modified by:   Vaninadh
 * @Last Modified time: 2016-05-04 19:19:41
 */

define(function(require) {
    var defineComponent = require("flight/lib/component");
    var util = require("KCEPROD/util/util");
    var ns = window.kc.ns;
    return defineComponent(resize);

    function resize() {

        this.attributes({
            loadonce: false,
            canvasSelector: '.canvas',
            group: '',
            barGroupDom: ''
        });

        this.getOpBar = function() {
            if (!this.attr.loadonce) {
            	var opBarDom=$('<div>',{class:'op-cp-pose'});
                var barGroupDom = $('<div>', { class: 'bar-group' }).appendTo(opBarDom);

                this.attr.barGroupDom = barGroupDom;

                var boxLineDom = $('<div>', { class: 'box-lines' }).appendTo(barGroupDom);

                this.attr.group = {};
                this.attr.group.line = {};
                this.attr.group.handle = {};

                this.attr.group.line.n = $('<span>', { class: 'bar line n' }).appendTo(boxLineDom);
                this.attr.group.line.e = $('<span>', { class: 'bar line e' }).appendTo(boxLineDom);
                this.attr.group.line.s = $('<span>', { class: 'bar line s' }).appendTo(boxLineDom);
                this.attr.group.line.w = $('<span>', { class: 'bar line w' }).appendTo(boxLineDom);
                this.attr.group.line.ne = $('<span>', { class: 'bar line corner ne' }).appendTo(boxLineDom);
                this.attr.group.line.se = $('<span>', { class: 'bar line corner se' }).appendTo(boxLineDom);
                this.attr.group.line.sw = $('<span>', { class: 'bar line corner sw' }).appendTo(boxLineDom);
                this.attr.group.line.nw = $('<span>', { class: 'bar line corner nw' }).appendTo(boxLineDom);

                var boxHandleDom = $('<div>', { class: 'box-handles' }).appendTo(barGroupDom);
                this.attr.group.handle.w = $('<span>', { class: 'bar line w', title: '拖拽改变宽度' }).appendTo(boxHandleDom);
                this.attr.group.handle.e = $('<span>', { class: 'bar line e', title: '拖拽改变宽度' }).appendTo(boxHandleDom);
                this.attr.group.handle.n = $('<span>', { class: 'bar line n', title: '拖拽改变高度' }).appendTo(boxHandleDom);
                this.attr.group.handle.s = $('<span>', { class: 'bar line n', title: '拖拽改变高度' }).appendTo(boxHandleDom);
                this.attr.group.handle.ne = $('<span>', { class: 'bar line n', title: '拖拽改变大小' }).appendTo(boxHandleDom);
                this.attr.group.handle.se = $('<span>', { class: 'bar line n', title: '拖拽改变大小' }).appendTo(boxHandleDom);
                this.attr.group.handle.sw = $('<span>', { class: 'bar line n', title: '拖拽改变大小' }).appendTo(boxHandleDom);
                this.attr.group.handle.nw = $('<span>', { class: 'bar line n', title: '拖拽改变大小' }).appendTo(boxHandleDom);

                $(this.attr.canvasSelector).before(opBarDom);
                this.attr.loadonce = true;
            }
        }

        this.activeResize = function(e, data) {
            this.getOpBar();

        };

        this.destroyResize = function() {

        }
        this.after("initialize", function() {
            this.on(document, ns.e.command.uiResizeActivate, this.activeResize);
            this.on(document, ns.e.command.uiResizeDestroy, this.destroyResize);
        });
    }
});
