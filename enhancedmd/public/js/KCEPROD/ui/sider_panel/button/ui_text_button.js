/*
 * @Author: Vaninadh
 * @Date:   2016-03-28 16:40:54
 * @Last Modified by:   Vaninadh
 * @Last Modified time: 2016-03-30 20:00:21
 */

define(function(require) {
    var defineComponent = require("flight/lib/component");
    //extends draggable behavior
    var uiMixinButtonDraggable = require("KCEPROD/ui/sider_panel/button/ui_mixin_button_draggable");
    var util = require("KCEPROD/util/util");
    var ns = window.kc.ns;
    return defineComponent(uiMixinButtonDraggable, uiTextButton);

    function uiTextButton() {
        this.helperElm = function() {
            return $("<input/>", {
                text: '我是文本',
                class: "tmpdrag",
                targettype: "text"
            });
        };

        this.doDirectInsert = function (e, data){
            var lastIdx = util.getLastCanvasItemIndex();

            this.trigger(ns.e.createNode, {
                itemtype: "text",
                para : {},
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
