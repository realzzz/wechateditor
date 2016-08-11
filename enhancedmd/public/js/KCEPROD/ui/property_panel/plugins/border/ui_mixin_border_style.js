/*
* @Author: Vaninadh
* @Date:   2016-04-20 14:32:12
* @Last Modified by:   Vaninadh
* @Last Modified time: 2016-04-21 17:13:55
*/

define(function(require) {
    var ns = window.kc.ns;
    return uiMixinBorderStyle;

    function uiMixinBorderStyle() {
        this.attributes({
            borderStyleDom: "",
            borderStyleSelector: "select"
        });

        this.renderBorderStyle = function() {
            this.attr.borderStyleDom = $(this.getBorderStyleHtml());
            this.attachEventToBorderStyle();
            this.attr.borderStyleDom.appendTo(this.attr.borderCenterDom.find(this.attr.borderCenterBoxSelector));
        };

        this.attachEventToBorderStyle = function() {
            var mePropertyDom = this.attr.borderStyleDom;
            var me = this;
            var borderStyleDivObj = mePropertyDom.find(this.attr.borderStyleSelector);
            
            var borderstyle = [
                { name: '无', val: 'none' },
                { name: '虚线', val: 'dashed' },
                { name: '实线', val: 'solid' }
            ];

            for (var i in borderstyle) {
                $('<option>').attr({
                    value: borderstyle[i].val
                }).html(borderstyle[i].name).appendTo(borderStyleDivObj);
            }

            borderStyleDivObj.selectmenu({
                appendTo: me.attr.propertyPanelDom,
                width: 30,
                icons: false,
                change: function(event, data) {
                    me.trigger(ns.e.updateNode, {
                            para: {
                                style: {
                                    'border-style': data.item.value
                                }
                            },
                            kcpath: me.attr.targetKcPath
                        });
                }
            });
        };

        this.prepareBorderStyle = function() {
            this.attr.propertyData.style['border-style'] = this.attr.targetEl.css('border-style');
            var mePropertyDom = this.attr.borderStyleDom;
            var borderStyleDivObj = mePropertyDom.find(this.attr.borderStyleSelector);

            borderStyleDivObj.val(this.attr.propertyData.style['border-style']);
            borderStyleDivObj.selectmenu("refresh");
        };

        this.getBorderStyleHtml = function() {
            return [
                '<div id="uiBorderStyle" class="displayI" style="margin:0px 10px;">',
                '<select>',
                '</select>',
                '</div>'
            ].join('\n');
        }
    };
});