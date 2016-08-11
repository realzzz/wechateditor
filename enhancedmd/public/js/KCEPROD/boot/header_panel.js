/*
* @Author: Vaninadh
* @Date:   2016-03-28 15:43:20
* @Last Modified by:   Vaninadh
* @Last Modified time: 2016-05-10 19:26:39
*/

define(function(require) {
    var defineComponent = require("flight/lib/component");
    var uiHeader = require('KCEPROD/ui/header_panel/ui_header')
    var uiOperation = require('KCEPROD/ui/header_panel/ui_operation');
    var uiPreview = require('KCEPROD/ui/header_panel/ui_preview');

    var uiSkinChange = require('KCEPROD/ui/header_panel/ui_skin_change');
    var ns = window.kc.ns;

    return defineComponent(headerPanel);

    function headerPanel() {
        this.attributes({

        });

        this.after('initialize', function() {
        	console.log("headerPanel is ok!");
            uiHeader.attachTo(document);
            uiOperation.attachTo(document);
            uiPreview.attachTo(document);
            uiSkinChange.attachTo(document);

            this.trigger(ns.e.canvas.uiSkinChange);
        });
    }
});
