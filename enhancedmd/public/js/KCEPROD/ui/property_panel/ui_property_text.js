/*
 * @Author: Vaninadh
 * @Date:   2016-04-15 10:50:29
 * @Last Modified by:   Vaninadh
 * @Last Modified time: 2016-04-19 16:06:07
 */

define(function(require) {
    var defineComponent = require("flight/lib/component");
    var uiMixinPropertyBase = require("KCEPROD/ui/property_panel/ui_mixin_property_base");
    var uiMixinBackgroundColor = require("KCEPROD/ui/property_panel/plugins/ui_mixin_background_color");
    var uiMixinTextCenter = require("KCEPROD/ui/property_panel/plugins/ui_mixin_text_center");
    var uiMixinRotate = require("KCEPROD/ui/property_panel/plugins/ui_mixin_rotate");
    var uiMixinItemRemove = require("KCEPROD/ui/property_panel/plugins/ui_mixin_item_remove");

    var ns = window.kc.ns;
    return defineComponent(uiMixinPropertyBase,uiMixinBackgroundColor,uiMixinTextCenter, uiMixinRotate, uiMixinItemRemove, uiPropertyText);

    function uiPropertyText() {
        this.attributes({
            propertyPanelId: "uiPropertyText",
            propertyPanelSelector: "#uiPropertyText"
        });

        this.renderDom = function() {
            //this.renderBackgroundColor();
        	this.renderTextCenter();
            this.renderRotate();
            this.renderRemove();
        }

        this.prepareProperty = function(data) {
            this.attr.propertyData.style = {};
            //all plugins data prepare
            //this.prepareBackgroundColor();
            this.prepareTextCenter();
            this.prepareRotate();
            this.prepareRemove();
        }

        this.after("initialize", function() {
            console.log("uiPropertyText is ok!");
            this.on(document, ns.e.property.uiPropertyTextActivate, this.activateProperty); //this.$node.on("click", );


        });
    }
});
