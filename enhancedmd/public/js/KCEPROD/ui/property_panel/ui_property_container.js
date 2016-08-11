/*
 * @Author: Vaninadh
 * @Date:   2016-03-29 11:59:24
 * @Last Modified by:   Vaninadh
 * @Last Modified time: 2016-04-20 15:24:26
 */

define(function(require) {
    var defineComponent = require("flight/lib/component");
    var uiMixinPropertyBase = require("KCEPROD/ui/property_panel/ui_mixin_property_base");
    var uiMixinBorderRadius = require("KCEPROD/ui/property_panel/plugins/ui_mixin_border_radius");
    var uiMixinBackgroundColor = require("KCEPROD/ui/property_panel/plugins/ui_mixin_background_color");
    var uiMixinBorderCenter = require("KCEPROD/ui/property_panel/plugins/ui_mixin_border_center");
    var uiMixinRotate = require("KCEPROD/ui/property_panel/plugins/ui_mixin_rotate");
    var uiMixinContainerDirection = require("KCEPROD/ui/property_panel/plugins/container/ui_mixin_container_direction");
    var uiMixinItemRemove = require("KCEPROD/ui/property_panel/plugins/ui_mixin_item_remove");
    var util = require("KCEPROD/util/util");
    var ns = window.kc.ns;

    return defineComponent(uiMixinPropertyBase, uiMixinBorderRadius, uiMixinBackgroundColor, uiMixinBorderCenter,uiMixinRotate,uiMixinContainerDirection, uiMixinItemRemove, uiPropertyContainer);

    function uiPropertyContainer() {
        this.attributes({
            propertyPanelId: "uiPropertyContainer",
            propertyPanelSelector: "#uiPropertyContainer"
        });

        this.renderDom = function() {
            this.renderBackgroundColor();
            this.renderBorderRadius();
            this.renderBorderCenter();
            this.renderRotate();
            this.renderContainerDirection();
            this.renderRemove();
        }

        this.prepareProperty = function() {
            this.attr.propertyData.style = {};
            //all plugins data prepare
            this.prepareBackgroundColor();
            this.prepareBorderRadius();
            this.prepareBorderCenter();
            this.prepareRotate();
            this.prepareContainerDirection();
            this.prepareRemove();
        }

        this.containerActivateProperty = function(e, data) {
            var targetEl = $(data.el);
            var kcpath = util.constructKcPath(targetEl.context);

            if (kcpath === "") {
                // do nothing  - handlement moved to entext.js, as here only deals with property panel
            }
            else{
                this.activateProperty(e, data);
            }
        }

        this.checkQueryforContainer = function (e, data){
            var respEvent = data.respEvent;
            if (this.attr.kcpath !== "") {
                this.trigger(respEvent, {kcpath: this.attr.kcpath, content:data.content});
            }
        }

        this.after("initialize", function() {
            console.log("uiPropertyContainer is ok!");
            this.on(document, ns.e.property.uiPropertyContainerActivate, this.containerActivateProperty);
            this.on(document, ns.e.querySelectionContainer, this.checkQueryforContainer);
        });
    }
});
