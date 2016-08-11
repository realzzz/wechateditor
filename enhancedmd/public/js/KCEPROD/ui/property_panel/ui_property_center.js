/*
 * @Author: Vaninadh
 * @Date:   2016-04-15 17:49:50
 * @Last Modified by:   Vaninadh
 * @Last Modified time: 2016-04-16 10:29:38
 */

define(function(require) {
    var defineComponent = require("flight/lib/component");
    var uiPropertyContainer = require("KCEPROD/ui/property_panel/ui_property_container");
    var uiPropertyText = require("KCEPROD/ui/property_panel/ui_property_text");
    var uiPropertyImage = require("KCEPROD/ui/property_panel/ui_property_image");
    var ns = window.kc.ns;

    var property_event_map = {
        'text': ns.e.property.uiPropertyTextActivate,
        'image': ns.e.property.uiPropertyImageActivate,
        'container': ns.e.property.uiPropertyContainerActivate
    };
    return defineComponent(uiPropertyCenter);

    function uiPropertyCenter() {
        this.attributes({
        	allPropertyPanelSelector:".property-panel"
        });

        this.dispatchPanel = function(e, data) {
            var kctype = data.el.attributes['kctype'].value;
            if (kctype != undefined) {
            	this.hidePanel();
                this.trigger(property_event_map[kctype], data);
            }

        }
		this.hidePanel= function(e, data) {
            $(this.attr.allPropertyPanelSelector).hide();
        }

        this.after("initialize", function() {
            console.log("uiPropertyCenter is ok!");

            uiPropertyContainer.attachTo(document);
            uiPropertyText.attachTo(document);
            uiPropertyImage.attachTo(document);

            this.on(document, ns.e.property.uiPropertyCenterDispatch, this.dispatchPanel);
            this.on(document, ns.e.property.uiPropertyPanelHide, this.hidePanel);
            this.on(document, ns.e.canvas_clear_selection, this.hidePanel);
        });
    }
});
