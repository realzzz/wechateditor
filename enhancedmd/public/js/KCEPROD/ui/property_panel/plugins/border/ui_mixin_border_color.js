/*
 * @Author: Vaninadh
 * @Date:   2016-04-20 16:50:30
 * @Last Modified by:   Vaninadh
 * @Last Modified time: 2016-04-21 11:23:26
 */

define(function(require) {
    var ns = window.kc.ns;
    return uiMixinBorderColor;

    function uiMixinBorderColor() {
        this.attributes({
            borderColorDom: "",
            borderColorSelector: "#uiBorderColor"
        });

        this.renderBorderColor = function() {
            this.attr.borderColorDom = $(this.getBorderColorHtml());
            this.attachEventToBorderColor();
            this.attr.borderColorDom.appendTo(this.attr.borderCenterDom.find(this.attr.borderCenterBoxSelector));
        };

        this.attachEventToBorderColor = function() {
            var me = this;
            this.attr.borderColorDom.find('input').minicolors({
                format: 'rgb',
                opacity: false,
                position:'bottom right',
                defaultValue: 'rgb(1,1,1)',
                change: function(value, opacity) {
                    if (me.attr.targetEl.css('border-color') !== value) {
                        me.trigger(ns.e.updateNode, {
                            para: {
                                style: {
                                    'border-color': value
                                }
                            },
                            kcpath: me.attr.targetKcPath
                        });
                    }
                },
                hide: function() {

                }
            });
        };

        this.prepareBorderColor = function() {
            this.attr.propertyData.style['border-color'] = this.attr.targetEl.css('border-color');

        	var mePropertyDom = this.attr.borderColorDom;
        	var colorInputObj = mePropertyDom.find('input');

        	colorInputObj.minicolors('value',this.attr.propertyData.style['border-color']);
        };

        this.getBorderColorHtml = function() {
            return [
                '<div id="uiBorderColor" class="displayI" style="margin:0px 10px;">',
                '<input type="hidden">',
                '</div>'
            ].join('\n');
        }
    };
});