/*
 * @Author: Vaninadh
 * @Date:   2016-04-18 18:59:40
 * @Last Modified by:   Vaninadh
 * @Last Modified time: 2016-04-20 10:46:02
 */

define(function(require) {
    var ns = window.kc.ns;
    var util = require("KCEPROD/util/util");

    var direction_value_map = {
        'conDirectionH':'h',
        'conDirectionV':'v'
    };

    return uiMixinContainerDirection;

    function uiMixinContainerDirection() {
        this.attributes({
            directionDom: "",
            conDirectionHSelector: "#conDirectionH",
            conDirectionVSelector: "#conDirectionV"
        });

        this.renderContainerDirection = function() {
            this.attr.directionDom = $(this.getDirectionHtml());
            this.attachEventToContainerDirection();
            this.attr.directionDom.appendTo(this.attr.propertyPanelDom);
        };

        this.attachEventToContainerDirection = function() {
            var me = this;

            this.on(document, "click", {
                conDirectionHSelector: this.setDirection,
                conDirectionVSelector: this.setDirection
            });
        };

        this.prepareContainerDirection = function() {
            var me = this;

        };

        this.setDirection = function(e, data) {
            var me = this;
            var updateObj = direction_value_map[e.currentTarget.id];
            if (updateObj != undefined) {
                this.trigger(ns.e.updateNode, {
                    para: {
                        direction:updateObj
                    },
                    kcpath: this.attr.targetKcPath
                });
            }

        };

        this.getDirectionHtml = function() {
            return [
                '<div class="borderB1">',
                '<div class="font14 colorWhite pl15 pt10">排列方向</div>',
                '<div class="pt5 pb15 textC barBox">',
                '<div>\
                    <a id="conDirectionH" title="水平" class="pr15"><img src="images/con_d_h.png"></a>\
                    <a id="conDirectionV" title="垂直" class="pl15"><img src="images/con_d_v.png"></a>\
                 </div>',
                '</div>'
            ].join('\n');
        }
    };
});
