/*
 * @Author: Vaninadh
 * @Date:   2016-03-28 15:39:06
 * @Last Modified by:   Vaninadh
 * @Last Modified time: 2016-03-30 20:00:17
 */

define(function(require) {
    var defineComponent = require("flight/lib/component");
    //extends draggable behavior
    var uiMixinButtonDraggable = require("KCEPROD/ui/sider_panel/button/ui_mixin_button_draggable");
    var util = require("KCEPROD/util/util");
    var ns = window.kc.ns;
    return defineComponent(uiMixinButtonDraggable, uiContainerButton);

    function uiContainerButton() {
        this.helperElm = function() {
            return $("<div/>", {
                text: '我是容器',
                class: "tmpdrag",
                targettype: "container",
                attrheight: "200px",
            });
        };

        this.doDirectInsert = function (e, data){
            var lastIdx = util.getLastCanvasItemIndex();

            this.trigger(ns.e.createNode, {
                itemtype: "container",
                para : {style:{height:"200px"}},
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
