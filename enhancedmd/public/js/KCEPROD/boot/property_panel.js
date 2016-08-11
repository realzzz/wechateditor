/*
 * @Author: Vaninadh
 * @Date:   2016-03-28 15:42:56
 * @Last Modified by:   Vaninadh
 * @Last Modified time: 2016-04-16 10:20:05
 */

define(function(require) {
    var defineComponent = require("flight/lib/component");
    var uiPropertyCenter = require("KCEPROD/ui/property_panel/ui_property_center");
 
    return defineComponent(propertyPanel);

    function propertyPanel() {
        this.attributes({

        });

        this.after('initialize', function() {
            console.log("propertyPanel is ok!")
            uiPropertyCenter.attachTo(document);
        });
    }
});