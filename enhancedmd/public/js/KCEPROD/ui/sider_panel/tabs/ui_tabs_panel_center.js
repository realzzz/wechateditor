/*
 * @Author: Vaninadh
 * @Date:   2016-03-30 10:57:34
 * @Last Modified by:   Vaninadh
 * @Last Modified time: 2016-04-13 16:06:45
 */

define(function(require) {
    var defineComponent = require("flight/lib/component");
    var uiTabPanelTemp = require("KCEPROD/ui/sider_panel/tabs/ui_tab_panel_temp");
    var uiTabPanelCollect = require("KCEPROD/ui/sider_panel/tabs/ui_tab_panel_collect");
    var uiTabPanelLibrary = require("KCEPROD/ui/sider_panel/tabs/ui_tab_panel_library");
    var uiTabPanel3rdParty = require("KCEPROD/ui/sider_panel/tabs/ui_tab_panel_3rdparty");
    var ns = window.kc.ns;
    var tabs_event_map = {
        'tab-temp': ns.e.tab.uiTabTemp,
        'tab-collect': ns.e.tab.uiTabCollect,
        'tab-library': ns.e.tab.uiTabLibrary,
        'tab-others': ns.e.tab.uiTabOthers
    };
    return defineComponent(uiTabsPanelCenter);

    function uiTabsPanelCenter() {
        this.attributes({
            introBtn: "#introBtn",
            suggestBtn: "#suggestBtn",
        });

        this.dispatchTabs = function(e, data) {
            var id = data.id;
            if(id!=undefined){
                this.trigger(tabs_event_map[id],{
                    id:id
                });
            }
            //console.log(tabs_event_map[id]);
        }

        this.goIntroduction = function (e, data){
            var win = window.open('pages/i_desc.html', '_blank');
            win.focus();
        }

        this.showSuggestInfo = function (e, data){
            var me = this;
            this.trigger(ns.e.canvas.uiNotifyInfoConfirm, {
                text: "<b>感谢使用多维编辑器</b> <br> <br>你可以通过以下几种方式联系我们 <br><br> 多维用户qq群： 283495942 <br> 新浪微博: 多一维编辑器 <br> 邮箱: zhangp#kunion.com.cn"
            });
        }

        this.after("initialize", function() {
            console.log("uiTabsPanelCenter is ok!");

            uiTabPanelTemp.attachTo(document);
            uiTabPanelCollect.attachTo(document);
            uiTabPanelLibrary.attachTo(document);
            uiTabPanel3rdParty.attachTo(document);

            this.on(ns.e.tab.uiTabsPanelCenter, this.dispatchTabs);

            this.on(this.attr.introBtn, 'click', this.goIntroduction);
            this.on(this.attr.suggestBtn, 'click', this.showSuggestInfo);
        });
    }
});
