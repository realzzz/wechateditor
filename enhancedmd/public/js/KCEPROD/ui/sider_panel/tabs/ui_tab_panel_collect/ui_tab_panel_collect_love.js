/*
 * @Author: Vaninadh
 * @Date:   2016-04-11 15:50:35
 * @Last Modified by:   Vaninadh
 * @Last Modified time: 2016-04-16 14:54:26
 */
define(function(require) {
    var defineComponent = require("flight/lib/component");
    var uiCellMixinDraggable = require("KCEPROD/ui/sider_panel/cell/ui_cell_mixin_draggable");

    var Mustache = require("mustache");
    var ns = window.kc.ns;
    var util = require("KCEPROD/util/util");

    return defineComponent(uiCellMixinDraggable, uiTabPanelCollectLove);

    function uiTabPanelCollectLove() {
        this.attributes({
            loadonce: false,
            loveTabSelector: "#collect-love-tab",
            loveBoxSelector: "#collect-love-box",
            pageid: 0,
            listType: "template",
            cellTempSelector: ".collect-temp-cell",
            itemOpDeleteSelector: ".icon-shanchu",
            itemDraggable: ".item-draggable",
        });

        this.renderTab = function(e, data) {
            if (!this.attr.loadonce) {
                console.log("render uiCollectTabLove is ok!");
                this.renderCollectListScroll();

                this.addBoxListener();
                this.attr.loadonce = true;
            }
        }

        this.clearCollectInBox = function() {
            $(this.attr.loveBoxSelector).html("");
            this.attr.pageid = 0;
        }

        this.addBoxListener = function() {
            var that = this;

            $(this.attr.loveBoxSelector).scroll(function() {
                var $this = $(this);
                var height = this.scrollHeight - $this.height() - 50; // Get the height of the div
                var scroll = $this.scrollTop(); // Get the vertical scroll position

                var isScrolledToEnd = (scroll >= height);

                if (isScrolledToEnd) {
                    that.renderCollectListScroll();
                }
            });

            this.on(this.attr.loveBoxSelector, 'click', {
                itemOpDeleteSelector: this.itemOpDelete
            });
        };

        this.itemOpDelete = function(e, data) {
            var cid = $(data.el).parent().data('id');
            this.trigger(ns.e.data.dataTemplateCollectDelete, {
                cid: cid,
                el: data.el
            });
        };

        this.renderCollectListScroll = function() {
            this.trigger(ns.e.data.dataTemplateCollectList, {
                type: this.attr.listType,
                pageid: this.attr.pageid
            });
            this.attr.pageid++;
        }

        this.getTmpl = function() {
            return [
                '{{#objs}}',
                '<div class="item-draggable" style="position:relative" data-id="{{targetid}}" targettype="template">',
                '<div class="item-op-center" data-id="{{id}}">',
                '<i class="iconfont icon-shanchu"/>',
                '</div>',
                '<div class="collect-temp-cell cell-list"  style="width:280px">',
                '{{{html}}}',
                '</div>',
                '</div>',
                '{{/objs}}',
            ].join('\n');
        }

        //callback when server send json data to client
        this.renderTemplateCollectList = function(e, data) {
            $(this.attr.loveBoxSelector).append(Mustache.render(this.getTmpl(), data.json));
            this.activeDraggable($(this.attr.itemDraggable));
        }
        this.renderTemplateCollectDelete = function(e, data) {
            $(data.el).parent().parent().remove();
        }

        this.renderTemplateCollectRefresh = function() {
            if (this.attr.loadonce) {
                this.clearCollectInBox();
                this.renderCollectListScroll();
            }
        }

        this.doDirectInsert = function (e, data){
            var lastIdx = util.getLastCanvasItemIndex();
            var type =e.currentTarget.attributes['targettype'].value;
            var idkey = 'tid';
            if (type == 'inline') {
                idkey = 'bid';
            }
            var styleObj = {};
            styleObj[idkey]= e.currentTarget.attributes['data-id'].value;
            this.trigger(ns.e.createNode, {
                itemtype: type,
                para :  styleObj,
                el:$(".canvas > [kctype='container']")[0],
                preel: lastIdx,
            });
        }

        this.after("initialize", function() {
            console.log("uiTabPanelCollectLove is ok!");
            this.on(document, ns.e.tab.uiCollectTabLove, this.renderTab);
            this.on(document, ns.e.tab.uiTemplateCollectList, this.renderTemplateCollectList);
            this.on(document, ns.e.tab.uiTemplateCollectDelete, this.renderTemplateCollectDelete);
            this.on(document, ns.e.tab.uiTemplateCollectRefresh, this.renderTemplateCollectRefresh);
            this.on('click', {itemDraggable: this.doDirectInsert});
        });
    }
});
