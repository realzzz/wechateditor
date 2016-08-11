/*
 * @Author: Vaninadh
 * @Date:   2016-03-16 14:17:40
 * @Last Modified by:   Vaninadh
 * @Last Modified time: 2016-04-12 17:38:09
 */

//sider panel
define(function(require) {
    var defineComponent = require("flight/lib/component");
    var uiTabsPanelCenter = require('KCEPROD/ui/sider_panel/tabs/ui_tabs_panel_center');
    var uiContainerButton = require('KCEPROD/ui/sider_panel/button/ui_container_button');
    var uiImageButton = require('KCEPROD/ui/sider_panel/button/ui_image_button');
    var uiTextButton = require('KCEPROD/ui/sider_panel/button/ui_text_button');

    var ns = window.kc.ns;
    return defineComponent(siderPanel);

    function siderPanel() {
        this.attributes({
            tabsSelector: "#tabs"
        });
        //activate only  when the tab activate can be trigger ,initialize in first time ,we have to use create event
        this.tabsInit = function() {

            $(this.attr.tabsSelector).tabs({
                collapsible: true,
                active: false,
                //create:this.tabsCreate.bind(this),
                activate: this.tabsActivate.bind(this)
            });
        }
        //the first tab
       /* this.tabsCreate=function(event, ui) {
            this.trigger(ns.e.tab.uiTabsPanelCenter, {
                id: 'tab-temp',
                ui:ui
            });
        }*/

        this.tabsActivate = function(event, ui) {
            this.trigger(ns.e.tab.uiTabsPanelCenter, {
                id: $(ui.newPanel).attr('id'),
                ui:ui
            });
        }

        this.after('initialize', function() {
            console.log("siderPanel is ok!");
            uiContainerButton.attachTo('#containerBtn');
            uiImageButton.attachTo('#imageBtn');
            uiTextButton.attachTo('#textBtn');
            uiTabsPanelCenter.attachTo(document);
            this.tabsInit();
        })
    }
});
