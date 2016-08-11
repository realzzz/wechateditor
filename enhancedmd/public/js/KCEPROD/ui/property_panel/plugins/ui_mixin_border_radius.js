/*
 * @Author: Vaninadh
 * @Date:   2016-04-18 18:59:40
 * @Last Modified by:   Vaninadh
 * @Last Modified time: 2016-04-20 10:46:02
 */

define(function(require) {
    var ns = window.kc.ns;
    return uiMixinBorderRadius;

    function uiMixinBorderRadius() {
        this.attributes({
            borderRadiusDom: "",
            borderRadiusSelector: "#uiBorderRadius"
        });

        this.renderBorderRadius = function() {
            this.attr.borderRadiusDom = $(this.getBorderRadiusHtml());
            this.attachEventToBorderRadius();
            this.attr.borderRadiusDom.appendTo(this.attr.propertyPanelDom);
        };

        this.attachEventToBorderRadius = function() {
            var mePropertyDom = this.attr.borderRadiusDom;
            var me = this;
            var borderRadiusDivObj = mePropertyDom.find(this.attr.borderRadiusSelector);

            borderRadiusDivObj.slider({
                slide: function(event, ui) {
                    me.attr.targetEl.css('borderRadius', ui.value + 'px');
                },
                stop: function(event, ui) {
                	me.trigger(ns.e.updateNode, {
		                para: {
		                    style: {
		                        'border-radius': me.attr.targetEl.css("borderRadius")
		                    }
		                },
		                el: me.attr.targetEl
            		});
                }
            });

        };

        this.prepareBorderRadius = function() {
            var oriRadius = this.attr.targetEl.css('borderRadius');
            var style = this.attr.propertyData.style;
            var radiusNumber = oriRadius.substring(0, oriRadius.length - 2);

            style['border-radius'] = oriRadius;

            var mePropertyDom = this.attr.borderRadiusDom;
            var borderRadiusDivObj = mePropertyDom.find(this.attr.borderRadiusSelector);

            borderRadiusDivObj.slider('value', radiusNumber);
        };

        this.getBorderRadiusHtml = function() {
            return [
                '<div class="borderB1">',
                '<div class="font14 colorWhite pl15 pt10">圆角</div>',
                '<div class="pt5 pb15 textC barBox">',
                '<div id="uiBorderRadius" style="width: 115px;"></div>',
                '</div>'
            ].join('\n');
        }
    };
});