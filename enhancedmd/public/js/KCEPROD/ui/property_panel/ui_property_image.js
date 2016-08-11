/*
 * @Author: Vaninadh
 * @Date:   2016-04-15 10:50:04
 * @Last Modified by:   Vaninadh
 * @Last Modified time: 2016-04-22 15:14:14
 */

define(function(require) {
    var defineComponent = require("flight/lib/component");
    var uiMixinPropertyBase = require("KCEPROD/ui/property_panel/ui_mixin_property_base");
    var uiMixinBorderRadius = require("KCEPROD/ui/property_panel/plugins/ui_mixin_border_radius");
    var uiMixinBorderCenter = require("KCEPROD/ui/property_panel/plugins/ui_mixin_border_center");
    var uiMixinRotate = require("KCEPROD/ui/property_panel/plugins/ui_mixin_rotate");
    var uiMixinAlign = require("KCEPROD/ui/property_panel/plugins/image/ui_mixin_image_align");
    var uiMixinItemRemove = require("KCEPROD/ui/property_panel/plugins/ui_mixin_item_remove");

    var ns = window.kc.ns;

    return defineComponent(uiMixinPropertyBase, uiMixinBorderRadius, uiMixinBorderCenter,uiMixinRotate, uiMixinAlign, uiMixinItemRemove, uiPropertyImage);

    function uiPropertyImage() {
        this.attributes({
            propertyPanelId: "uiPropertyImage",
            propertyPanelSelector: "#uiPropertyImage"
        });

        this.renderDom = function() {
            this.renderBorderRadius();
            this.renderBorderCenter();
            this.renderRotate();
            this.renderImageAlign();
            this.renderRemove();
        }

        this.prepareProperty = function(data) {
            this.attr.propertyData.style = {};
            //all plugins data prepare
            this.prepareBorderRadius();
            this.prepareBorderCenter();
            this.prepareRotate();
            this.prepareImageAlign();
            this.prepareRemove();
        }

        this.after("initialize", function() {
            console.log("uiPropertyImage is ok!");
            this.on(document, ns.e.property.uiPropertyImageActivate, this.activateProperty);
            //this.$node.on("click", );
        });
    }
});
