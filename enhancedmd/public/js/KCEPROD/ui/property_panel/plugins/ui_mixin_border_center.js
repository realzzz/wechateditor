/*
 * @Author: Vaninadh
 * @Date:   2016-04-20 11:08:16
 * @Last Modified by:   Vaninadh
 * @Last Modified time: 2016-04-21 10:59:28
 */

define(function(require) {
    var compose = require("flight/lib/compose");
    var uiMixinBorderStyle = require("KCEPROD/ui/property_panel/plugins/border/ui_mixin_border_style");
    var uiMixinBorderWidth = require("KCEPROD/ui/property_panel/plugins/border/ui_mixin_border_width");
    var uiMixinBorderColor = require("KCEPROD/ui/property_panel/plugins/border/ui_mixin_border_color");

    var ns = window.kc.ns;
    return uiMixinBorderCenter;

    function uiMixinBorderCenter() {

        compose.mixin(this, [uiMixinBorderStyle, uiMixinBorderWidth, uiMixinBorderColor]);

        this.attributes({
            borderCenterDom: "",
            borderCenterSelector: "#uiBorderCenter",
            borderCenterBoxSelector: "#uiBorderCenterBox"
        });

        this.renderBorderCenter = function() {
            this.attr.borderCenterDom = $(this.getBorderCenterHtml());
            this.renderBorderCenterChildren();
            this.attr.borderCenterDom.appendTo(this.attr.propertyPanelDom);
        };

        this.renderBorderCenterChildren = function() {
            this.renderBorderStyle();
            this.renderBorderWidth();
            this.renderBorderColor();
        };

        this.prepareBorderCenter = function() {
            this.prepareBorderStyle();
            this.prepareBorderWidth();
            this.prepareBorderColor();
        };

        this.getBorderCenterHtml = function() {
            return [
                '<div id="uiBorderCenter" class="borderB1 pb15">',
                '<div class="font14 colorWhite pl15 pt10 ">边框</div>',
                '<div id="uiBorderCenterBox" class="border-box">',
                '</div>',
                '</div>',
            ].join('\n');
        }
    };
});
