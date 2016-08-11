/*
 * @Author: Vaninadh
 * @Date:   2016-04-20 15:41:41
 * @Last Modified by:   Vaninadh
 * @Last Modified time: 2016-04-21 11:12:07
 */

define(function(require) {
    var ns = window.kc.ns;
    return uiMixinBorderWidth;

    function uiMixinBorderWidth() {
        this.attributes({
            borderWidthDom: "",
            borderWidthSelector: "#uiBorderWidth"
        });

        this.renderBorderWidth = function() {
            this.attr.borderWidthDom = $(this.getBorderWidthHtml());
            this.attachEventToBorderWidth();
            this.attr.borderWidthDom.appendTo(this.attr.borderCenterDom.find(this.attr.borderCenterBoxSelector));
        };

        this.attachEventToBorderWidth = function() {
            var me = this;
            this.attr.borderWidthDom.find(this.attr.borderWidthSelector).slider({
                slide: function(event, ui) {
                    me.attr.targetEl.css('border-width', ui.value/5 + 'px');
                },
                stop: function(event, ui) {
                    me.trigger(ns.e.updateNode, {
                        para: {
                            style: {
                                'border-width': me.attr.targetEl.css("border-width")
                            }
                        },
                        kcpath: me.attr.targetKcPath
                    });
                }
            });
        };

        this.prepareBorderWidth = function() {
            var oriWidth = this.attr.targetEl.css('border-width');
            var style = this.attr.propertyData.style;
            var widthNumber = oriWidth.substring(0, oriWidth.length - 2);

            style['border-width'] = oriWidth;

            this.attr.borderWidthDom.find(this.attr.borderWidthSelector).slider('value', widthNumber);
        };

        this.getBorderWidthHtml = function() {
            return [
            	'<div class="displayI" style="margin:0px 5px;">',
                '<div id="uiBorderWidth" style="width: 80px;"></div>',
            	'</div>'
            ].join('\n');
        }
    };
});
