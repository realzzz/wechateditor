/*
 * @Author: Vaninadh
 * @Date:   2016-03-30 19:50:30
 * @Last Modified by:   Vaninadh
 * @Last Modified time: 2016-04-26 10:49:05
 */

define(function(require) {
    var defineComponent = require("flight/lib/component");

    var uiTabPanelCollectLove = require("KCEPROD/ui/sider_panel/tabs/ui_tab_panel_collect/ui_tab_panel_collect_love");
    var uiTabPanelCollectProduce = require("KCEPROD/ui/sider_panel/tabs/ui_tab_panel_collect/ui_tab_panel_collect_produce");

    var ns = window.kc.ns;

    return defineComponent(uiTabPanelCollect);

    function uiTabPanelCollect() {
        this.attributes({
            loadonce: false,
            tabsSelector:"#tab-collect",
            produceTabId:"collect-produce-tab",
            loveTabId:"collect-love-tab"
        });

        this.renderTab = function(e, data) {
            if (!this.attr.loadonce) {

                uiTabPanelCollectLove.attachTo(document);
                uiTabPanelCollectProduce.attachTo(document);

                $(this.attr.tabsSelector).tabs({
                    create:this.tabsCreate.bind(this),
                    activate: this.tabsActivate.bind(this)
                });
                this.attr.loadonce = true;
            }

            

        }
        //first create
        this.tabsCreate=function(event, ui){
            this.trigger(ns.e.tab.uiCollectTabProduce);
        }

        this.tabsActivate = function(event, ui) {
            var id=$(ui.newPanel).attr('id');
            //my produce tab
            if(id==this.attr.produceTabId){
                this.trigger(ns.e.tab.uiCollectTabProduce);
            };
            //my love tab
            if(id==this.attr.loveTabId){
                this.trigger(ns.e.tab.uiCollectTabLove);
            };
        }

        this.after("initialize", function() {
            console.log("uiTabPanelCollect is ok!");
            this.on(ns.e.tab.uiTabCollect, this.renderTab);

        });
    }
});