/*
 * @Author: Vaninadh
 * @Date:   2016-04-18 17:52:08
 * @Last Modified by:   Vaninadh
 * @Last Modified time: 2016-05-17 11:09:57
 */

define(function(require) {
    var ns = window.kc.ns;
    var util = require("KCEPROD/util/util");
    return uiPropertyBase;

    function uiPropertyBase() {
        this.attributes({
            loadonce: false,
            targetEl: '',
            targetKcPath: '',
            targetItemKcPath: '',
            propertyData: {},
            propertyPanelDom: ""
        });

        this.activateProperty = function(e, data) {
            //set target obj
            this.attr.targetEl = $(data.el);
            this.attr.targetKcPath =  util.kcpathToSelector(util.constructKcPath(this.attr.targetEl.context), window.kc.ns.c.canvasClass + ' > ' + window.kc.ns.c.rootContainer);
            this.attr.targetItemKcPath = util.constructKcPath(this.attr.targetEl.context);
            //initialize once panel
            if (!this.attr.loadonce) {
                this.attr.propertyPanelDom = $(this.getPropertyHtml());
                //all plugins DOM render
                this.renderDom();

                this.attr.propertyPanelDom.appendTo('body');
                this.attr.loadonce = true;
            }

            //init element`s property
            this.prepareProperty();

            //show kctype property panel
            $(this.attr.propertyPanelSelector).show();
        }

        this.getPropertyHtml = function() {
            return [
                '<div id="' + this.attr.propertyPanelId + '" class="property-panel bgInk width2 RightWrapper clearfix minHeight" style="position:fixed;top:40px;right:0px;z-index:1001;">',
                '</div>'
            ].join('\n');
        }
    }
});
