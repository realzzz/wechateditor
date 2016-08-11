/*
 * @Author: Vaninadh
 * @Date:   2016-03-28 16:46:55
 * @Last Modified by:   Vaninadh
 * @Last Modified time: 2016-03-30 20:00:10
 */

define(function(require) {
    var defineComponent = require("flight/lib/component");
    //extends draggable behavior
    var uiCellDraggable = require("KCEPROD/ui/sider_panel/cell/ui_cell_draggable");
    var util = require("KCEPROD/util/util");
    var ns = window.kc.ns;
    return defineComponent(uiCellDraggable, uiCell3rdParty);

    function uiCell3rdParty() {
        this.helperElm = function() {
            return $("<div/>", {
                text: '我是图片',
                class: "tmpdrag",
                targettype: "image",
                src:"images/p1_16.jpg",
                tposition:"relative"
            });
        };

        this.doDirectInsert = function (e, data){
            var lastIdx = util.getLastCanvasItemIndex();

            this.trigger(ns.e.createNode, {
                itemtype: "ext",
                para : {url: e.currentTarget.attributes['urlz'].value},
                el:$(".canvas > [kctype='container']")[0],
                preel: lastIdx,
            });

        }

        this.after("initialize", function() {
            this.activeBtnDraggable();
            this.on('click', this.doDirectInsert);
        });
    }
});
